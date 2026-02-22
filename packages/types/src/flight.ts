interface ICode {
  iataCode: string;
  icaoCode: string;
}

interface Aircraft extends ICode {
  icao24: string;
  regNumber: string;
}

interface FlightIdentifier {
  iataNumber: string;
  icaoNumber: string;
  number: string;
}

interface Geography {
  altitude: number;
  direction: number;
  latitude: number;
  longitude: number;
}

interface Speed {
  horizontal: number;
  isGround: number;
  vspeed: number;
}

interface FlightSystem {
  squawk: number;
  updated: number;
}

export interface FlightData {
  aircraft: Aircraft;
  airline: ICode;
  arrival: ICode;
  departure: ICode;
  flight: FlightIdentifier;
  geography: Geography;
  originCountry?: string;
  speed: Speed;
  status: string;
  system: FlightSystem;
}

export interface AirportData {
  GMT: string;
  airportId: number;
  codeIataAirport: string;
  codeIataCity: string;
  codeIcaoAirport: string;
  codeIso2Country: string;
  geonameId: string;
  latitudeAirport: number;
  longitudeAirport: number;
  nameAirport: string;
  nameCountry: string;
  phone: string;
  timezone: string;
}
