import axios from 'axios';

/**
 * Tự động phân giải và chuẩn hóa Base API URL theo môi trường:
 * 1. Nếu có REACT_APP_API_URL:
 *    - Tự động bổ sung https:// nếu người dùng quên gõ giao thức.
 *    - Tự động bổ sung /api nếu người dùng quên thêm hậu tố endpoint.
 * 2. Nếu ở môi trường Production (không có biến): dùng relative path '/api'.
 * 3. Nếu ở Development: dùng 'http://localhost:5000/api'.
 */
const getBaseURL = () => {
  let url = process.env.REACT_APP_API_URL;
  if (url) {
    url = url.trim();
    // Tự động thêm https:// nếu thiếu http:// hoặc https:// (chống lỗi relative path nhầm domain)
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      url = `https://${url}`;
    }
    // Tự động thêm /api nếu người dùng quên
    if (!url.endsWith('/api') && !url.endsWith('/api/')) {
      url = `${url.replace(/\/$/, '')}/api`;
    }
    return url;
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
