import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { frontendAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const PolicyPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const response = await frontendAPI.getPage(slug);
      setPage(response.data.data);
    } catch (error) {
      console.error('Error fetching page:', error);
      setPage(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center', 
        fontFamily: 'Poppins, sans-serif' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center', 
        fontFamily: 'Poppins, sans-serif' 
      }}>
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `url(${featuredBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '120px 20px 60px',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '600',
            color: '#6B1E1E',
            marginBottom: '20px',
            fontFamily: 'Bastoni'
          }}>
            {page.title}
          </h1>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Content Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div 
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
    </>
  );
};

export default PolicyPage;