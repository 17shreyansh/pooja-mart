import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { frontendAPI } from '../../utils/api';
import WhatsAppButton from '../common/WhatsAppButton';
import { useWhatsApp } from '../../utils/WhatsAppContext';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#service-fonts')) {
  const style = document.createElement('style');
  style.id = 'service-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const { Meta } = Card;

const OurServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const { whatsappNumber } = useWhatsApp();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await frontendAPI.getServices();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <section className="our-services" style={{ padding: '50px 0', background: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      <div className="container">
        <h2 style={{
          fontSize: "36px",
          fontWeight: "600",
          color: "#6B1E1E",
          marginBottom: "20px",
          fontFamily: "Bastoni",
          textAlign: 'center'
        }}>
          Our Services
        </h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {Array.isArray(services) && services.map((service, index) => (
            <SwiperSlide key={index}>
              <Card
                hoverable
                onClick={() => navigate(`/poojas?service=${service._id}`)}
                cover={
                  <div style={{ position: 'relative', overflow: 'visible' }}>
                    <img
                      src={service.image ? `${import.meta.env.VITE_API_BASE_URL}${service.image}` : '/src/assets/ser1.jpg'}
                      alt={service.name}
                      style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px' }}
                      onError={(e) => { e.target.src = '/src/assets/ser1.jpg'; }}
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
                          navigate(`/contact?service=${encodeURIComponent(service.name)}&type=service`);
                        }}
                      >
                        Book Now
                      </Button>
                      <WhatsAppButton
                        whatsappNumber={whatsappNumber}
                        message={`Hi, I'm interested in ${service.name} service. Please provide more details.`}
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
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <Meta
                  title={<span style={{ fontFamily: 'Poppins, sans-serif', color: '#691B19', fontWeight: '400' }}>{service.name}</span>}
                  description={<span style={{ color: '#828282', fontFamily: 'Poppins, sans-serif' }}>{service.description?.substring(0, 50)}...</span>}
                />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurServices;
