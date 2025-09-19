// Utility functions for lead generation
export const createLeadFromCard = (item, type) => {
  const params = new URLSearchParams({
    service: encodeURIComponent(item.title),
    type: type
  });
  return `/contact?${params.toString()}`;
};

export const createLeadFromHeroForm = (values) => {
  const params = new URLSearchParams({
    city: values.city || '',
    service: values.poojaName || '',
    type: 'hero-form'
  });
  return `/contact?${params.toString()}`;
};

export const parseLeadParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    service: urlParams.get('service'),
    type: urlParams.get('type'),
    city: urlParams.get('city')
  };
};

export const generateLeadSubject = (service, type, city) => {
  switch (type) {
    case 'service':
      return `Inquiry about ${service} service`;
    case 'pooja':
      return `Book ${service} pooja`;
    case 'product':
      return `Purchase ${service}`;
    case 'hero-form':
      return `Book ${service} pooja in ${city}`;
    default:
      return `General inquiry about ${service}`;
  }
};

export const generateLeadMessage = (service, type) => {
  const messages = {
    service: `Hi, I'm interested in your ${service} service. Please contact me with more details.`,
    pooja: `Hi, I would like to book ${service} pooja. Please contact me to discuss the details.`,
    product: `Hi, I'm interested in purchasing ${service}. Please contact me with pricing and availability.`,
    'hero-form': `Hi, I'm interested in ${service}. Please contact me to discuss the booking.`
  };
  return messages[type] || `Hi, I'm interested in ${service}. Please contact me.`;
};