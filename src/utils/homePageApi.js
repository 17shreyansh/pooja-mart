import api from '../config/api';

export const homePageAPI = {
  getContent: () => api.get('/home-page'),
  updateSection: (section, content) => api.put(`/home-page/${section}`, { content })
};