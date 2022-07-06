import axios from "axios";
import getConfig from "next/config";

export const getAirports = async (limit: number = undefined) => {
  const { publicRuntimeConfig } = getConfig();
  const response = await axios.get(
    `${publicRuntimeConfig.apiURL}/api/v1/airports`,
    {
      params: {
        limit,
      },
    }
  );
  return response.data;
};
