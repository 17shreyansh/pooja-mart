import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, Tag, Card } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, DollarOutlined, ToolOutlined, StarOutlined, EditOutlined } from '@ant-design/icons';
import { frontendAPI, testimonialsAPI } from '../utils/api';
import { Form, Input, Rate, Modal, message } from 'antd';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialModalVisible, setTestimonialModalVisible] = useState(false);
  const [testimonialForm] = Form.useForm();

  useEffect(() => {
    fetchServiceDetail();
  }, [slug]);

  const fetchServiceDetail = async () => {
    try {
      const serviceResponse = await frontendAPI.getServiceBySlug(slug);
      setService(serviceResponse.data.data);
      
      // Fetch testimonials for this specific service
      const testimonialsResponse = await testimonialsAPI.getAll({ service: serviceResponse.data.data.title });
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

  if (!service) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        textAlign: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h2 style={{ color: '#691B19', marginBottom: '20px' }}>Service not found</h2>
        <Button 
          onClick={() => navigate('/services')}
          style={{
            background: '#691B19',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Back to Services
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
            onClick={() => navigate('/services')}
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
            Back to Services
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
              {service.category}
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
              {service.title}
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
              {service.description}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.95)',
              padding: '16px 32px',
              borderRadius: '50px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              border: '1px solid rgba(105, 27, 25, 0.2)'
            }}>
              <DollarOutlined style={{ color: '#691B19', fontSize: '24px', marginRight: '12px' }} />
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#691B19',
                fontFamily: 'Poppins, sans-serif'
              }}>
                ₹{service.price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Service Details Section */}
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
                  src={service.image ? `${import.meta.env.VITE_API_BASE_URL}${service.image}` : '/placeholder.jpg'}
                  alt={service.title}
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    objectFit: 'cover',
                    aspectRatio: '4/3'
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
                  About This Service
                </h2>
                
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.8',
                  marginBottom: '32px'
                }}>
                  {service.description}
                </p>

                <Card
                  style={{
                    borderRadius: '16px',
                    border: '1px solid rgba(105, 27, 25, 0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <ToolOutlined style={{ color: '#691B19', fontSize: '20px', marginRight: '12px' }} />
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#691B19',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Service Details
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Category</p>
                      <p style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: '500' }}>{service.category}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Price</p>
                      <p style={{ margin: 0, color: '#691B19', fontSize: '20px', fontWeight: '700' }}>
                        ₹{service.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        background: '#F9F6EE', 
        padding: '80px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 42px)',
            fontWeight: '700',
            color: '#691B19',
            marginBottom: '16px',
            fontFamily: 'Bastoni, serif'
          }}>
            Why Choose Our Service?
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto 60px',
            lineHeight: '1.6'
          }}>
            Experience authentic spiritual services with our experienced pandits and traditional practices
          </p>
          
          <Row gutter={[32, 32]}>
            {[
              { title: 'Experienced Pandits', desc: 'Certified and experienced spiritual guides' },
              { title: 'Authentic Rituals', desc: 'Traditional practices following ancient scriptures' },
              { title: 'Personalized Service', desc: 'Customized according to your specific needs' }
            ].map((feature, index) => (
              <Col xs={24} sm={8} key={index}>
                <div style={{
                  background: '#fff',
                  padding: '32px 24px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  height: '100%',
                  border: '1px solid rgba(105, 27, 25, 0.1)'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #691B19, #8B2635)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <ToolOutlined style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#691B19',
                    marginBottom: '12px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {feature.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
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
              {service.faqs.map((faq, index) => (
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
            Customer Reviews
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
                service: service.title
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
              placeholder="Share your experience with this service..."
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
            Ready to Book This Service?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '1.6'
          }}>
            Get in touch with us to schedule your personalized spiritual service
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
            onClick={() => navigate(`/contact?service=${encodeURIComponent(service.title)}&type=service`)}
          >
            Book Service Now
          </Button>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;