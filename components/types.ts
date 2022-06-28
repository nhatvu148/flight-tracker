interface ICode {
  iataCode: string;
  icaoCode: string;
}

interface Aircraft extends ICode {
  icao24: string;
  regNumber: string;
}

interface Flight {
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

interface System {
  squawk: number;
  updated: number;
}

export interface FlightData {
  aircraft: Aircraft;
  airline: ICode;
  arrival: ICode;
  departure: ICode;
  flight: Flight;
  geography: Geography;
  speed: Speed;
  status: string;
  system: System;
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
