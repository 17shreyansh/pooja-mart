import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, Tag, Card, Badge } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { frontendAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollectionDetail();
  }, [id]);

  const fetchCollectionDetail = async () => {
    try {
      const response = await frontendAPI.getCollectionById(id);
      setCollection(response.data.data);
    } catch (error) {
      console.error('Error fetching collection details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h2 style={{ color: '#691B19', marginBottom: '20px' }}>Collection not found</h2>
        <Button 
          onClick={() => navigate('/shop')}
          style={{
            background: '#691B19',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Back to Shop
        </Button>
      </div>
    );
  }

  const isInStock = collection.stock > 0;
  const stockStatus = isInStock ? 'In Stock' : 'Out of Stock';
  const stockColor = isInStock ? '#52c41a' : '#ff4d4f';
  const stockIcon = isInStock ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />;

  return (
    <>
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `url(${featuredBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '120px 20px 80px',
          position: 'relative',
          minHeight: '500px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/shop')}
            style={{ 
              position: 'absolute',
              left: '0',
              top: '20px',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #691B19',
              color: '#691B19',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Back to Shop
          </Button>
          
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <Tag 
              style={{
                background: 'rgba(105, 27, 25, 0.1)',
                color: '#691B19',
                border: '1px solid #691B19',
                borderRadius: '20px',
                padding: '4px 16px',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                marginBottom: '20px'
              }}
            >
              {collection.category}
            </Tag>
            
            <h1 style={{
              fontSize: 'clamp(36px, 8vw, 56px)',
              fontWeight: '700',
              color: '#691B19',
              marginBottom: '24px',
              fontFamily: 'Bastoni, serif',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {collection.title}
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: '#691B19',
              maxWidth: '700px',
              margin: '0 auto 32px',
              lineHeight: '1.7',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '400',
              opacity: '0.9'
            }}>
              {collection.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.95)',
                padding: '16px 32px',
                borderRadius: '50px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(105, 27, 25, 0.2)'
              }}>
                <span style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#691B19',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  ₹{collection.price?.toLocaleString()}
                </span>
              </div>
              
              <Badge 
                count={isInStock ? collection.stock : 0}
                showZero={false}
                style={{ backgroundColor: stockColor }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  border: `2px solid ${stockColor}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}>
                  {stockIcon}
                  <span style={{
                    color: stockColor,
                    fontSize: '16px',
                    fontWeight: '600',
                    marginLeft: '8px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {stockStatus}
                  </span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Product Details Section */}
      <section style={{ 
        background: '#fff', 
        padding: '80px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={collection.image ? `${import.meta.env.VITE_API_BASE_URL}${collection.image}` : '/placeholder.jpg'}
                  alt={collection.title}
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    objectFit: 'cover',
                    aspectRatio: '1/1'
                  }}
                />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ padding: '0 20px' }}>
                <h2 style={{
                  fontSize: 'clamp(28px, 5vw, 36px)',
                  fontWeight: '700',
                  color: '#691B19',
                  marginBottom: '24px',
                  fontFamily: 'Bastoni, serif'
                }}>
                  Product Information
                </h2>
                
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.8',
                  marginBottom: '32px'
                }}>
                  {collection.description}
                </p>

                <Card
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(105, 27, 25, 0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    marginBottom: '24px'
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Category</p>
                        <p style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: '500' }}>{collection.category}</p>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Price</p>
                        <p style={{ margin: 0, color: '#691B19', fontSize: '20px', fontWeight: '700' }}>
                          ₹{collection.price?.toLocaleString()}
                        </p>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div style={{ 
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: '16px', 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ color: '#666', fontSize: '14px' }}>Availability</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {stockIcon}
                          <span style={{
                            color: stockColor,
                            fontSize: '16px',
                            fontWeight: '600',
                            marginLeft: '8px'
                          }}>
                            {isInStock ? `${collection.stock} items available` : 'Currently unavailable'}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Attributes Section */}
      {collection.attributes && collection.attributes.length > 0 && (
        <section style={{ 
          background: '#F9F6EE', 
          padding: '80px 20px',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 6vw, 42px)',
                fontWeight: '700',
                color: '#691B19',
                marginBottom: '16px',
                fontFamily: 'Bastoni, serif'
              }}>
                Product Specifications
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Detailed information about this sacred collection item
              </p>
            </div>
            
            <Row gutter={[32, 32]} justify="center">
              {collection.attributes.map((attr, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '28px 24px',
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    height: '100%',
                    border: '1px solid rgba(105, 27, 25, 0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #691B19, #8B2635)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <InfoCircleOutlined style={{ color: 'white', fontSize: '20px' }} />
                    </div>
                    
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#691B19',
                      marginBottom: '12px',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {attr.name}
                    </h3>
                    <p style={{
                      color: '#666',
                      fontSize: '15px',
                      margin: 0,
                      lineHeight: '1.5',
                      fontWeight: '500'
                    }}>
                      {attr.value}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section style={{ 
        background: '#fff', 
        padding: '80px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 42px)',
            fontWeight: '700',
            color: '#691B19',
            marginBottom: '40px',
            fontFamily: 'Bastoni, serif',
            textAlign: 'center'
          }}>
            Customer Reviews
          </h2>
          
          <Row gutter={[24, 24]}>
            {[
              { name: 'Meera Patel', text: 'Beautiful quality items with authentic spiritual significance. Very happy with my purchase.', rating: 5 },
              { name: 'Suresh Gupta', text: 'Excellent packaging and fast delivery. The items are exactly as described and of premium quality.', rating: 5 }
            ].map((testimonial, index) => (
              <Col xs={24} md={12} key={index}>
                <div style={{
                  background: '#F9F6EE',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(105, 27, 25, 0.1)',
                  height: '100%'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarOutlined key={i} style={{ color: '#FFD700', fontSize: '16px' }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    fontStyle: 'italic'
                  }}>
                    "{testimonial.text}"
                  </p>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#691B19'
                  }}>
                    - {testimonial.name}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #691B19, #8B2635)',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Bastoni, serif',
            fontWeight: '700',
            fontSize: 'clamp(32px, 6vw, 48px)',
            color: 'white',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            {isInStock ? 'Add to Your Sacred Collection' : 'Currently Unavailable'}
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '1.6'
          }}>
            {isInStock 
              ? 'Get in touch with us to place your order for this authentic spiritual item'
              : 'This item is currently out of stock. Contact us to know when it will be available again'
            }
          </p>
          <Button
            size="large"
            icon={<ShoppingCartOutlined />}
            disabled={!isInStock}
            style={{
              background: isInStock ? '#F4E2C9' : 'rgba(255,255,255,0.3)',
              color: isInStock ? '#691B19' : 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '600',
              padding: '16px 40px',
              fontSize: '18px',
              height: 'auto',
              boxShadow: isInStock ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
              cursor: isInStock ? 'pointer' : 'not-allowed'
            }}
            onClick={() => isInStock && navigate(`/contact?service=${encodeURIComponent(collection.title)}&type=collection`)}
          >
            {isInStock ? 'Order Now' : 'Out of Stock'}
          </Button>
        </div>
      </section>
    </>
  );
};

export default CollectionDetail;