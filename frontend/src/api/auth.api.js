import apiClient from './client';

export const login = async (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return apiClient.post('/auth/signup', userData);
};
