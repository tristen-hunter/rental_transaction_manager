import axios from "axios";

/**
 * Allows me to call from: http://localhost:8080/api/v1
 */
const axiosClient = axios.create({
  // Vite-specific way to access variables
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;