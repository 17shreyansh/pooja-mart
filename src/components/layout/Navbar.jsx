import React, { useState } from "react";
import { Menu, Dropdown, Button, Drawer } from "antd";
import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import searchIcon from "../../assets/icons/proicons_search.png";
import userIcon from "../../assets/icons/solar_user-linear.png";
import cartIcon from "../../assets/icons/solar_cart-3-linear.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shopMenu = (
    <Menu
      items={[
        { key: "1", label: "All Products" },
        { key: "2", label: "Pooja Samagri" },
        { key: "3", label: "Gift Items" },
      ]}
    />
  );

  const poojaMenu = (
    <Menu
      items={[
        { key: "1", label: "Satyanarayan Pooja" },
        { key: "2", label: "Griha Pravesh" },
        { key: "3", label: "Wedding Pooja" },
      ]}
    />
  );

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
          <a href="/" style={{ color: "#701a1a", textDecoration: "none" }}>
            Home
          </a>

          <Dropdown overlay={shopMenu} placement="bottom">
            <a href="/" style={{ color: "#701a1a" }}>
              Shop <DownOutlined style={{ fontSize: "12px" }} />
            </a>
          </Dropdown>

          <Dropdown overlay={poojaMenu} placement="bottom">
            <a href="/" style={{ color: "#701a1a" }}>
              Book a Pooja <DownOutlined style={{ fontSize: "12px" }} />
            </a>
          </Dropdown>

          <a href="/" style={{ color: "#701a1a" }}>
            Vastu and Numerology
          </a>
          <a href="/" style={{ color: "#701a1a" }}>
            Contact Us
          </a>
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
          <img src={searchIcon} alt="Search" style={{ width: "18px", height: "18px" }} />
          <img src={userIcon} alt="User" style={{ width: "18px", height: "18px" }} />
          <img src={cartIcon} alt="Cart" style={{ width: "18px", height: "18px" }} />

          <a href="/login" style={{ color: "#701a1a" }}>
            Signup/login
          </a>
          <a href="/language" style={{ color: "#701a1a" }}>
            Language
          </a>
        </div>

        {/* Mobile Icons */}
        <div className="mobile-icons" style={{ display: "none", gap: "15px", alignItems: "center" }}>
          <img src={searchIcon} alt="Search" style={{ width: "18px", height: "18px" }} />
          <img src={cartIcon} alt="Cart" style={{ width: "18px", height: "18px" }} />
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
        bodyStyle={{ padding: 0 }}
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
            <a href="/" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }}>
              Home
            </a>
            
            <div>
              <div style={{ color: "#701a1a", fontSize: "16px", marginBottom: "10px" }}>Shop</div>
              <div style={{ paddingLeft: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <a href="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>All Products</a>
                <a href="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>Pooja Samagri</a>
                <a href="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>Gift Items</a>
              </div>
            </div>
            
            <div>
              <div style={{ color: "#701a1a", fontSize: "16px", marginBottom: "10px" }}>Book a Pooja</div>
              <div style={{ paddingLeft: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <a href="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>Satyanarayan Pooja</a>
                <a href="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>Griha Pravesh</a>
                <a href="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}>Wedding Pooja</a>
              </div>
            </div>
            
            <a href="/" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }}>
              Vastu and Numerology
            </a>
            <a href="/" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }}>
              Contact Us
            </a>
            
            <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />
            
            <a href="/login" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }}>
              <img src={userIcon} alt="User" style={{ width: "16px", height: "16px", marginRight: "8px" }} />
              Signup/Login
            </a>
            <a href="/language" style={{ color: "#701a1a", textDecoration: "none", fontSize: "16px" }}>
              Language
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
