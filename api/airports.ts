import axios from "axios";

export const getAirports = async (limit: number = undefined) => {
  const response = await axios.get(
    `/api/v1/airports`,
    {
      params: {
        limit,
      },
    }
  );
  return response.data;
};
