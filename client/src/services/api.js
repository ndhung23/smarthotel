import axios from 'axios';

/**
 * Tự động phân giải Base API URL theo môi trường:
 * 1. Nếu có biến môi trường REACT_APP_API_URL -> sử dụng giá trị đó.
 * 2. Nếu ở môi trường Production -> mặc định dùng relative path '/api' (chuẩn monolithic/same-origin, không sợ CORS hay hardcode localhost).
 * 3. Nếu ở môi trường Development -> fallback về 'http://localhost:5000/api'.
 */
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach auth token if available
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

// Response interceptor: standard error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
