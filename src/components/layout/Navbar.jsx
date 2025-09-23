import React, { useState, useEffect, useRef } from "react";
import { Menu, Dropdown, Button, Drawer, Input, AutoComplete } from "antd";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DownOutlined, MenuOutlined, CloseOutlined, SearchOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { frontendAPI } from '../../utils/api';
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
      <Dropdown menu={userMenu} trigger={['hover']}>
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
  const [categories, setCategories] = useState({});
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      // Get all categories from the dedicated endpoint
      const response = await frontendAPI.getCategories();
      const allCategories = response.data || [];
      
      setCategories({
        poojas: allCategories.map(cat => cat.name),
        services: allCategories.map(cat => cat.name),
        products: allCategories.map(cat => cat.name)
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
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
          <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>
            Services
          </Link>
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
            
            <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            
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
