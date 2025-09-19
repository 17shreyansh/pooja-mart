import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import featuredBG from '../../assets/featuredBG.png';
import bottomStrip from '../../assets/bottom-strip.png';
import { frontendAPI } from '../../utils/api';
import { API_BASE_URL } from '../../config/api';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#featured-fonts')) {
  const style = document.createElement('style');
  style.id = 'featured-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const { Meta } = Card;

const FeaturedPoojas = () => {
  const [poojas, setPoojas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoojas();
  }, []);

  const fetchPoojas = async () => {
    try {
      const response = await frontendAPI.getPoojas();
      setPoojas(response.data.data);
    } catch (error) {
      console.error('Error fetching poojas:', error);
    }
  };

  return (
    <section 
      className="featured-poojas" 
      style={{ 
        backgroundImage: `url(${featuredBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Poppins, sans-serif' 
      }}
    >
      <div style={{ textAlign: 'center', padding: '60px 20px 40px 20px' }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '600',
          color: '#6B1E1E',
          marginBottom: '20px',
          fontFamily: 'Bastoni'
        }}>
          Featured Poojas
        </h2>


        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {poojas.map((pooja, index) => (
            <SwiperSlide key={index}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative', overflow: 'visible' }}>
                    <img
                      src={pooja.image ? `${API_BASE_URL}${pooja.image}` : '/placeholder.jpg'}
                      alt={pooja.title}
                      style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '10px', background: 'none' }}
                    />
                    <Button
                      type="primary"
                      style={{
                        position: 'absolute',
                        bottom: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#FFFFFF1A',
                        border: '1px solid #828282',
                        backdropFilter: 'blur(2px)',
                        color: '#ffffff',
                        fontWeight: '500',
                        fontFamily: 'Poppins, sans-serif'
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
                  boxShadow: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '480px',
                  background: 'transparent'
                }}
              >
                <Meta
                  title={<span style={{ fontFamily: 'Poppins, sans-serif', color: '#691B19', fontWeight: '400' }}>{pooja.title}</span>}
                  description={<span style={{ color: '#828282', fontFamily: 'Poppins, sans-serif' }}>{pooja.subtitle}</span>}
                />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Bottom Decorative Strip - Full Width */}
      <img
        src={bottomStrip}
        alt="Decorative Strip"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </section>
  );
};

export default FeaturedPoojas;