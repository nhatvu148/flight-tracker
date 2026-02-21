import { readFileSync } from "fs";
import { join } from "path";
import type { AirportData } from "@flight-tracker/types";

const DATA_DIR = join(process.cwd(), "data");

function loadJSON<T>(filename: string): T {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw);
}

// Load once at startup — 10K airports, 13K airlines, etc.
export const airports: AirportData[] = loadJSON("airports.json");
export const airlines: unknown[] = loadJSON("airlines.json");
export const countries: unknown[] = loadJSON("countries.json");
export const cities: unknown[] = loadJSON("cities.json");
export const planeTypes: unknown[] = loadJSON("planeTypes.json");
export const routes: unknown[] = loadJSON("routes.json");

// Index airports by IATA and ICAO for O(1) lookup
const airportByIata = new Map<string, AirportData>();
const airportByIcao = new Map<string, AirportData>();

for (const a of airports) {
  if (a.codeIataAirport) airportByIata.set(a.codeIataAirport.toUpperCase(), a);
  if (a.codeIcaoAirport) airportByIcao.set(a.codeIcaoAirport.toUpperCase(), a);
}

export function findAirport(code: string): AirportData | undefined {
  const upper = code.toUpperCase();
  return airportByIata.get(upper) ?? airportByIcao.get(upper);
}

export function searchAirports(query: string, limit = 50): AirportData[] {
  const q = query.toLowerCase();
  const results: AirportData[] = [];

  for (const a of airports) {
    if (
      a.codeIataAirport?.toLowerCase().includes(q) ||
      a.codeIcaoAirport?.toLowerCase().includes(q) ||
      a.nameAirport?.toLowerCase().includes(q) ||
      a.nameCountry?.toLowerCase().includes(q)
    ) {
      results.push(a);
      if (results.length >= limit) break;
    }
  }

  return results;
}

console.log(
  `Loaded static data: ${airports.length} airports, ${airlines.length} airlines, ${countries.length} countries, ${cities.length} cities`
);
