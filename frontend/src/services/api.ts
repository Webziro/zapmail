import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const rulesAPI = {
  create: (data: any) => api.post('/rules', data),
  getAll: () => api.get('/rules'),
  getOne: (id: string) => api.get(`/rules/${id}`),
  update: (id: string, data: any) => api.put(`/rules/${id}`, data),
  delete: (id: string) => api.delete(`/rules/${id}`),
  toggle: (id: string) => api.patch(`/rules/${id}/toggle`),
};

export const logsAPI = {
  getAll: (params?: any) => api.get('/logs', { params }),
  getStats: (ruleId?: string) => 
    api.get('/logs/stats', { params: ruleId ? { ruleId } : {} }),
  clear: (ruleId?: string) => 
    api.delete('/logs', { params: ruleId ? { ruleId } : {} }),
};

export default api;