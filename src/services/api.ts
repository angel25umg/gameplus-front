import axios from 'axios';

// Base URL para la API que se inyecta en build mediante Vite (prefijo VITE_)
// Si no está definida, por defecto usamos '/api' para facilitar desarrollo con proxy
export const API_BASE: string = (import.meta.env.development.VITE_API_URL as string) ?? '/api';

const api = axios.create({
  baseURL: API_BASE,
  // Puedes añadir headers comunes aquí, p. ej. auth token desde localStorage
  // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default api;
