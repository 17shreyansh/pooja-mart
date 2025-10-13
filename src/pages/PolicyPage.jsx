import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert, Row, Col } from 'antd';
import { frontendAPI } from '../utils/api';
import bg from '../assets/featuredBG.png';
import topStrip from '../assets/bottom-strip.png';
import '../styles/PolicyPage.css';

const PolicyPage = () => {
  const { type } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const policyTitles = {
    'return-refund-policy': 'Return and Refund Policy',
    'terms-conditions': 'Terms and Conditions',
    'privacy-policy': 'Privacy Policy',
    'shipping-policy': 'Shipping Policy',
    'faqs': 'Frequently Asked Questions'
  };

  useEffect(() => {
    fetchPage();
  }, [type]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await frontendAPI.get(`/pages/${type}`);
      setPage(response.data.data);
    } catch (error) {
      setError('Page not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `url(${bg})`,
        backgroundSize: 'cover'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ background: `url(${bg})`, minHeight: '60vh', padding: '40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <Alert message={error} type="error" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: `url(${bg})`, minHeight: '80vh' }}>
      <img src={topStrip} alt="Decorative Strip" style={{ width: '100%', display: 'block' }} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <Row justify="center">
          <Col xs={24} lg={18}>
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '60px 40px',
              boxShadow: '0 10px 40px rgba(92, 31, 31, 0.1)',
              border: '2px solid #f0f0f0'
            }}>
              <h1 style={{
                textAlign: 'center',
                marginBottom: '50px',
                color: '#5c1f1f',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '700',
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 4px rgba(92, 31, 31, 0.1)'
              }}>
                {page?.title || policyTitles[type]}
              </h1>
              
              {page?.content ? (
                <div 
                  className="policy-content"
                  dangerouslySetInnerHTML={{ __html: page.content }} 
                />
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '80px 20px', 
                  color: '#666',
                  background: '#fafafa',
                  borderRadius: '15px',
                  border: '1px dashed #ddd'
                }}>
                  <h3 style={{ color: '#5c1f1f', marginBottom: '20px' }}>Content Coming Soon</h3>
                  <p>We are working on updating this policy. Please check back later or contact us for more information.</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PolicyPage;