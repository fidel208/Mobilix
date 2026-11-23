import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is required");
}

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mobilix_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register");

    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("mobilix_token");
      localStorage.removeItem("mobilix_user");
      localStorage.removeItem("mobilix_admin");

      window.location.href = "/admin/portal/auth";
    }
    return Promise.reject(error);
  },
);

export default API;
