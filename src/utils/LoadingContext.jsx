import React, { createContext, useContext, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoadingContext = createContext();

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const withLoading = async (asyncFunction, message = 'Loading...') => {
    try {
      showLoading(message);
      const result = await asyncFunction();
      return result;
    } finally {
      hideLoading();
    }
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      showLoading,
      hideLoading,
      withLoading
    }}>
      {children}
      {isLoading && (
        <LoadingSpinner 
          overlay={true} 
          message={loadingMessage} 
        />
      )}
    </LoadingContext.Provider>
  );
};