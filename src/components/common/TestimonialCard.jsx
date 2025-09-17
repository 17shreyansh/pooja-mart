import React from 'react';
import bg from '../../assets/tc.jpg';

const TestimonialCard = ({ testimonial, author }) => {
  return (
    <div
      style={{
        background: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        borderRadius: '15px',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)',
        textAlign: 'center',
        border: '1px solid #E5E5E5',
        width: '100%',
        maxWidth: '300px',
        minWidth: '200px',
        height: 'clamp(280px, 35vw, 320px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        margin: '0 auto'
      }}
    >
      <div>
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(13px, 2.5vw, 15px)',
            color: '#691B19',
            lineHeight: '1.5',
            marginBottom: 'clamp(16px, 3vw, 20px)',
            fontWeight: '400',
          }}
        >
          {testimonial}
        </p>
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: '#000000',
            fontWeight: '500',
            margin: '0',
          }}
        >
          {author}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
