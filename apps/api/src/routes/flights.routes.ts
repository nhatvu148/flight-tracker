import { Router } from "express";
import { fetchLiveFlights } from "../services/opensky.service.js";

export const flightsRouter = Router();

// Keyed cache: "all" for global, "bounds:..." for bounded queries
const cacheMap = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 15_000; // 15 seconds

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
    console.error("Error fetching flights:", error);
    // On error, return any cached data as fallback
    const anyCached = cacheMap.values().next().value;
    if (anyCached) {
      return res.json(anyCached.data);
    }
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

// GET /api/flights/:id
flightsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Fetch single flight detail from FlightAware
    res.json({ message: `Flight ${id} detail — not yet implemented` });
  } catch (error) {
    console.error("Error fetching flight:", error);
    res.status(500).json({ error: "Failed to fetch flight" });
  }
});
