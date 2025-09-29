import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const WhatsAppContext = createContext();

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};

export const WhatsAppProvider = ({ children }) => {
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppNumber();
  }, []);

  const fetchWhatsAppNumber = async () => {
    try {
      const response = await api.get('/settings/whatsapp');
      if (response.data.success) {
        setWhatsappNumber(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WhatsAppContext.Provider value={{ whatsappNumber, loading, fetchWhatsAppNumber }}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export default WhatsAppContext;