import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, StarOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { frontendAPI, testimonialsAPI } from '../utils/api';
import { Form, Input, Rate, Modal, message } from 'antd';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const PoojaDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pooja, setPooja] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialModalVisible, setTestimonialModalVisible] = useState(false);
  const [testimonialForm] = Form.useForm();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchPoojaDetail();
  }, [slug]);

  const fetchPoojaDetail = async () => {
    try {
      const poojaResponse = await frontendAPI.getPoojaBySlug(slug);
      setPooja(poojaResponse.data.data);
      
      const testimonialsResponse = await testimonialsAPI.getAll({ service: poojaResponse.data.data.title });
      setTestimonials(testimonialsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!pooja) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h2 style={{ color: '#691B19', marginBottom: '20px' }}>Pooja not found</h2>
        <Button 
          onClick={() => navigate('/poojas')}
          style={{
            background: '#691B19',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Back to Poojas
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `linear-gradient(rgba(105, 27, 25, 0.1), rgba(105, 27, 25, 0.1)), url(${featuredBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '100px 20px 60px',
          position: 'relative',
          minHeight: '400px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/poojas')}
            style={{ 
              position: 'absolute',
              left: '0',
              top: '0',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #691B19',
              color: '#691B19',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              height: 'auto'
            }}
          >
            Back to Poojas
          </Button>
          
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <Tag 
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#691B19',
                border: '1px solid #691B19',
                borderRadius: '25px',
                padding: '6px 20px',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                marginBottom: '24px',
                backdropFilter: 'blur(10px)'
              }}
            >
              {pooja.service?.name || pooja.service}
            </Tag>
            
            <h1 style={{
              fontSize: 'clamp(32px, 7vw, 48px)',
              fontWeight: '700',
              color: '#691B19',
              marginBottom: '20px',
              fontFamily: 'Bastoni, serif',
              lineHeight: '1.2',
              textShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {pooja.title}
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: '#691B19',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '400',
              opacity: '0.85'
            }}>
              {pooja.description}
            </p>
          </div>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Main Content Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Row gutter={[40, 40]}>
            {/* Left Side - Sticky Images Gallery */}
            <Col xs={24} lg={10}>
              <div style={{ position: 'sticky', top: '100px', zIndex: 10 }}>
                {/* Main Image */}
                <div style={{ 
                  background: '#F9F6EE',
                  borderRadius: '24px',
                  padding: '12px',
                  marginBottom: '16px',
                  boxShadow: '0 8px 32px rgba(105, 27, 25, 0.08)'
                }}>
                  <img
                    src={selectedImageIndex === 0 
                      ? (pooja.image ? `${import.meta.env.VITE_API_BASE_URL}${pooja.image}` : '/placeholder.jpg')
                      : `${import.meta.env.VITE_API_BASE_URL}${pooja.showcaseImages[selectedImageIndex - 1]}`
                    }
                    alt={pooja.title}
                    style={{
                      width: '100%',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      aspectRatio: '4/3',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Main image thumbnail */}
                  <div 
                    onClick={() => setSelectedImageIndex(0)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImageIndex === 0 ? '3px solid #691B19' : '2px solid #E5E5E5',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={pooja.image ? `${import.meta.env.VITE_API_BASE_URL}${pooja.image}` : '/placeholder.jpg'}
                      alt={pooja.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  {/* Showcase images thumbnails */}
                  {pooja.showcaseImages && pooja.showcaseImages.slice(0, 5).map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx + 1)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImageIndex === idx + 1 ? '3px solid #691B19' : '2px solid #E5E5E5',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${img}`}
                        alt={`${pooja.title} showcase ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Quick Action Button */}
                <div style={{ marginTop: '24px' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    block
                    style={{
                      background: 'linear-gradient(135deg, #691B19, #8B2635)',
                      border: 'none',
                      borderRadius: '16px',
                      fontWeight: '600',
                      fontSize: '16px',
                      fontFamily: 'Poppins, sans-serif',
                      height: '52px',
                      boxShadow: '0 8px 24px rgba(105, 27, 25, 0.25)'
                    }}
                    onClick={() => navigate(`/contact?service=${encodeURIComponent(pooja.title)}&type=pooja`)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Col>

            {/* Right Side - Details */}
            <Col xs={24} lg={14}>
              <div style={{ paddingLeft: '0px' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: 'clamp(28px, 5vw, 36px)',
                    fontWeight: '700',
                    color: '#691B19',
                    marginBottom: '12px',
                    fontFamily: 'Bastoni, serif'
                  }}>
                    Available Packages
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: '#666',
                    marginBottom: '0',
                    lineHeight: '1.6'
                  }}>
                    Choose from our carefully curated packages with authentic sacred items
                  </p>
                </div>

                {pooja.packages && pooja.packages.length > 0 && (
                  <Row gutter={[16, 16]}>
                    {pooja.packages.map((pkg, idx) => (
                      <Col xs={24} md={12} key={idx}>
                        <div style={{
                          background: '#F9F6EE',
                          borderRadius: '20px',
                          padding: '28px',
                          border: '1px solid rgba(105, 27, 25, 0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                        {/* Package Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <h3 style={{
                              fontSize: '22px',
                              fontWeight: '700',
                              color: '#691B19',
                              margin: 0,
                              fontFamily: 'Poppins, sans-serif',
                              marginBottom: '4px'
                            }}>
                              {pkg.name}
                            </h3>
                            {pkg.duration && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#666',
                                fontSize: '14px'
                              }}>
                                <ClockCircleOutlined />
                                <span>{pkg.duration}</span>
                              </div>
                            )}
                          </div>
                          <div style={{
                            background: 'linear-gradient(135deg, #691B19, #8B2635)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '20px',
                            fontWeight: '700',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            ₹{pkg.price?.toLocaleString()}
                          </div>
                        </div>
                        
                        <p style={{
                          fontSize: '15px',
                          color: '#666',
                          lineHeight: '1.6',
                          marginBottom: '20px'
                        }}>
                          {pkg.description}
                        </p>



                        {pkg.collections && pkg.collections.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <h4 style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#691B19',
                              marginBottom: '12px'
                            }}>
                              Sacred Items:
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {pkg.collections.map((collection, ci) => (
                                <div key={ci} style={{
                                  background: '#fff',
                                  padding: '12px 16px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(105, 27, 25, 0.1)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <span style={{
                                    color: '#691B19',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                  }}>
                                    {collection.title}
                                  </span>
                                  <span style={{
                                    color: '#666',
                                    fontWeight: '600',
                                    fontSize: '14px'
                                  }}>
                                    ₹{collection.price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: 'auto' }}>
                          <Button
                            type="primary"
                            size="large"
                            style={{
                              background: 'linear-gradient(135deg, #691B19, #8B2635)',
                              border: 'none',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '16px',
                              fontFamily: 'Poppins, sans-serif',
                              width: '100%',
                              height: '48px',
                              boxShadow: '0 6px 20px rgba(105, 27, 25, 0.25)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(105, 27, 25, 0.35)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 6px 20px rgba(105, 27, 25, 0.25)';
                            }}
                            onClick={() => navigate(`/contact?service=${encodeURIComponent(pooja.title)}&package=${encodeURIComponent(pkg.name)}&type=pooja`)}
                          >
                            Select This Package
                          </Button>
                        </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}

                <Divider style={{ margin: '40px 0', borderColor: 'rgba(105, 27, 25, 0.1)' }} />
                
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(105, 27, 25, 0.05), rgba(139, 38, 53, 0.05))',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '1px solid rgba(105, 27, 25, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#691B19',
                    marginBottom: '12px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Need a Custom Package?
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '20px',
                    lineHeight: '1.5'
                  }}>
                    Get personalized consultation for your specific requirements
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #691B19, #8B2635)',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      fontFamily: 'Poppins, sans-serif',
                      height: '48px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      boxShadow: '0 6px 20px rgba(105, 27, 25, 0.25)'
                    }}
                    onClick={() => navigate(`/contact?service=${encodeURIComponent(pooja.title)}&type=pooja`)}
                  >
                    Book Custom Consultation
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>



      {/* FAQ Section */}
      {pooja.faqs && pooja.faqs.length > 0 && (
        <section style={{ 
          background: '#F9F6EE', 
          padding: '60px 20px',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: '700',
                color: '#691B19',
                marginBottom: '12px',
                fontFamily: 'Bastoni, serif'
              }}>
                Frequently Asked Questions
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#666',
                margin: 0
              }}>
                Get answers to common questions about this pooja
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pooja.faqs.map((faq, index) => (
                <div key={index} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(105, 27, 25, 0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#691B19',
                    marginBottom: '12px',
                    lineHeight: '1.4'
                  }}>
                    {faq.question}
                  </h4>
                  <p style={{
                    fontSize: '15px',
                    color: '#666',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: '700',
              color: '#691B19',
              marginBottom: '12px',
              fontFamily: 'Bastoni, serif'
            }}>
              What Our Devotees Say
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: 0
            }}>
              Real experiences from our satisfied customers
            </p>
          </div>
          
          <Row gutter={[20, 20]}>
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <Col xs={24} md={12} lg={6} key={index}>
                <div style={{
                  background: '#F9F6EE',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(105, 27, 25, 0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarOutlined key={i} style={{ color: '#FFD700', fontSize: '16px', marginRight: '2px' }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    fontStyle: 'italic',
                    flex: 1
                  }}>
                    "{testimonial.testimonial}"
                  </p>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#691B19',
                    borderTop: '1px solid rgba(105, 27, 25, 0.1)',
                    paddingTop: '12px'
                  }}>
                    {testimonial.user?.name || 'Anonymous User'}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button
              icon={<EditOutlined />}
              size="large"
              onClick={() => {
                const token = localStorage.getItem('userToken');
                if (!token) {
                  message.warning('Please login to write a review');
                  navigate('/login');
                  return;
                }
                setTestimonialModalVisible(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #691B19, #8B2635)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '600',
                height: '48px',
                paddingLeft: '24px',
                paddingRight: '24px',
                boxShadow: '0 6px 20px rgba(105, 27, 25, 0.25)'
              }}
            >
              Write a Review
            </Button>
          </div>
        </div>
      </section>
      
      <Modal
        title="Share Your Experience"
        open={testimonialModalVisible}
        onCancel={() => setTestimonialModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form 
          form={testimonialForm} 
          onFinish={async (values) => {
            try {
              await testimonialsAPI.create({
                ...values,
                service: pooja.title
              });
              message.success('Thank you! Your review has been submitted successfully.');
              setTestimonialModalVisible(false);
              testimonialForm.resetFields();
            } catch (error) {
              if (error.response?.status === 401) {
                message.error('Please login to write a review');
                navigate('/login');
              } else if (error.response?.status === 400) {
                message.error(error.response.data.message);
              } else {
                message.error('Failed to submit review');
              }
            }
          }} 
          layout="vertical"
        >
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate />
          </Form.Item>
          
          <Form.Item
            name="testimonial"
            label="Your Review"
            rules={[{ required: true, message: 'Please share your experience' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Share your experience with this pooja..."
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                background: '#691B19',
                border: 'none',
                width: '100%'
              }}
            >
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #691B19, #8B2635)',
        padding: '60px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>)',
          opacity: 0.3
        }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <h2 style={{
            fontFamily: 'Bastoni, serif',
            fontWeight: '700',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'white',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Ready to Begin Your Spiritual Journey?
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '1.6',
            maxWidth: '500px',
            margin: '0 auto 32px'
          }}>
            Connect with our experienced pandits for a personalized consultation and begin your sacred journey
          </p>
          <Button
            size="large"
            icon={<CalendarOutlined />}
            style={{
              background: '#F4E2C9',
              color: '#691B19',
              border: 'none',
              borderRadius: '16px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '600',
              fontSize: '16px',
              height: '52px',
              paddingLeft: '32px',
              paddingRight: '32px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}
            onClick={() => navigate(`/contact?service=${encodeURIComponent(pooja.title)}&type=pooja`)}
          >
            Book Consultation
          </Button>
        </div>
      </section>
    </>
  );
};

export default PoojaDetail;