import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Row, Col, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { frontendAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';
import ctaBG from '../assets/ctaBG.jpg';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#services-fonts')) {
  const style = document.createElement('style');
  style.id = 'services-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const { Meta } = Card;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, [searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await frontendAPI.getServices(params);
      setServices(response.data.data);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center', 
        fontFamily: 'Poppins, sans-serif',
        fontSize: '18px',
        color: '#6B1E1E'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `url(${featuredBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '120px 20px 60px',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '600',
            color: '#6B1E1E',
            marginBottom: '20px',
            fontFamily: 'Bastoni'
          }}>
            Our Services
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#691B19',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Complete devotional services for your spiritual journey. From traditional poojas to modern conveniences.
          </p>
          
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Input
              placeholder="Search services..."
              prefix={<SearchOutlined style={{ color: '#691B19' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '25px',
                padding: '8px 20px',
                background: '#fff',
                border: '2px solid #691B19',
                fontFamily: 'Poppins, sans-serif',
                flex: '1',
                minWidth: '250px'
              }}
              size="large"
            />
          </div>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Categories Section */}
      <section style={{ padding: '30px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              onClick={() => setSelectedCategory('')}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1px solid #691B19',
                background: selectedCategory === '' ? '#691B19' : 'white',
                color: selectedCategory === '' ? 'white' : '#691B19',
                fontSize: '14px'
              }}
            >
              All Services
            </Button>
            {categories.map((category, index) => (
              <Button 
                key={index} 
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: '1px solid #691B19',
                  background: selectedCategory === category ? '#691B19' : 'white',
                  color: selectedCategory === category ? 'white' : '#691B19',
                  fontSize: '14px'
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[24, 24]} justify="start">
            {services.map((service) => (
              <Col xs={24} sm={12} md={8} lg={6} key={service._id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: 'relative', overflow: 'visible' }}>
                      <img
                        src={service.image ? `${import.meta.env.VITE_API_BASE_URL}${service.image}` : '/placeholder.jpg'}
                        alt={service.title}
                        style={{ 
                          width: '100%', 
                          height: '220px', 
                          objectFit: 'cover', 
                          borderRadius: '20px 20px 0 0'
                        }}
                      />
                      <Button
                        type="primary"
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#FFFFFF1A',
                          border: '1px solid #828282',
                          backdropFilter: 'blur(2px)',
                          color: '#ffffff',
                          fontWeight: '500',
                          fontFamily: 'Poppins, sans-serif',
                          borderRadius: '8px'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/contact?service=${encodeURIComponent(service.title)}&type=service`);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  }
                  style={{ 
                    borderRadius: '20px', 
                    overflow: 'visible', 
                    textAlign: 'center',
                    border: 'none',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    fontFamily: 'Poppins, sans-serif',
                    height: '100%'
                  }}
                >
                  <Meta
                    title={
                      <span style={{ 
                        fontFamily: 'Poppins, sans-serif', 
                        color: '#691B19', 
                        fontWeight: '600',
                        fontSize: '18px'
                      }}>
                        {service.title}
                      </span>
                    }
                    description={
                      <span style={{ 
                        color: '#828282', 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}>
                        {service.subtitle}
                      </span>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          {services.length === 0 && (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 120 }}
              description={
                <span style={{ fontFamily: 'Poppins, sans-serif', color: '#666', fontSize: '16px' }}>
                  No services available at the moment.
                </span>
              }
              style={{ padding: '60px 20px' }}
            />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${ctaBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px)',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'Bastoni, serif',
              fontWeight: '600',
              fontSize: 'clamp(28px, 6vw, 42px)',
              color: 'white',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              lineHeight: '1.3',
            }}
          >
            Ready to Experience Divine Blessings?
          </h2>
          <p style={{
            color: '#F4E2C9',
            fontSize: 'clamp(16px, 3vw, 18px)',
            marginBottom: '30px',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Book your personalized pooja service today and bring peace to your home.
          </p>
          <Button
            style={{
              background: '#691B19',
              color: '#F4E2C9',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              padding: 'clamp(8px, 2vw, 12px) clamp(24px, 5vw, 32px)',
              fontSize: 'clamp(14px, 3vw, 16px)',
              height: 'auto',
              minHeight: '48px'
            }}
            onClick={() => navigate('/contact')}
          >
            Book a Pooja Now
          </Button>
        </div>
      </section>

      {services.length === 0 && (
        <section style={{ padding: '60px 20px', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 120 }}
              description={
                <span style={{ fontFamily: 'Poppins, sans-serif', color: '#666', fontSize: '16px' }}>
                  No services available at the moment.
                </span>
              }
              style={{ padding: '60px 20px' }}
            />
          </div>
        </section>
      )}

    </>
  );
};

export default Services;