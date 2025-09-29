import React, { useState, useEffect, useRef } from "react";
import { Menu, Dropdown, Button, Drawer, Input, AutoComplete } from "antd";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DownOutlined, MenuOutlined, CloseOutlined, SearchOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { frontendAPI } from '../../utils/api';
import CitySelector from '../home/CitySelector';
import LanguageSelector from '../common/LanguageSelector';
import logo from "../../assets/logo.png";
import '../../styles/Navbar.css';

const UserAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (user) {
    const userMenu = (
      <Menu
        items={[
          {
            key: 'dashboard',
            label: <Link to="/user/dashboard">Dashboard</Link>,
            icon: <UserOutlined />
          },
          {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout
          }
        ]}
      />
    );

    return (
      <Dropdown overlay={userMenu} trigger={['hover']}>
        <div className="user-dropdown">
          <UserOutlined style={{ fontSize: '16px' }} />
          <span>{user.name}</span>
          <DownOutlined style={{ fontSize: '10px' }} />
        </div>
      </Dropdown>
    );
  }

  return (
    <div className="user-auth-container">
      <Link to="/login" className="user-auth-link">
        Login
      </Link>
      <span style={{ color: '#ccc' }}>|</span>
      <Link to="/signup" className="user-auth-link">
        Sign Up
      </Link>
    </div>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    fetchServices();
    // Load saved city from localStorage
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(JSON.parse(savedCity));
    }
  }, []);

  useEffect(() => {
    if (searchValue.length >= 2) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchValue);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchValue]);

  const fetchServices = async () => {
    try {
      const response = await frontendAPI.getServices();
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await frontendAPI.search({ q: query });
      const { suggestions } = response.data.data;
      
      const options = Array.isArray(suggestions) ? suggestions.map((item, index) => ({
        key: index,
        value: item.text || '',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{String(item.text || '')}</span>
            <span style={{ fontSize: '12px', color: '#999' }}>{String(item.type || '')}</span>
          </div>
        ),
        type: item.type
      })) : [];
      
      setSearchResults(options);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (value, option) => {
    const type = option.type;
    if (type === 'service') {
      navigate('/services');
    } else if (type === 'pooja') {
      navigate('/poojas');
    } else if (type === 'product') {
      navigate('/shop');
    }
    setSearchOpen(false);
    setSearchValue('');
  };

  // Helper function to create slug from title
  const createSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', JSON.stringify(city));
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="PujaMarts Logo" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/poojas" className={location.pathname === '/poojas' ? 'active' : ''}>
            Book a Pooja
          </Link>
          <Dropdown
            menu={{
              items: services.map(service => ({
                key: service._id,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                    <img 
                      src={service.image ? `${import.meta.env.VITE_API_BASE_URL}${service.image}` : '/placeholder.jpg'}
                      alt={service.name}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500', color: '#691B19' }}>{service.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{service.description?.substring(0, 50)}...</div>
                    </div>
                  </div>
                ),
                onClick: () => navigate(`/poojas?service=${service._id}`)
              }))
            }}
            trigger={['hover']}
          >
            <Link to="#" className={location.pathname === '/services' ? 'active' : ''}>
              Services <DownOutlined style={{ fontSize: '10px' }} />
            </Link>
          </Dropdown>
          <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>
            Shop
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn">
          <MenuOutlined 
            style={{ fontSize: "20px", color: "#701a1a", cursor: "pointer" }}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>

        {/* Desktop Right Icons */}
        <div className="desktop-icons">
          <LanguageSelector />
          <CitySelector 
            selectedCity={selectedCity} 
            onCityChange={handleCityChange} 
          />
          
          <div className="search-container">
            <SearchOutlined 
              className="search-icon"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) {
                  setTimeout(() => searchRef.current?.focus(), 100);
                }
              }}
            />
            
            <div className={`search-dropdown ${!searchOpen ? 'closed' : ''}`}>
              <AutoComplete
                ref={searchRef}
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSearchSelect}
                options={searchResults}
                placeholder="Search..."
                style={{ width: '100%' }}
                size="large"
              />
            </div>
          </div>
          
          {/* User Authentication */}
          <UserAuth />
        </div>

        {/* Mobile Icons */}
        <div className="mobile-icons">
          <SearchOutlined 
            style={{ fontSize: '18px', color: '#701a1a', cursor: 'pointer' }}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={null}
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <img src={logo} alt="PujaMarts Logo" />
            <CloseOutlined 
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
          
          <div className="mobile-drawer-menu">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            
            <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <LanguageSelector />
            </div>
            
            <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <CitySelector 
                selectedCity={selectedCity} 
                onCityChange={handleCityChange} 
              />
            </div>
            
            <div className="mobile-search-container">
              <AutoComplete
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSearchSelect}
                options={searchResults}
                placeholder="Search services, poojas, products..."
                style={{ width: '100%' }}
                size="large"
              />
            </div>
            
            <Link to="/poojas" onClick={() => setMobileMenuOpen(false)}>
              Book a Pooja
            </Link>
            
            <div className="mobile-services-menu">
              <div style={{ fontWeight: '500', padding: '12px 0', borderBottom: '1px solid #eee' }}>Services</div>
              {services.map(service => (
                <div 
                  key={service._id}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', cursor: 'pointer' }}
                  onClick={() => {
                    navigate(`/poojas?service=${service._id}`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <img 
                    src={service.image ? `${import.meta.env.VITE_API_BASE_URL}${service.image}` : '/placeholder.jpg'}
                    alt={service.name}
                    style={{ width: '30px', height: '30px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#691B19', fontSize: '14px' }}>{service.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>{service.description?.substring(0, 40)}...</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
            
            <div className="mobile-user-auth">
              <UserAuth />
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
