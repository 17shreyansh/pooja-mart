import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import featuredBG from '../../assets/featuredBG.png';
import bottomStrip from '../../assets/bottom-strip.png';
import { frontendAPI } from '../../utils/api';
import { API_BASE_URL } from '../../config/api';
import WhatsAppButton from '../common/WhatsAppButton';
import { useWhatsApp } from '../../utils/WhatsAppContext';

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
  const { whatsappNumber } = useWhatsApp();

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
          {Array.isArray(poojas) && poojas.map((pooja, index) => (
            <SwiperSlide key={index}>
              <Card
                hoverable
                onClick={() => navigate(`/pooja/${pooja.slug || pooja._id}`)}
                cover={
                  <div style={{ position: 'relative', overflow: 'visible' }}>
                    <img
                      src={pooja.image ? `${API_BASE_URL}${pooja.image}` : '/src/assets/fp1.jpg'}
                      alt={pooja.title}
                      style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '10px', background: 'none' }}
                      onError={(e) => { e.target.src = '/src/assets/fp1.jpg'; }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <Button
                        type="primary"
                        style={{
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
                      <WhatsAppButton
                        whatsappNumber={whatsappNumber}
                        message={`Hi, I'm interested in ${pooja.title} pooja. Please provide more details.`}
                        size="small"
                        style={{
                          background: '#25D366AA',
                          backdropFilter: 'blur(2px)',
                          border: '1px solid #25D366'
                        }}
                      />
                    </div>
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
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <Meta
                  title={<span style={{ fontFamily: 'Poppins, sans-serif', color: '#691B19', fontWeight: '400' }}>{pooja.title}</span>}
                  description={
                    <span style={{ 
                      color: '#828282', 
                      fontFamily: 'Poppins, sans-serif',
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