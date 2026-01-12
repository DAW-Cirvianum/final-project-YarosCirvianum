import axios from "axios";

// URL API Laravel
const api = axios.create({
  baseURL: "http://final-project.local/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Afegim el token a cada request si existeix
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
