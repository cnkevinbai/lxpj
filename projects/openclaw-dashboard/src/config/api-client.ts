import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_VERSION = import.meta.env.VITE_API_VERSION || '';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_VERSION ? `${API_BASE_URL}/api/${API_VERSION}` : `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      // window.location.href = '/login';
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export methods
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.get<T>(url, config).then((res) => res.data);
};

export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiClient.post<T>(url, data, config).then((res) => res.data);
};

export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiClient.put<T>(url, data, config).then((res) => res.data);
};

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.delete<T>(url, config).then((res) => res.data);
};

// Export instance for direct use
export { apiClient };
