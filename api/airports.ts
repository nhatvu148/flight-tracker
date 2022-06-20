import axios from "axios";

export const getAirports = async () => {
  const response = await axios.get(`http://localhost:8080/api/airports`);
  return response.data;
};
