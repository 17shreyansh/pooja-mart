import { frontendAPI, userAuthAPI, testimonialsAPI } from './api';

// Wrapper function to add loading functionality to API calls
const withLoadingWrapper = (apiFunction, defaultMessage = 'Loading...') => {
  return async (params, customMessage) => {
    const message = customMessage || defaultMessage;
    
    // Show loading state (can be handled by individual components)
    try {
      const result = await apiFunction(params);
      return result;
    } catch (error) {
      throw error;
    }
  };
};

// Enhanced API with loading messages
export const frontendAPIWithLoading = {
  getPoojas: withLoadingWrapper(frontendAPI.getPoojas, 'Loading poojas...'),
  getPoojaById: withLoadingWrapper(frontendAPI.getPoojaById, 'Loading pooja details...'),
  getPoojaBySlug: withLoadingWrapper(frontendAPI.getPoojaBySlug, 'Loading pooja details...'),
  getServices: withLoadingWrapper(frontendAPI.getServices, 'Loading services...'),
  getServiceById: withLoadingWrapper(frontendAPI.getServiceById, 'Loading service details...'),
  getServiceBySlug: withLoadingWrapper(frontendAPI.getServiceBySlug, 'Loading service details...'),
  getCollections: withLoadingWrapper(frontendAPI.getCollections, 'Loading collections...'),
  getCollectionById: withLoadingWrapper(frontendAPI.getCollectionById, 'Loading collection details...'),
  getCollectionBySlug: withLoadingWrapper(frontendAPI.getCollectionBySlug, 'Loading collection details...'),
  getTestimonials: withLoadingWrapper(frontendAPI.getTestimonials, 'Loading testimonials...'),
  getFAQs: withLoadingWrapper(frontendAPI.getFAQs, 'Loading FAQs...'),
  submitLead: withLoadingWrapper(frontendAPI.submitLead, 'Submitting your request...'),
  subscribeNewsletter: withLoadingWrapper(frontendAPI.subscribeNewsletter, 'Subscribing to newsletter...'),
  search: withLoadingWrapper(frontendAPI.search, 'Searching...'),
};

export const userAuthAPIWithLoading = {
  register: withLoadingWrapper(userAuthAPI.register, 'Creating your account...'),
  login: withLoadingWrapper(userAuthAPI.login, 'Signing you in...'),
  verify: withLoadingWrapper(userAuthAPI.verify, 'Verifying account...'),
  changePassword: withLoadingWrapper(userAuthAPI.changePassword, 'Updating password...'),
};

export const testimonialsAPIWithLoading = {
  getAll: withLoadingWrapper(testimonialsAPI.getAll, 'Loading testimonials...'),
  create: withLoadingWrapper(testimonialsAPI.create, 'Submitting testimonial...'),
};