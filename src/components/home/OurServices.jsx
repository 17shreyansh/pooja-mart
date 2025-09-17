import React from 'react';
import { Card, Button } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ser1 from '../../assets/ser1.jpg';
import ser2 from '../../assets/ser2.jpg';
import ser3 from '../../assets/ser3.jpg';
import ser4 from '../../assets/ser4.jpg';
import ser5 from '../../assets/ser5.jpg';

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
  const services = [
    {
      image: ser1,
      title: 'Pandit Ji',
      subtitle: 'Sub title text'
    },
    {
      image: ser2,
      title: 'Visarjan',
      subtitle: 'Sub title text'
    },
    {
      image: ser3,
      title: 'Vastu and Numerology',
      subtitle: 'Sub title text'
    },
    {
      image: ser4,
      title: 'Puja Samagri',
      subtitle: 'Sub title text'
    },
    {
      image: ser5,
      title: 'Puja Samagri',
      subtitle: 'Sub title text'
    }
  ];

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
                      src={service.image}
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
                    >
                      Book a Pooja
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
