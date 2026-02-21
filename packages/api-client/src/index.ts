import type { FlightData, AirportData } from "@flight-tracker/types";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
  }
  return process.env.API_URL ?? "http://localhost:5001";
};

export async function getFlights(
  bounds?: { north: number; south: number; east: number; west: number },
  limit?: number
): Promise<FlightData[]> {
  const params = new URLSearchParams();
  if (bounds) {
    params.set("north", String(bounds.north));
    params.set("south", String(bounds.south));
    params.set("east", String(bounds.east));
    params.set("west", String(bounds.west));
  }
  if (limit) params.set("limit", String(limit));

  const res = await fetch(`${getBaseUrl()}/api/flights/live?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch flights: ${res.status}`);
  return res.json();
}

export async function getFlight(id: string): Promise<FlightData> {
  const res = await fetch(`${getBaseUrl()}/api/flights/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch flight: ${res.status}`);
  return res.json();
}

export async function getAirports(limit?: number): Promise<AirportData[]> {
  const params = limit ? `?limit=${limit}` : "";
  const res = await fetch(`${getBaseUrl()}/api/airports${params}`);
  if (!res.ok) throw new Error(`Failed to fetch airports: ${res.status}`);
  return res.json();
}

export async function getAirport(code: string): Promise<AirportData> {
  const res = await fetch(`${getBaseUrl()}/api/airports/${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error(`Failed to fetch airport: ${res.status}`);
  return res.json();
}
