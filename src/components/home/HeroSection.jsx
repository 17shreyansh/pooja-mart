import React from "react";
import { Row, Col, Input, Button, Form } from "antd";
import { useNavigate } from 'react-router-dom';
import heroImage from "../../assets/hero-bg.jpg";
import banner from "../../assets/hero-1.png";
import "./HeroSection.css";

const HeroSection = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    if (!values.city && !values.poojaName) {
      navigate('/contact');
      return;
    }
    
    const params = new URLSearchParams();
    if (values.city) params.append('city', values.city);
    if (values.poojaName) params.append('service', values.poojaName);
    params.append('type', 'hero-form');
    
    navigate(`/contact?${params.toString()}`);
  };

  return (
    <section className="hero-section" style={{
      backgroundImage: `url(${heroImage})`
    }}>
      {/* Banner touching navbar - Hidden on mobile */}
      <img
        src={banner}
        alt="Banner"
        className="hero-banner"
      />

      <Row gutter={[40, 40]} className="hero-row">
        {/* Left Text Content */}
        <Col xs={24} md={12}>
          <div className="hero-text-content">
            <h1 className="hero-title">
              Pooja Samagri, Prasad & Pandit Ji – All at One Place
            </h1>
            <p className="hero-description">
              Complete Devotional Service at Your Doorstep – For Peace,
              Happiness & Prosperity
            </p>
            <h2 className="hero-phone">8929255775</h2>
          </div>
        </Col>

        {/* Right Form Section */}
        <Col xs={24} md={12}>
          <div className="hero-form-container">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item name="city">
                <Input
                  placeholder="Enter Your city"
                  size="large"
                  className="hero-input"
                />
              </Form.Item>

              <Form.Item name="poojaName">
                <Input
                  placeholder="Enter Pooja Name"
                  size="large"
                  className="hero-input"
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  className="hero-button"
                  htmlType="submit"
                >
                  Book a Pooja
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default HeroSection;
