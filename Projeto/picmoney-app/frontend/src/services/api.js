import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (project) => api.post('/projects', project),
  update: (id, project) => api.put(`/projects/${id}`, project),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const reportsAPI = {
  getSalesReport: (period) => api.get(`/reports/sales?period=${period}`),
  getProfitReport: (period) => api.get(`/reports/profit?period=${period}`),
};

export default api;