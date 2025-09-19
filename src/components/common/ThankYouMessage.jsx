import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

const ThankYouMessage = ({ visible, onClose, title = "Thank You!", message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          border: '2px solid #691B19',
          transform: show ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#691B19'
          }}
        >
          <CloseOutlined />
        </button>
        
        <CheckCircleOutlined 
          style={{
            fontSize: '60px',
            color: '#52c41a',
            marginBottom: '20px'
          }}
        />
        
        <h2 style={{
          color: '#691B19',
          marginBottom: '15px',
          fontSize: '24px'
        }}>
          {title}
        </h2>
        
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '25px'
        }}>
          {message}
        </p>
        
        <button 
          onClick={onClose}
          style={{
            background: '#691B19',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ThankYouMessage;