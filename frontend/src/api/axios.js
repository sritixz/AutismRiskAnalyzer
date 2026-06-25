import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if present) to every outgoing request automatically,
// so individual api/* files never have to think about auth headers.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Centralize 401 handling: if the backend ever says "your token is
// invalid/expired", clear local auth state. We dispatch a custom event
// rather than importing AuthContext directly here, to avoid a circular
// dependency between the API layer and the context layer — AuthContext
// listens for this event and reacts (e.g. redirecting to /login).
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
