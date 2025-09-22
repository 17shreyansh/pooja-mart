import React, { useState, useEffect } from 'react';
import { ConfigProvider, Spin, App } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ServiceEditor from './pages/ServiceEditor';
import Poojas from './pages/Poojas';
import PoojaEditor from './pages/PoojaEditor';
import PoojaCollection from './pages/PoojaCollection';
import CollectionEditor from './pages/CollectionEditor';
import Testimonials from './pages/Testimonials';
import UserTestimonials from './pages/UserTestimonials';
import Leads from './pages/Leads';
import FAQs from './pages/FAQs';
import Pages from './pages/Pages';
import Newsletter from './pages/Newsletter';
import Offers from './pages/Offers';
import HomePageEditor from './pages/HomePageEditor';
import Categories from './pages/Categories';
import AdminLayout from './components/AdminLayout';
import { authAPI } from './utils/api';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
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
        <Router>
          <AdminLayout onLogout={handleLogout} admin={admin}>
            <Routes>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/services" element={<Services />} />
              <Route path="/admin/services/new" element={<ServiceEditor />} />
              <Route path="/admin/services/edit/:id" element={<ServiceEditor />} />
              <Route path="/admin/poojas" element={<Poojas />} />
              <Route path="/admin/poojas/new" element={<PoojaEditor />} />
              <Route path="/admin/poojas/edit/:id" element={<PoojaEditor />} />
              <Route path="/admin/collections" element={<PoojaCollection />} />
              <Route path="/admin/collections/new" element={<CollectionEditor />} />
              <Route path="/admin/collections/edit/:id" element={<CollectionEditor />} />
              <Route path="/admin/testimonials" element={<Testimonials />} />
              <Route path="/admin/user-testimonials" element={<UserTestimonials />} />
              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/faqs" element={<FAQs />} />
              <Route path="/admin/pages" element={<Pages />} />
              <Route path="/admin/newsletter" element={<Newsletter />} />
              <Route path="/admin/offers" element={<Offers />} />
              <Route path="/admin/home-page" element={<HomePageEditor />} />
              <Route path="/admin/categories" element={<Categories />} />
            </Routes>
          </AdminLayout>
        </Router>
      </App>
    </ConfigProvider>
  );
};

export default AdminApp;