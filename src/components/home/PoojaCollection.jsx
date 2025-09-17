import React from 'react';
import { Row, Col } from 'antd';
import featuredBG from '../../assets/featuredBG.png';
import PoojaCard from '../common/PoojaCard';
import ser1 from '../../assets/fp1.jpg';
import ser2 from '../../assets/fp2.jpg';
import ser3 from '../../assets/fp3.jpg';
import ser4 from '../../assets/fp4.jpg';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#pooja-collection-fonts')) {
  const style = document.createElement('style');
  style.id = 'pooja-collection-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const PoojaCollection = () => {
  const poojas = [
    {
      image: ser1,
      title: 'Ganesh Puja',
      subtitle1: 'Traditional blessing ceremony',
      subtitle2: 'Remove obstacles and bring prosperity'
    },
    {
      image: ser2,
      title: 'Lakshmi Puja',
      subtitle1: 'Prosperity and wealth ritual',
      subtitle2: 'Attract abundance and fortune'
    },
    {
      image: ser3,
      title: 'Saraswati Puja',
      subtitle1: 'Knowledge and wisdom blessing',
      subtitle2: 'Enhance learning and creativity'
    },
    {
      image: ser4,
      title: 'Durga Puja',
      subtitle1: 'Divine protection ceremony',
      subtitle2: 'Strength and courage blessing'
    }
  ];

  return (
    <section 
      className="pooja-collection" 
      style={{ 
        backgroundImage: `url(${featuredBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Poppins, sans-serif' 
      }}
    >
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 16px 40px 16px' 
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: '600',
          color: '#6B1E1E',
          marginBottom: '32px',
          fontFamily: 'Bastoni',
          textAlign: 'center'
        }}>
          Pooja Collection
        </h2>

        <Row gutter={[8, 12]} justify="center">
          {poojas.map((pooja, index) => (
            <Col key={index} xs={12} sm={12} md={6} lg={6} xl={6}>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 4px' }}>
                <PoojaCard
                  image={pooja.image}
                  title={pooja.title}
                  subtitle1={pooja.subtitle1}
                  subtitle2={pooja.subtitle2}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default PoojaCollection;