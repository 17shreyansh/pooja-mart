import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Form, Card, message } from 'antd';
import { frontendAPI } from '../utils/api';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined, WhatsAppOutlined } from '@ant-design/icons';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';
import image01 from '../assets/image01.png';
import ThankYouMessage from '../components/common/ThankYouMessage';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#contact-fonts')) {
  const style = document.createElement('style');
  style.id = 'contact-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const type = urlParams.get('type');
    const city = urlParams.get('city');
    
    if (service || city) {
      let subject = '';
      let message = '';
      
      if (type === 'service') {
        subject = `Inquiry about ${service} service`;
        message = `Hi, I'm interested in your ${service} service. Please contact me with more details.`;
      } else if (type === 'pooja') {
        subject = `Book ${service} pooja`;
        message = `Hi, I would like to book ${service} pooja. Please contact me to discuss the details.`;
      } else if (type === 'product') {
        subject = `Purchase ${service}`;
        message = `Hi, I'm interested in purchasing ${service}. Please contact me with pricing and availability.`;
      } else if (type === 'hero-form') {
        subject = city ? `Book ${service} pooja in ${city}` : `Book ${service} pooja`;
        message = city ? `Hi, I'm interested in ${service} pooja in ${city}. Please contact me.` : `Hi, I'm interested in ${service}. Please contact me.`;
      }
      
      form.setFieldsValue({ subject, message });
    }
    
    fetchFaqs();
  }, [form]);

  const fetchFaqs = async () => {
    try {
      const response = await frontendAPI.getFaqs();
      console.log('FAQ Response:', response.data);
      setFaqs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceType = urlParams.get('type') || 'general';
      const serviceName = urlParams.get('service') || '';
      const city = urlParams.get('city') || '';
      
      const leadData = {
        ...values,
        serviceType,
        serviceName,
        city
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });
      
      if (response.ok) {
        setShowThankYou(true);
        form.resetFields();
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThankYouMessage 
        visible={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You!"
        message="Your message has been sent successfully! Our team will get back to you within 24 hours."
        type="contact"
      />
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
            Contact Us
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#691B19',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            We're here to help you with all your spiritual needs. Reach out to us anytime.
          </p>
          
          {/* Decorative Image */}
          <img
            src={image01}
            alt="Contact Us"
            style={{ 
              maxWidth: '300px', 
              width: '100%', 
              height: 'auto',
              margin: '20px auto'
            }}
          />
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0, right: 0, margin: 0 }}
        />
      </section>



      {/* Contact Form & Info Section */}
      <section style={{ 
        background: '#fff', 
        padding: '80px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[60, 60]} align="top">
            {/* Contact Form */}
            <Col xs={24} lg={12}>
              <div style={{ background: '#F4E2C9', padding: '40px', borderRadius: '20px' }}>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#6B1E1E',
                  marginBottom: '30px',
                  fontFamily: 'Bastoni',
                  textAlign: 'center'
                }}>
                  Send us a Message
                </h3>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Row gutter={[20, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label={<span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#691B19' }}>First Name</span>}
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input
                          placeholder="Enter your first name"
                          style={{
                            borderRadius: '10px',
                            padding: '12px 15px',
                            border: '2px solid #691B19',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label={<span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#691B19' }}>Last Name</span>}
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input
                          placeholder="Enter your last name"
                          style={{
                            borderRadius: '10px',
                            padding: '12px 15px',
                            border: '2px solid #691B19',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="email"
                    label={<span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#691B19' }}>Email Address</span>}
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input
                      placeholder="Enter your email address"
                      style={{
                        borderRadius: '10px',
                        padding: '12px 15px',
                        border: '2px solid #691B19',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    label={<span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#691B19' }}>Phone Number</span>}
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input
                      placeholder="Enter your phone number"
                      style={{
                        borderRadius: '10px',
                        padding: '12px 15px',
                        border: '2px solid #691B19',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="subject"
                    label={<span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#691B19' }}>Subject</span>}
                    rules={[{ required: true, message: 'Please enter the subject' }]}
                  >
                    <Input
                      placeholder="What is this regarding?"
                      style={{
                        borderRadius: '10px',
                        padding: '12px 15px',
                        border: '2px solid #691B19',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="message"
                    label={<span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#691B19' }}>Message</span>}
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      style={{
                        borderRadius: '10px',
                        padding: '12px 15px',
                        border: '2px solid #691B19',
                        fontFamily: 'Poppins, sans-serif',
                        resize: 'vertical'
                      }}
                    />
                  </Form.Item>
                  
                  <Form.Item style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{
                        background: '#691B19',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '600',
                        padding: '12px 40px',
                        height: 'auto',
                        fontSize: '16px'
                      }}
                      size="large"
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
            
            {/* Contact Information */}
            <Col xs={24} lg={12}>
              <div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#6B1E1E',
                  marginBottom: '30px',
                  fontFamily: 'Bastoni'
                }}>
                  Visit Our Location
                </h3>
                
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
                    <EnvironmentOutlined style={{ fontSize: '24px', color: '#691B19', marginRight: '15px', marginTop: '5px' }} />
                    <div>
                      <h4 style={{ color: '#691B19', marginBottom: '5px', fontFamily: 'Poppins', fontWeight: '600' }}>Address</h4>
                      <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                        123 Temple Street,<br />
                        Sacred City, India - 110001
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
                    <PhoneOutlined style={{ fontSize: '24px', color: '#691B19', marginRight: '15px', marginTop: '5px' }} />
                    <div>
                      <h4 style={{ color: '#691B19', marginBottom: '5px', fontFamily: 'Poppins', fontWeight: '600' }}>Phone</h4>
                      <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>+91 8929255775</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
                    <MailOutlined style={{ fontSize: '24px', color: '#691B19', marginRight: '15px', marginTop: '5px' }} />
                    <div>
                      <h4 style={{ color: '#691B19', marginBottom: '5px', fontFamily: 'Poppins', fontWeight: '600' }}>Email</h4>
                      <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>info@pujamart.com</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#691B19', marginRight: '15px', marginTop: '5px' }} />
                    <div>
                      <h4 style={{ color: '#691B19', marginBottom: '5px', fontFamily: 'Poppins', fontWeight: '600' }}>Business Hours</h4>
                      <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Monday - Sunday: 6:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div style={{
                  width: '100%',
                  height: '300px',
                  background: '#F4E2C9',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #691B19'
                }}>
                  <div style={{ textAlign: 'center', color: '#691B19' }}>
                    <EnvironmentOutlined style={{ fontSize: '48px', marginBottom: '15px' }} />
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: '500' }}>Interactive Map Coming Soon</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ 
        background: '#F4E2C9', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#6B1E1E',
            marginBottom: '40px',
            fontFamily: 'Bastoni',
            textAlign: 'center'
          }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqs.length > 0 ? faqs.map((faq) => (
              <div key={faq._id} style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(105, 27, 25, 0.1)'
              }}>
                <h4 style={{ color: '#691B19', marginBottom: '12px', fontFamily: 'Poppins', fontWeight: '600', fontSize: '16px' }}>{faq.question}</h4>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{faq.answer}</p>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>Loading FAQs...</p>
              </div>
            )}
          </div>
        </div>
      </section>




    </>
  );
};

export default Contact;