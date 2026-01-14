import axios from "axios";

const api = axios.create({
  baseURL: "http://final-project.local/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // AQUESTA és la clau. False per evitar problemes amb el '*' del backend.
  withCredentials: false,
});

// Interceptor per injectar el token si existeix
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
