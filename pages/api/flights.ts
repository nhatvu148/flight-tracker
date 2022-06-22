// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import data from "data/flights.json";
import { FlightData } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightData[]>
) {
  const { limit } = req.query;
  console.log(req.query);
  let responseData =
    limit !== undefined
      ? (data as FlightData[]).slice(0, Number(limit))
      : (data as FlightData[]);
  res.status(200).json(responseData);
}
