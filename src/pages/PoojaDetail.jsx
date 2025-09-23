import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, StarOutlined, EditOutlined } from '@ant-design/icons';
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

  useEffect(() => {
    fetchPoojaDetail();
  }, [slug]);

  const fetchPoojaDetail = async () => {
    try {
      const poojaResponse = await frontendAPI.getPoojaBySlug(slug);
      setPooja(poojaResponse.data.data);
      
      // Fetch testimonials for this specific pooja
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
            onClick={() => navigate('/poojas')}
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
            Back to Poojas
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
              {pooja.category?.name || pooja.category}
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
              {pooja.title}
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: '#691B19',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.7',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '400',
              opacity: '0.9'
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

      {/* Pooja Image Section */}
      <section style={{ 
        background: '#fff', 
        padding: '80px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <img
            src={pooja.image ? `${import.meta.env.VITE_API_BASE_URL}${pooja.image}` : '/placeholder.jpg'}
            alt={pooja.title}
            style={{
              width: '100%',
              maxWidth: '700px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              objectFit: 'cover',
              aspectRatio: '16/10'
            }}
          />
        </div>
      </section>

      {/* Services & Items Section */}
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
              What's Included
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              This pooja includes the following services and sacred items
            </p>
          </div>

          <Row gutter={[48, 48]}>
            {/* Services */}
            {pooja.services && pooja.services.length > 0 && (
              <Col xs={24} lg={12}>
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(105, 27, 25, 0.1)',
                  height: '100%'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #691B19, #8B2635)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <StarOutlined style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#691B19',
                    marginBottom: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    textAlign: 'center'
                  }}>
                    Included Services
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pooja.services.map((service, idx) => (
                      <div key={idx} style={{
                        background: '#F9F6EE',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(105, 27, 25, 0.1)'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#691B19',
                          margin: '0 0 8px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          {service.title}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: 0,
                          lineHeight: '1.5'
                        }}>
                          {service.description}
                        </p>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#691B19',
                          marginTop: '8px'
                        }}>
                          ₹{service.price?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            )}

            {/* Collections */}
            {pooja.collections && pooja.collections.length > 0 && (
              <Col xs={24} lg={12}>
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(105, 27, 25, 0.1)',
                  height: '100%'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #691B19, #8B2635)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <StarOutlined style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#691B19',
                    marginBottom: '20px',
                    fontFamily: 'Poppins, sans-serif',
                    textAlign: 'center'
                  }}>
                    Sacred Items
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pooja.collections.map((collection, idx) => (
                      <div key={idx} style={{
                        background: '#F9F6EE',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(105, 27, 25, 0.1)'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#691B19',
                          margin: '0 0 8px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          {collection.title}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: 0,
                          lineHeight: '1.5'
                        }}>
                          {collection.description}
                        </p>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#691B19',
                          marginTop: '8px'
                        }}>
                          ₹{collection.price?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            )}
          </Row>

          {/* Book Button */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Button
              type="primary"
              size="large"
              icon={<CalendarOutlined />}
              style={{
                background: 'linear-gradient(135deg, #691B19, #8B2635)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 40px',
                height: 'auto',
                fontWeight: '600',
                fontSize: '18px',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 8px 24px rgba(105, 27, 25, 0.3)'
              }}
              onClick={() => navigate(`/contact?service=${encodeURIComponent(pooja.title)}&type=pooja`)}
            >
              Book This Pooja
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {pooja.faqs && pooja.faqs.length > 0 && (
        <section style={{ 
          background: '#fff', 
          padding: '80px 20px',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 6vw, 42px)',
              fontWeight: '700',
              color: '#691B19',
              marginBottom: '40px',
              fontFamily: 'Bastoni, serif',
              textAlign: 'center'
            }}>
              Frequently Asked Questions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pooja.faqs.map((faq, index) => (
                <div key={index} style={{
                  background: '#F9F6EE',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(105, 27, 25, 0.1)'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#691B19',
                    marginBottom: '8px'
                  }}>
                    {faq.question}
                  </h4>
                  <p style={{
                    fontSize: '14px',
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
        background: '#F9F6EE', 
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
            What Our Devotees Say
          </h2>
          
          <Row gutter={[24, 24]}>
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <Col xs={24} md={12} key={index}>
                <div style={{
                  background: '#fff',
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
                    "{testimonial.testimonial}"
                  </p>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#691B19'
                  }}>
                    - {testimonial.user?.name || 'User'}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button
              icon={<EditOutlined />}
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
                background: '#691B19',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500'
              }}
            >
              Write a Review
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonial Modal */}
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
            Ready to Begin Your Spiritual Journey?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '1.6'
          }}>
            Connect with our experienced pandits for a personalized consultation
          </p>
          <Button
            size="large"
            icon={<CalendarOutlined />}
            style={{
              background: '#F4E2C9',
              color: '#691B19',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '600',
              padding: '16px 40px',
              fontSize: '18px',
              height: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
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