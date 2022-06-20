import axios from "axios";

export const getFlights = async () => {
  const response = await axios.get(`http://localhost:8080/api/flights`);
  return response.data;
};
