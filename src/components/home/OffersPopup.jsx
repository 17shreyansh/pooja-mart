import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const OffersPopup = () => {
  const [offers, setOffers] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/offers');
      const data = await response.json();
      
      if (data.success && data.offers.length > 0) {
        const activeOffers = data.offers.filter(o => o.isActive);
        if (activeOffers.length > 0) {
          setOffers(activeOffers);
          setTimeout(() => setVisible(true), 2000);
        }
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  if (offers.length === 0) return null;

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={600}
      centered
      closable={true}
      styles={{ 
        body: { padding: 0 },
        header: { backgroundColor: 'rgba(0,0,0,0.8)' }
      }}
      closeIcon={<span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>×</span>}
    >
      {offers.length === 1 ? (
        <img 
          src={`http://localhost:5000${offers[0].image}`} 
          alt={offers[0].title}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
        >
          {offers.map((offer, index) => (
            <SwiperSlide key={index}>
              <img 
                src={`http://localhost:5000${offer.image}`} 
                alt={offer.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Modal>
  );
};

export default OffersPopup;