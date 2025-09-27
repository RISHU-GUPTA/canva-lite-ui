import axios from 'axios';

const api = axios.create({
  baseURL: 'https://canva-lite-server.vercel.app/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization']; // remove if logged out
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
