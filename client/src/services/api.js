import axios from 'axios';

const api = axios.create({
  // In development, Vite proxies /api → http://localhost:5000/api (see vite.config.js).
  // In production, set VITE_API_URL to your deployed backend URL.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
