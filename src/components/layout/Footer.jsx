import React, { useState } from "react";
import { Row, Col, Input, Button, message } from "antd";
import { frontendAPI } from '../../utils/api';
import { Link } from 'react-router-dom';
import { InstagramOutlined, FacebookFilled, TwitterOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import bottomStrip from "../../assets/bottom-strip.png";
import bg from "../../assets/featuredBG.png";
import ThankYouMessage from '../common/ThankYouMessage';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      message.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await frontendAPI.subscribeNewsletter(email);
      setShowThankYou(true);
      setEmail('');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThankYouMessage 
        visible={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Welcome to Our Newsletter!"
        message="Thank you for subscribing! You'll receive the latest updates about our poojas, services, and special offers."
        type="newsletter"
      />
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        marginBottom: "25px",
        flexDirection: { xs: "column", sm: "row" }
      }}>
      <Input 
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onPressEnter={handleSubmit}
        style={{ 
          background: "#faebd7", 
          border: "none",
          flex: 1
        }} 
      />
      <Button 
        type="primary" 
        loading={loading}
        onClick={handleSubmit}
        style={{ 
          background: "#5c1f1f", 
          border: "none",
          minWidth: "80px"
        }}
      >
        Submit
      </Button>
      </div>
    </>
  );
};

const Footer = () => {
  return (
    <footer style={{ background: `url(${bg})`, color: "#5c1f1f", padding: 0 }}>
      {/* Top Decorative Strip */}
      <img
        src={bottomStrip}
        alt="Decorative Strip"
        style={{ width: "100%", display: "block" }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <Row gutter={[32, 32]} align="top">
          {/* Left - Logo & Navigation */}
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: { xs: "center", sm: "left" } }}>
              <img
                src={logo}
                alt="PujaMarts Logo"
                style={{ height: "60px", marginBottom: "20px" }}
              />
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "12px",
              alignItems: { xs: "center", sm: "flex-start" }
            }}>
              <Link to="/" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Home</Link>
              <Link to="/shop" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Shop</Link>
              <Link to="/poojas" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Book a Pooja</Link>
              <Link to="/services" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Services</Link>
              <Link to="/contact" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Contact Us</Link>
            </div>
          </Col>

          {/* Middle - Quick Links */}
          <Col xs={24} sm={12} md={8}>
            <h4 style={{ 
              fontWeight: "600", 
              marginBottom: "20px", 
              fontSize: "16px",
              textAlign: { xs: "center", sm: "left" }
            }}>Quick Links</h4>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "12px",
              alignItems: { xs: "center", sm: "flex-start" }
            }}>
              <Link to="/policy/return-refund-policy" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Return and Refund Policy</Link>
              <Link to="/policy/terms-conditions" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Terms and Conditions</Link>
              <Link to="/policy/privacy-policy" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Privacy Policy</Link>
              <Link to="/policy/shipping-policy" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>Shipping Policy</Link>
              <Link to="/contact" style={{ color: "#5c1f1f", textDecoration: "none", fontSize: "14px", lineHeight: "1.5" }}>FAQs</Link>
            </div>
          </Col>

          {/* Right - Newsletter & Social */}
          <Col xs={24} sm={24} md={8}>
            <h4 style={{ 
              fontWeight: "600", 
              marginBottom: "20px", 
              fontSize: "16px",
              textAlign: { xs: "center", sm: "left" }
            }}>Sign Up For Newsletters</h4>
            <NewsletterForm />
            <h4 style={{ 
              fontWeight: "600", 
              marginBottom: "15px", 
              fontSize: "16px",
              textAlign: { xs: "center", sm: "left" }
            }}>Follow Us</h4>
            <div style={{ 
              display: "flex", 
              gap: "20px", 
              fontSize: "20px",
              justifyContent: { xs: "center", sm: "flex-start" }
            }}>
              <a href="#instagram" style={{ color: "#5c1f1f", transition: "color 0.3s" }}><InstagramOutlined /></a>
              <a href="#facebook" style={{ color: "#5c1f1f", transition: "color 0.3s" }}><FacebookFilled /></a>
              <a href="#twitter" style={{ color: "#5c1f1f", transition: "color 0.3s" }}><TwitterOutlined /></a>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bottom Strip */}
      <div style={{ background: "#5c1f1f", color: "white", padding: "15px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: "10px"
          }}>
            <div style={{ 
              display: "flex", 
              gap: "15px", 
              fontSize: "14px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <Link to="/policy/terms-conditions" style={{ color: "white", textDecoration: "none" }}>Terms and Conditions</Link>
              <span>|</span>
              <Link to="/policy/privacy-policy" style={{ color: "white", textDecoration: "none" }}>Privacy Policy</Link>
              <span>|</span>
              <Link to="/policy/shipping-policy" style={{ color: "white", textDecoration: "none" }}>Shipping Policy</Link>
            </div>
            <div style={{ fontSize: "14px", textAlign: "center" }}>
              Made with ❤️ and craft by{" "}
              <a 
                href="https://affobe.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: "#faebd7", 
                  textDecoration: "none", 
                  fontWeight: "500"
                }}
              >
                Affobe
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;