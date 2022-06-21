import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const getAirports = async () => {
  const response = await axios.get(`https://aviation-edge.com/v2/public/flights?key=${publicRuntimeConfig.aviationToken}`); // http://localhost:8080/api/airports
  return response.data;
};
