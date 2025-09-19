import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { frontendAPI } from '../../utils/api';

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
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative', overflow: 'visible' }}>
                    <img
                      src={service.image ? `http://localhost:5000${service.image}` : '/placeholder.jpg'}
                      alt={service.title}
                      style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px' }}
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
                        navigate(`/contact?service=${encodeURIComponent(service.title)}&type=service`);
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
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <Meta
                  title={<span style={{ fontFamily: 'Poppins, sans-serif', color: '#691B19', fontWeight: '400' }}>{service.title}</span>}
                  description={<span style={{ color: '#828282', fontFamily: 'Poppins, sans-serif' }}>{service.subtitle}</span>}
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
