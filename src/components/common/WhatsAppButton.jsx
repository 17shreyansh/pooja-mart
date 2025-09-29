import React from 'react';
import { Button } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';

const WhatsAppButton = ({ 
  whatsappNumber, 
  message = "Hi, I'm interested in this service. Please provide more details.", 
  size = "small",
  style = {},
  className = ""
}) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!whatsappNumber) {
      console.warn('WhatsApp number not configured');
      return;
    }
    
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!whatsappNumber) return null;

  return (
    <Button
      type="default"
      size={size}
      icon={<WhatsAppOutlined />}
      onClick={handleWhatsAppClick}
      className={className}
      style={{
        background: '#25D366',
        border: 'none',
        color: 'white',
        borderRadius: '6px',
        fontSize: 'clamp(10px, 2vw, 12px)',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '400',
        flexShrink: 0,
        height: 'auto',
        minHeight: '24px',
        ...style
      }}
    >
      Inquiry
    </Button>
  );
};

export default WhatsAppButton;