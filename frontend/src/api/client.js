import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000,                         
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token'); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
apiClient.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    // If token expired (401) and NOT on the login request itself
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error.response?.data?.error || { message: 'Network error. Please try again.' });
  }
);

export default apiClient;
