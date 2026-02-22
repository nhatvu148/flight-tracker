import type { FlightData } from "@flight-tracker/types";

const OPENSKY_API = "https://opensky-network.org/api";
const OPENSKY_TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";

// OAuth2 token cache
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  // Reuse token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const res = await fetch(OPENSKY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    console.warn(`OpenSky token request failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  console.log("OpenSky OAuth2 token acquired");
  return cachedToken.token;
}

interface OpenSkyState {
  // [0] icao24, [1] callsign, [2] origin_country, [3] time_position,
  // [4] last_contact, [5] longitude, [6] latitude, [7] baro_altitude,
  // [8] on_ground, [9] velocity, [10] true_track, [11] vertical_rate,
  // [12] sensors, [13] geo_altitude, [14] squawk, [15] spi, [16] position_source
  // [17] category
  0: string; // icao24
  1: string | null; // callsign
  2: string; // origin_country
  3: number | null; // time_position
  4: number; // last_contact
  5: number | null; // longitude
  6: number | null; // latitude
  7: number | null; // baro_altitude
  8: boolean; // on_ground
  9: number | null; // velocity
  10: number | null; // true_track (heading)
  11: number | null; // vertical_rate
  12: number[] | null; // sensors
  13: number | null; // geo_altitude
  14: string | null; // squawk
  15: boolean; // spi
  16: number; // position_source
}

interface OpenSkyResponse {
  time: number;
  states: OpenSkyState[] | null;
}

interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

function toFlightData(state: OpenSkyState): FlightData | null {
  const lat = state[6];
  const lng = state[5];
  const heading = state[10];
  const callsign = (state[1] ?? "").trim();

  // Skip entries without position
  if (lat === null || lng === null) return null;

  return {
    aircraft: {
      iataCode: "",
      icaoCode: "",
      icao24: state[0],
      regNumber: "",
    },
    airline: {
      iataCode: "",
      icaoCode: "",
    },
    arrival: {
      iataCode: "",
      icaoCode: "",
    },
    departure: {
      iataCode: "",
      icaoCode: "",
    },
    flight: {
      iataNumber: "",
      icaoNumber: callsign || state[0],
      number: callsign,
    },
    originCountry: state[2] || undefined,
    geography: {
      altitude: state[7] ?? state[13] ?? 0,
      direction: heading ?? 0,
      latitude: lat,
      longitude: lng,
    },
    speed: {
      horizontal: state[9] ?? 0,
      isGround: state[8] ? 1 : 0,
      vspeed: state[11] ?? 0,
    },
    status: state[8] ? "grounded" : "en-route",
    system: {
      squawk: state[14] ? parseInt(state[14], 10) : 0,
      updated: state[4],
    },
  };
}

export async function fetchLiveFlights(
  bounds?: BoundingBox
): Promise<FlightData[]> {
  let url = `${OPENSKY_API}/states/all`;

  if (bounds) {
    const params = new URLSearchParams({
      lamin: String(bounds.south),
      lamax: String(bounds.north),
      lomin: String(bounds.west),
      lomax: String(bounds.east),
    });
    url += `?${params}`;
  }

  const headers: Record<string, string> = {};
  const token = await getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    // Invalidate token on 401 so next call re-authenticates
    if (res.status === 401) cachedToken = null;
    throw new Error(`OpenSky API error: ${res.status} ${res.statusText}`);
  }

  const data: OpenSkyResponse = await res.json();

  if (!data.states) return [];

  const flights: FlightData[] = [];
  for (const state of data.states) {
    const flight = toFlightData(state);
    if (flight) flights.push(flight);
  }

  return flights;
}
