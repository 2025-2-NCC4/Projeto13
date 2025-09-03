import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const callApi = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(...args);
      return { data: response.data, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro na requisição';
      setError(errorMessage);
      
      // Logout se não autorizado
      if (err.response?.status === 401) {
        logout();
      }
      
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError
  };
};