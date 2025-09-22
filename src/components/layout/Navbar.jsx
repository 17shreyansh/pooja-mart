import React, { useState, useEffect, useRef } from "react";
import { Menu, Dropdown, Button, Drawer, Input, AutoComplete } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { DownOutlined, MenuOutlined, CloseOutlined, SearchOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { frontendAPI } from '../../utils/api';
import logo from "../../assets/logo.png";
import searchIcon from "../../assets/icons/proicons_search.png";
import userIcon from "../../assets/icons/solar_user-linear.png";
import cartIcon from "../../assets/icons/solar_cart-3-linear.png";

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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer',
          color: '#701a1a'
        }}>
          <UserOutlined style={{ fontSize: '16px' }} />
          <span>{user.name}</span>
          <DownOutlined style={{ fontSize: '10px' }} />
        </div>
      </Dropdown>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Link 
        to="/login" 
        style={{ 
          color: '#701a1a', 
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Login
      </Link>
      <span style={{ color: '#ccc' }}>|</span>
      <Link 
        to="/signup" 
        style={{ 
          color: '#701a1a', 
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
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
      // Get categories from existing data endpoints
      const [poojas, services, collections] = await Promise.all([
        frontendAPI.getPoojas(),
        frontendAPI.getServices(),
        frontendAPI.getCollections()
      ]);
      
      const poojaCategories = [...new Set(poojas.data.data.map(p => p.category))];
      const serviceCategories = [...new Set(services.data.data.map(s => s.category))];
      const productCategories = [...new Set(collections.data.data.map(c => c.category))];
      
      setCategories({
        poojas: poojaCategories,
        services: serviceCategories,
        products: productCategories
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
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #eee",
        zIndex: 1000,
        padding: "0 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
        }}
      >
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt="PujaMarts Logo"
            style={{ height: "70px", objectFit: "contain" }}
          />
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: "flex", gap: "50px", fontSize: "15px", fontFamily: "'Poppins', sans-serif" , fontWeight: "400"}}>
          <Link to="/" style={{ color: "#701a1a", textDecoration: "none" }}>
            Home
          </Link>

          <Dropdown menu={{ items: Array.isArray(categories.products) ? categories.products.map((cat, index) => ({ key: index, label: <Link to={`/shop?category=${cat}`}>{String(cat)}</Link> })) : [] }} trigger={['hover']}>
            <Link to="/shop" style={{ color: "#701a1a", textDecoration: "none" }}>
              Shop <DownOutlined style={{ fontSize: '10px' }} />
            </Link>
          </Dropdown>

          <Dropdown menu={{ items: Array.isArray(categories.poojas) ? categories.poojas.map((cat, index) => ({ key: index, label: <Link to={`/poojas?category=${cat}`}>{String(cat)}</Link> })) : [] }} trigger={['hover']}>
            <Link to="/poojas" style={{ color: "#701a1a", textDecoration: "none" }}>
              Book a Pooja <DownOutlined style={{ fontSize: '10px' }} />
            </Link>
          </Dropdown>

          <Dropdown menu={{ items: Array.isArray(categories.services) ? categories.services.map((cat, index) => ({ key: index, label: <Link to={`/services?category=${cat}`}>{String(cat)}</Link> })) : [] }} trigger={['hover']}>
            <Link to="/services" style={{ color: "#701a1a", textDecoration: "none" }}>
              Services <DownOutlined style={{ fontSize: '10px' }} />
            </Link>
          </Dropdown>
          <Link to="/contact" style={{ color: "#701a1a", textDecoration: "none" }}>
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn" style={{ display: "none" }}>
          <MenuOutlined 
            style={{ fontSize: "20px", color: "#701a1a", cursor: "pointer" }}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>

        {/* Desktop Right Icons */}
        <div
          className="desktop-icons"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "15px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "400",
          }}
        >
          <div style={{ position: 'relative' }}>
            <SearchOutlined 
              style={{ 
                fontSize: '18px', 
                color: '#701a1a', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) {
                  setTimeout(() => searchRef.current?.focus(), 100);
                }
              }}
            />
            
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: searchOpen ? '300px' : '0px',
              opacity: searchOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              zIndex: 1000,
              marginTop: '10px'
            }}>
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
        <div className="mobile-icons" style={{ display: "none", gap: "15px", alignItems: "center" }}>
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
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <img src={logo} alt="PujaMarts Logo" style={{ height: "40px", objectFit: "contain" }} />
            <CloseOutlined 
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "25px", fontFamily: "'Poppins', sans-serif", fontWeight: "400" }}>
            <Link to="/" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }} onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            
            <div style={{ marginBottom: '20px' }}>
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
            
            <Link to="/shop" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }} onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            
            <Link to="/poojas" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }} onClick={() => setMobileMenuOpen(false)}>
              Book a Pooja
            </Link>
            
            <Link to="/services" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }} onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            
            <Link to="/contact" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }} onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
            
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
              <UserAuth />
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
