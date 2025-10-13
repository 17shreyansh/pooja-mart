import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Poojas from './pages/Poojas';
import PoojaDetail from './pages/PoojaDetail';
import Shop from './pages/Shop';
import CollectionDetail from './pages/CollectionDetail';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import PolicyPage from './pages/PolicyPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminApp from './admin/AdminApp';
import ProtectedRoute from './components/ProtectedRoute';

import { LoadingProvider } from './utils/LoadingContext';
import { WhatsAppProvider } from './utils/WhatsAppContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  const path = window.location.pathname;
  const isAdminRoute = path.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminApp />;
  }

  return (
    <LoadingProvider>
      <WhatsAppProvider>
        <Router>
          <ScrollToTop />
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/poojas" element={<Poojas />} />
                <Route path="/pooja/:slug" element={<PoojaDetail />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/collection/:slug" element={<CollectionDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policy/:type" element={<PolicyPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WhatsAppProvider>
    </LoadingProvider>
  );
}

export default App;