import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  create: (feedback) => api.post('/feedback', feedback),
  delete: (id) => api.delete(`/feedback/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;