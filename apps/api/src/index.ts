import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { API_CONFIG } from "@flight-tracker/config";
import { flightsRouter } from "./routes/flights.routes.js";
import { airportsRouter } from "./routes/airports.routes.js";

const app = express();
const port = process.env.PORT ?? API_CONFIG.defaultPort;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

app.use("/api/flights", flightsRouter);
app.use("/api/airports", airportsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Flight Tracker API running on http://localhost:${port}`);
});
