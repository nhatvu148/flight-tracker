import axios from "axios";

export const getFlights = async (limit: number = undefined) => {
  let API = `/api/v1/flights`;
  const response = await axios.get(API, {
    params: {
      limit,
    },
  });
  return response.data;
};
