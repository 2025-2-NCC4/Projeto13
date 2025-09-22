import { authAPI } from './api';

export const AuthService = {
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};