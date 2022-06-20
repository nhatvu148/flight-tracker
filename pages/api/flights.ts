// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import data from "data/flights.json";
import { FlightData } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightData[]>
) {
  res.status(200).json(data as FlightData[]);
}
