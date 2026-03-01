import { Router } from "express";
import { airlines } from "../services/static-data.service.js";

export const airlinesRouter = Router();

// GET /api/airlines?limit=&q=
airlinesRouter.get("/", (req, res) => {
  const { limit, q } = req.query;

  if (q && typeof q === "string") {
    const query = q.toLowerCase();
    const results = (airlines as Record<string, string>[]).filter(
      (a) =>
        a.nameAirline?.toLowerCase().includes(query) ||
        a.codeIataAirline?.toLowerCase().includes(query) ||
        a.codeIcaoAirline?.toLowerCase().includes(query)
    );
    return res.json(limit ? results.slice(0, Number(limit)) : results);
  }

  if (limit) {
    return res.json(airlines.slice(0, Number(limit)));
  }

  res.json(airlines);
});
