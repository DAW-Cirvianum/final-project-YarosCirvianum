// src/services/api.js

// IMPORTACIONS
import axios from "axios";

// CONFIGURACIO
/** 
 * URL base per a les crides a la API obtinguda de les variables d'entorn.
 * @type {string} 
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://final-project.local/api";

/**
 * Nom de la clau utilitzada per guardar el token al magatzem local.
 * @type {string} 
 */
const TOKEN_KEY = "token";

// INSTANCIA AXIOS
/**
 * Instancia d'axios configurada per a la comunicacio amb el backend.
 * Inclou la configuracio base de capçaleres i el format de dades.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // False es necessari si el backend permet CORS amb '*' (wildcard)
  withCredentials: false,
});

// INTERCEPTOR (INJECTAR TOKEN)
/**
 * Interceptor de peticions que s'executa abans d'enviar qualsevol consulta.
 * S'encarrega d'injectar el token d'autoritzacio Bearer si aquest existeix al localStorage.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;