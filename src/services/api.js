import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
};

// Sites endpoints
export const sitesAPI = {
  getAll: () => api.get('/api/sites'),
  getById: (id) => api.get(`/api/sites/${id}`),
  create: (data) => api.post('/api/sites', data),
  update: (id, data) => api.put(`/api/sites/${id}`, data),
  delete: (id) => api.delete(`/api/sites/${id}`),
};

// AI endpoints
export const aiAPI = {
  generateDescription: (data) => api.post('/api/ai/generate-description', data),
};

export default api;
