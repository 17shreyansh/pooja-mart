import React from 'react';
import { Button } from 'antd';
import './LoadingButton.css';

const LoadingButton = ({ 
  loading = false, 
  children, 
  loadingText = 'Loading...', 
  ...props 
}) => {
  return (
    <Button 
      {...props} 
      loading={loading}
      className={`loading-button ${props.className || ''}`}
    >
      {loading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;