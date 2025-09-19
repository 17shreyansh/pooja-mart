import React from 'react';
import { Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import featuredBG from '../../assets/ctaBG.jpg';

const BookPoojaCTA = () => {
  const navigate = useNavigate();
  return (
    <section
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${featuredBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px)',
        borderRadius: '12px',
        margin: '0 auto',
        // maxWidth: '1200px'
      }}
    >
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <Row justify="start">
          <Col xs={24} sm={20} md={14} lg={12}>
            <div style={{ 
              textAlign: 'left', 
              maxWidth: '480px',
              width: '100%'
            }}>
              <h2
                style={{
                  fontFamily: 'Bastoni, serif',
                  fontWeight: '600',
                  fontSize: 'clamp(24px, 6vw, 40px)',
                  color: 'white',
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  lineHeight: '1.3',
                }}
              >
                Book Your Pooja. <br />
                Shop Divine Essentials.
              </h2>

              <Button
                style={{
                  background: '#691B19',
                  color: '#F4E2C9',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '400',
                  padding: 'clamp(4px, 1vw, 6px) clamp(16px, 4vw, 22px)',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  height: 'auto',
                  minHeight: '40px'
                }}
                onClick={() => navigate('/contact')}
              >
                Book a Pooja
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default BookPoojaCTA;
