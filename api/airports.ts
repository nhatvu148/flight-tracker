import axios from "axios";
import getConfig from "next/config";

export const getAirports = async () => {
  const { publicRuntimeConfig } = getConfig();
  const response = await axios.get(
    `${publicRuntimeConfig.apiURL}/api/airports`
  );
  return response.data;
};
