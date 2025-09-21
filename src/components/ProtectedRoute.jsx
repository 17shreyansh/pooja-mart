import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { userAuthAPI } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      await userAuthAPI.verify();
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;