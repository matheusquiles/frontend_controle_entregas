import axios from 'axios';
import { API_BASE } from '../helper/Constants';

const api = axios.create({
  baseURL: API_BASE, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;