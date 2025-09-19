import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const frontendAPI = {
  getServices: (params) => api.get('/services', { params }),
  getPoojas: (params) => api.get('/poojas', { params }),
  getPoojaCollection: (params) => api.get('/pooja-collection', { params }),
  getTestimonials: () => api.get('/testimonials'),
  getFaqs: () => api.get('/faqs'),
  getPage: (slug) => api.get(`/pages/${slug}`),
  subscribeNewsletter: (email) => api.post('/newsletter/subscribe', { email }),
  search: (params) => api.get('/search', { params }),
  getCategories: () => api.get('/search/categories')
};