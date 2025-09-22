import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { frontendAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';
import ctaBG from '../assets/ctaBG.jpg';
import image01 from '../assets/image01.png';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#poojas-fonts')) {
  const style = document.createElement('style');
  style.id = 'poojas-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const { Meta } = Card;

const Poojas = () => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoojas();
  }, [searchTerm, selectedCategory]);

  const fetchPoojas = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await frontendAPI.getPoojas(params);
      setPoojas(response.data.data);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching poojas:', error);
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
            Book a Pooja
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#691B19',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Experience divine blessings with our authentic pooja services performed by experienced pandits.
          </p>
          
          {/* Decorative Image */}
          <img
            src={image01}
            alt="Pooja Services"
            style={{ 
              maxWidth: '300px', 
              width: '100%', 
              height: 'auto',
              margin: '20px auto'
            }}
          />
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Poojas Grid Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Categories Section */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
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
                All Poojas
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category._id || category} 
                  onClick={() => setSelectedCategory(category._id || category)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: '1px solid #691B19',
                    background: selectedCategory === (category._id || category) ? '#691B19' : 'white',
                    color: selectedCategory === (category._id || category) ? 'white' : '#691B19',
                    fontSize: '14px'
                  }}
                >
                  {category.name || category}
                </Button>
              ))}
            </div>
          </div>

          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#6B1E1E',
            marginBottom: '40px',
            fontFamily: 'Bastoni',
            textAlign: 'center'
          }}>
            Available Poojas
          </h2>
          
          <Row gutter={[30, 30]} justify="center">
            {poojas.map((pooja) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pooja._id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/pooja/${pooja.slug}`)}
                  cover={
                    <div style={{ position: 'relative', overflow: 'visible' }}>
                      <img
                        src={pooja.image ? `${import.meta.env.VITE_API_BASE_URL}${pooja.image}` : '/src/assets/fp1.jpg'}
                        onError={(e) => { e.target.src = '/src/assets/fp1.jpg'; }}
                        alt={pooja.title}
                        style={{ 
                          width: '100%', 
                          aspectRatio: '3/4', 
                          objectFit: 'cover', 
                          borderRadius: '15px 15px 0 0'
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
                          navigate(`/contact?service=${encodeURIComponent(pooja.title)}&type=pooja`);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  }
                  style={{ 
                    borderRadius: '15px', 
                    overflow: 'visible', 
                    textAlign: 'center',
                    border: 'none',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    fontFamily: 'Poppins, sans-serif',
                    minHeight: '400px',
                    cursor: 'pointer'
                  }}
                >
                  <Meta
                    title={
                      <span style={{ 
                        fontFamily: 'Poppins, sans-serif', 
                        color: '#691B19', 
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        {pooja.title}
                      </span>
                    }
                    description={
                      <span style={{ 
                        color: '#828282', 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {pooja.description}
                      </span>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          {poojas.length === 0 && (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 120 }}
              description={
                <span style={{ fontFamily: 'Poppins, sans-serif', color: '#666', fontSize: '16px' }}>
                  No poojas available at the moment.
                </span>
              }
              style={{ padding: '60px 20px' }}
            />
          )}
        </div>
      </section>

    </>
  );
};

export default Poojas;