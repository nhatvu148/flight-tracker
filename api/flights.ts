import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const getFlights = async () => {
  const response = await axios.get(`https://aviation-edge.com/v2/public/flights?key=${publicRuntimeConfig.aviationToken}&limit=6000`); // http://localhost:8080/api/flights
  return response.data;
};
