import React from "react";
import { Row, Col, Input, Button } from "antd";
import { InstagramOutlined, FacebookFilled, TwitterOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import bottomStrip from "../../assets/bottom-strip.png";

const Footer = () => {
  return (
    <footer style={{ background: "#fffaf5", color: "#5c1f1f", padding: 0 }}>
      {/* Top Decorative Strip */}
      <img
        src={bottomStrip}
        alt="Decorative Strip"
        style={{ width: "100%", display: "block" }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <Row gutter={[32, 32]}>
          {/* Left - Logo & Navigation */}
          <Col xs={24} sm={12} md={8}>
            <img
              src={logo}
              alt="PujaMarts Logo"
              style={{ height: "60px", marginBottom: "20px" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href="#home" style={{ color: "#5c1f1f", textDecoration: "none" }}>Home</a>
              <a href="#shop" style={{ color: "#5c1f1f", textDecoration: "none" }}>Shop</a>
              <a href="#book-pooja" style={{ color: "#5c1f1f", textDecoration: "none" }}>Book a Pooja</a>
              <a href="#languages" style={{ color: "#5c1f1f", textDecoration: "none" }}>Languages</a>
              <a href="#contact" style={{ color: "#5c1f1f", textDecoration: "none" }}>Contact Us</a>
            </div>
          </Col>

          {/* Middle - Quick Links */}
          <Col xs={24} sm={12} md={8}>
            <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>Quick Link</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href="#refund" style={{ color: "#5c1f1f", textDecoration: "none" }}>Return and Refund Policy</a>
              <a href="#terms" style={{ color: "#5c1f1f", textDecoration: "none" }}>Terms and Conditions</a>
              <a href="#privacy" style={{ color: "#5c1f1f", textDecoration: "none" }}>Privacy Policy</a>
              <a href="#shipping" style={{ color: "#5c1f1f", textDecoration: "none" }}>Shipping Policy</a>
              <a href="#faqs" style={{ color: "#5c1f1f", textDecoration: "none" }}>FAQs</a>
            </div>
          </Col>

          {/* Right - Newsletter & Social */}
          <Col xs={24} sm={24} md={8}>
            <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>Sign Up For Newsletters</h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <Input placeholder="Enter your email" style={{ background: "#faebd7", border: "none" }} />
              <Button type="primary" style={{ background: "#5c1f1f", border: "none" }}>Submit</Button>
            </div>
            <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>Follow Us</h4>
            <div style={{ display: "flex", gap: "15px", fontSize: "18px" }}>
              <a href="#instagram" style={{ color: "#5c1f1f" }}><InstagramOutlined /></a>
              <a href="#facebook" style={{ color: "#5c1f1f" }}><FacebookFilled /></a>
              <a href="#twitter" style={{ color: "#5c1f1f" }}><TwitterOutlined /></a>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bottom Strip */}
      <div style={{ background: "#5c1f1f", color: "white", textAlign: "center", padding: "10px 0" }}>
        Terms and Conditions | Privacy Policy | Shipping Policy
      </div>
    </footer>
  );
};

export default Footer;