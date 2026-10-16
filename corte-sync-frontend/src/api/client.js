import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every request when present
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("bc_auth");
  if (raw) {
    const auth = JSON.parse(raw);
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }
  return config;
});

// Normalize error messages coming from the API's ResponseError { timestamp, status, erro }
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("bc_auth");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.erro ||
      error.message ||
      "Ocorreu um erro inesperado. Tente novamente.";
    return Promise.reject(new Error(message));
  }
);

export default api;
