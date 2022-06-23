import axios from "axios";
import getConfig from "next/config";

export const getFlights = async (limit: number = undefined) => {
  const { publicRuntimeConfig } = getConfig();
  let API = publicRuntimeConfig.apiURL.includes("aviation-edge")
    ? `${publicRuntimeConfig.apiURL}/v2/public/flights?key=${publicRuntimeConfig.aviationToken}`
    : `${publicRuntimeConfig.apiURL}/api/flights`;
  const response = await axios.get(API, {
    params: {
      limit,
    },
  }); // http://localhost:8080/api/flights
  return response.data;
};
