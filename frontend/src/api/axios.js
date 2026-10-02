import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send the httpOnly JWT cookie
});

// Pull a readable message out of any API error
export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default api;
