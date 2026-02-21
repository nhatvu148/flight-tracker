import { Router } from "express";
import type { AirportData } from "@flight-tracker/types";

export const airportsRouter = Router();

// GET /api/airports?limit=
airportsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    // TODO: Integrate airport data source (OurAirports CSV or DB)
    const airports: AirportData[] = [];
    res.json(airports);
  } catch (error) {
    console.error("Error fetching airports:", error);
    res.status(500).json({ error: "Failed to fetch airports" });
  }
});

// GET /api/airports/:code
airportsRouter.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    // TODO: Fetch single airport detail
    res.json({ message: `Airport ${code} detail — not yet implemented` });
  } catch (error) {
    console.error("Error fetching airport:", error);
    res.status(500).json({ error: "Failed to fetch airport" });
  }
});
