import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './PageLoader.css';

const PageLoader = ({ message = 'Loading PujaMart...' }) => {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="loader-logo">
          <h2>🕉️ PujaMart</h2>
        </div>
        <LoadingSpinner 
          size="large" 
          message={message} 
          showMessage={true}
        />
        <div className="loader-tagline">
          Complete Devotional Service at Your Doorstep
        </div>
      </div>
    </div>
  );
};

export default PageLoader;