import React, { useState, useEffect } from 'react';
import { ConfigProvider, Spin, App } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Poojas from './pages/Poojas';
import PoojaCollection from './pages/PoojaCollection';
import Testimonials from './pages/Testimonials';
import Leads from './pages/Leads';
import FAQs from './pages/FAQs';
import Pages from './pages/Pages';
import Newsletter from './pages/Newsletter';
import AdminLayout from './components/AdminLayout';
import { authAPI } from './utils/api';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        // Verify token with backend
        const response = await authAPI.verifyToken();
        setIsAuthenticated(true);
        setAdmin(response.data.admin);
      } catch (error) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const handleLogin = (adminData) => {
    setIsAuthenticated(true);
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdmin(null);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'services': return <Services />;
      case 'poojas': return <Poojas />;
      case 'pooja-collection': return <PoojaCollection />;
      case 'testimonials': return <Testimonials />;
      case 'leads': return <Leads />;
      case 'faqs': return <FAQs />;
      case 'pages': return <Pages />;
      case 'newsletter': return <Newsletter />;
      default: return <Dashboard />;
    }
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

  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={{ 
        token: { 
          colorPrimary: '#6B1E1E',
          borderRadius: 8,
          colorBgContainer: '#ffffff'
        } 
      }}>
        <App>
          <Login onLogin={handleLogin} />
        </App>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={{ 
      token: { 
        colorPrimary: '#6B1E1E',
        borderRadius: 8,
        colorBgContainer: '#ffffff'
      } 
    }}>
      <App>
        <AdminLayout 
          currentPath={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          admin={admin}
        >
          {renderPage()}
        </AdminLayout>
      </App>
    </ConfigProvider>
  );
};

export default AdminApp;