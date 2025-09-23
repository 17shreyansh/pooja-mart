import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Frontend API (no auth required)
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// User API (with user auth)
const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const frontendAPI = {
  getPoojas: (params) => api.get('/poojas', { params }),
  getPoojaById: (id) => api.get(`/poojas/${id}`),
  getPoojaBySlug: (slug) => api.get(`/poojas/slug/${slug}`),
  getServices: (params) => api.get('/services', { params }),
  getServiceById: (id) => api.get(`/services/${id}`),
  getServiceBySlug: (slug) => api.get(`/services/slug/${slug}`),
  getCollections: (params) => api.get('/pooja-collection', { params }),
  getCollectionById: (id) => api.get(`/pooja-collection/${id}`),
  getCollectionBySlug: (slug) => api.get(`/pooja-collection/slug/${slug}`),
  getCategories: () => api.get('/categories'),
  getCategoriesByType: (type) => api.get(`/categories/by-type/${type}`),
  getTestimonials: () => api.get('/testimonials'),
  getFAQs: () => api.get('/faqs'),
  submitLead: (data) => api.post('/leads', data),
  subscribeNewsletter: (email) => api.post('/newsletter/subscribe', { email }),
  search: (params) => api.get('/search', { params }),
};

export const userAuthAPI = {
  sendOTP: (data) => api.post('/user-auth/send-otp', data),
  verifyOTP: (data) => api.post('/user-auth/verify-otp', data),
  login: (data) => api.post('/user-auth/login', data),
  verifyLoginOTP: (data) => api.post('/user-auth/verify-login-otp', data),
  verify: () => userApi.get('/user-auth/verify'),
};

export const testimonialsAPI = {
  getAll: (params) => api.get('/testimonials', { params }),
  create: (data) => userApi.post('/testimonials', data),
};

