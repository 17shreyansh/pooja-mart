import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const OffersPopup = () => {
  const [offers, setOffers] = useState([]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/offers`);
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

  const getOfferLink = (offerType) => {
    switch (offerType) {
      case 'pooja': return '/poojas';
      case 'collection': return '/shop';
      default: return '/contact';
    }
  };

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
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={offers.length > 1}
      >
        {offers.map((offer, index) => (
          <SwiperSlide key={index}>
            <div style={{ position: 'relative' }}>
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}${offer.image}`} 
                alt={offer.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                <Button 
                  type="primary" 
                  size="large"
                  style={{ background: '#691B19', border: 'none' }}
                  onClick={() => {
                    navigate(getOfferLink(offer.offerType));
                    setVisible(false);
                  }}
                >
                  {offer.buttonText || 'View Offer'}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Modal>
  );
};

export default OffersPopup;