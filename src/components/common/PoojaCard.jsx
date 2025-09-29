import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { useWhatsApp } from '../../utils/WhatsAppContext';

const PoojaCard = ({ image, title, description, id, slug, type = 'pooja', onClick }) => {
  const navigate = useNavigate();
  const { whatsappNumber } = useWhatsApp();
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      const routeMap = {
        pooja: 'pooja',
        service: 'service', 
        collection: 'collection'
      };
      const identifier = slug || id;
      navigate(`/${routeMap[type] || type}/${identifier}`);
    }
  };
  
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '15px',
        overflow: 'hidden',
        textAlign: 'left',
        background: '#F9F6EE',
        border: 'none',
        padding: 'clamp(8px, 2vw, 12px)',
        width: '100%',
        maxWidth: '280px',
        minWidth: '160px',
        margin: '0 auto',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      {/* Image with fixed portrait ratio */}
      <div
        style={{
          width: '100%',
          aspectRatio: '3 / 4', // portrait lock
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#FFF6EA'
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
          onError={(e) => { e.target.src = '/src/assets/fp3.jpg'; }}
        />
      </div>

      {/* Text Content */}
      <div style={{ marginTop: '8px' }}>
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            color: '#333333',
            fontWeight: '500',
            margin: '2px 0',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {title}
        </h3>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '6px',
          gap: '8px'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                color: '#828282',
                fontFamily: 'Poppins, sans-serif',
                margin: '0',
                fontSize: 'clamp(10px, 2vw, 12px)',
                lineHeight: '1.2',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {description}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button
              type="primary"
              size="small"
              style={{
                background: '#691B19',
                border: 'none',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: 'clamp(10px, 2vw, 12px)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                color: '#F4E2C9',
                flexShrink: 0,
                height: 'auto',
                minHeight: '24px'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/contact?service=${encodeURIComponent(title)}&type=${type}`);
                return false;
              }}
            >
              {type === 'collection' ? 'Enquiry' : 'Book Now'}
            </Button>
            <WhatsAppButton
              whatsappNumber={whatsappNumber}
              message={`Hi, I'm interested in ${title}. Please provide more details.`}
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoojaCard;
