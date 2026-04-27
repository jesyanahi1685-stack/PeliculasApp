// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Adjuntar JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Películas ────────────────────────────────────────────
export const getMovies          = (page = 1) => api.get(`/movies?page=${page}`);
export const getMovie           = (id)       => api.get(`/movies/${id}`);
export const rateMovie          = (id, score)=> api.post(`/movies/${id}/rate`, { score });

// ─── Recomendaciones ──────────────────────────────────────
export const getRecommendations = ()         => api.get("/recommendations");

// ─── Watchlist ────────────────────────────────────────────
export const getWatchlist       = ()         => api.get("/watchlist");
export const addToWatchlist     = (movieId)  => api.post(`/watchlist/${movieId}`);
export const removeFromWatchlist= (movieId)  => api.delete(`/watchlist/${movieId}`);

// ─── Auth ─────────────────────────────────────────────────
export const register = (data) => api.post("/auth/register", data);
export const login    = (data) => api.post("/auth/login", data);

export default api;
