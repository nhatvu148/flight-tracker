import { Router } from "express";
import {
  airports,
  findAirport,
  searchAirports,
} from "../services/static-data.service.js";

export const airportsRouter = Router();

// GET /api/airports?limit=&q=
airportsRouter.get("/", (req, res) => {
  const { limit, q } = req.query;

  if (q && typeof q === "string") {
    const results = searchAirports(q, limit ? Number(limit) : 50);
    return res.json(results);
  }

  if (limit) {
    return res.json(airports.slice(0, Number(limit)));
  }

  res.json(airports);
});

// GET /api/airports/:code
airportsRouter.get("/:code", (req, res) => {
  const { code } = req.params;
  const airport = findAirport(code);

  if (!airport) {
    return res.status(404).json({ error: `Airport ${code} not found` });
  }

  res.json(airport);
});
