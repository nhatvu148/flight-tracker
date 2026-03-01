import { Router } from "express";
import { fetchLiveFlights } from "../services/opensky.service.js";

export const flightsRouter = Router();

// Keyed cache: "all" for global, "bounds:..." for bounded queries
const cacheMap = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds — avoids hammering OpenSky's rate limit

// GET /api/flights/live?north=&south=&east=&west=
flightsRouter.get("/live", async (req, res) => {
  try {
    const { north, south, east, west } = req.query;

    const hasBounds = north && south && east && west;
    const cacheKey = hasBounds
      ? `bounds:${Math.round(Number(north))},${Math.round(Number(south))},${Math.round(Number(east))},${Math.round(Number(west))}`
      : "all";

    // Return cached data if fresh
    const cached = cacheMap.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    const bounds = hasBounds
      ? {
          north: Number(north),
          south: Number(south),
          east: Number(east),
          west: Number(west),
        }
      : undefined;

    const flights = await fetchLiveFlights(bounds);

    cacheMap.set(cacheKey, { data: flights, timestamp: Date.now() });

    // Clean old cache entries (keep max 10)
    if (cacheMap.size > 10) {
      const oldest = [...cacheMap.entries()].sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )[0];
      if (oldest) cacheMap.delete(oldest[0]);
    }

    console.log(
      `Fetched ${flights.length} flights from OpenSky [${cacheKey}]`
    );

    res.json(flights);
  } catch (error) {
    // On error, return stale cached data as fallback
    for (const entry of cacheMap.values()) {
      return res.json(entry.data);
    }
    // No cache at all — return empty array instead of 500
    console.warn("OpenSky unavailable, no cache:", (error as Error).message);
    res.json([]);
  }
});

// GET /api/flights/:id — find a flight by icao24 from cached live data
flightsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const icao24 = id.toLowerCase();

    // Search all cached flight lists for the matching icao24
    for (const entry of cacheMap.values()) {
      const flights = entry.data as Array<{ aircraft: { icao24: string } }>;
      const found = flights.find(
        (f) => f.aircraft.icao24.toLowerCase() === icao24
      );
      if (found) return res.json(found);
    }

    // Not in cache — fetch global and search
    const flights = await fetchLiveFlights();
    cacheMap.set("all", { data: flights, timestamp: Date.now() });

    const found = flights.find(
      (f) => f.aircraft.icao24.toLowerCase() === icao24
    );
    if (found) return res.json(found);

    res.status(404).json({ error: "Flight not found" });
  } catch (error) {
    console.error("Error fetching flight:", error);
    res.status(500).json({ error: "Failed to fetch flight" });
  }
});
