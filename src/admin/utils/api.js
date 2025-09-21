import axios from 'axios';
import { API_BASE_URL as BASE_URL } from '../../config/api.js';

const API_BASE_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getAllAdmin: (params) => api.get('/services/admin', { params }),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const poojasAPI = {
  getAll: (params) => api.get('/poojas', { params }),
  getAllAdmin: (params) => api.get('/poojas/admin', { params }),
  create: (data) => api.post('/poojas', data),
  update: (id, data) => api.put(`/poojas/${id}`, data),
  delete: (id) => api.delete(`/poojas/${id}`),
};

export const poojaCollectionAPI = {
  getAll: (params) => api.get('/pooja-collection', { params }),
  getAllAdmin: (params) => api.get('/pooja-collection/admin', { params }),
  getById: (id) => api.get(`/pooja-collection/${id}`),
  create: (data) => api.post('/pooja-collection', data),
  update: (id, data) => api.put(`/pooja-collection/${id}`, data),
  delete: (id) => api.delete(`/pooja-collection/${id}`),
};

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/admin'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  getStats: () => api.get('/leads/stats/overview'),
};

export const faqsAPI = {
  getAll: () => api.get('/faqs'),
  getAllAdmin: () => api.get('/faqs/admin'),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

export const pagesAPI = {
  getAll: () => api.get('/pages'),
  getBySlug: (slug) => api.get(`/pages/${slug}`),
  createOrUpdate: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
};

export const newsletterAPI = {
  getAll: (params) => api.get('/newsletter', { params }),
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  update: (id, data) => api.put(`/newsletter/${id}`, data),
  delete: (id) => api.delete(`/newsletter/${id}`),
  export: () => api.get('/newsletter/export', { responseType: 'blob' }),
};

// User Authentication API
const userApi = axios.create({
  baseURL: API_BASE_URL,
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userAuthAPI = {
  register: (data) => userApi.post('/user-auth/register', data),
  login: (data) => userApi.post('/user-auth/login', data),
  verify: () => userApi.get('/user-auth/verify'),
  changePassword: (data) => userApi.put('/user-auth/change-password', data),
};

export const adminAPI = api;