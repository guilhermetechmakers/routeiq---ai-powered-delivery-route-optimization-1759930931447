import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiError as ApiErrorType } from '@/types/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return the response as-is for successful requests
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiErrorType = {
      message: (error.response?.data as any)?.message || error.message || 'An error occurred',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data as Record<string, any> | undefined,
    };

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;