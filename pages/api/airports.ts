// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import data from "data/airports.json";
import { AirportData } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AirportData>
) {
  res.status(200).json(data as AirportData);
}
