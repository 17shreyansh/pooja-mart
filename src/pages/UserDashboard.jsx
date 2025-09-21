import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, message, Modal, Rate } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAuthAPI, testimonialsAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [testimonialModalVisible, setTestimonialModalVisible] = useState(false);
  const navigate = useNavigate();
  const [passwordForm] = Form.useForm();
  const [testimonialForm] = Form.useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    message.success('Logged out successfully');
    navigate('/');
  };

  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      await userAuthAPI.changePassword(values);
      message.success('Password changed successfully');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  const handleTestimonialSubmit = async (values) => {
    setLoading(true);
    try {
      await testimonialsAPI.create({
        ...values,
        author: user.name
      });
      message.success('Testimonial submitted for review');
      setTestimonialModalVisible(false);
      testimonialForm.resetFields();
    } catch (error) {
      message.error('Failed to submit testimonial');
    }
    setLoading(false);
  };

  if (!user) return null;

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
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <h1 style={{
              fontSize: 'clamp(36px, 8vw, 56px)',
              fontWeight: '700',
              color: '#691B19',
              marginBottom: '24px',
              fontFamily: 'Bastoni, serif',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Welcome, {user.name}
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
              Manage your account and share your spiritual experiences
            </p>
          </div>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Dashboard Content */}
      <section style={{ 
        background: '#fff', 
        padding: '80px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            
            {/* Profile Card */}
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(105, 27, 25, 0.1)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #691B19, #8B2635)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <UserOutlined style={{ color: 'white', fontSize: '32px' }} />
                </div>
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#691B19',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Profile Information
                </h3>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#691B19' }}>Name:</strong> {user.name}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#691B19' }}>Email:</strong> {user.email}
              </div>
              <div style={{ marginBottom: '24px' }}>
                <strong style={{ color: '#691B19' }}>Phone:</strong> {user.phone || 'Not provided'}
              </div>
              
              <Button
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #691B19, #8B2635)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500',
                  marginBottom: '12px'
                }}
              >
                Change Password
              </Button>
              
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #691B19',
                  borderRadius: '8px',
                  color: '#691B19',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}
              >
                Logout
              </Button>
            </Card>

            {/* Testimonial Card */}
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(105, 27, 25, 0.1)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #691B19, #8B2635)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <StarOutlined style={{ color: 'white', fontSize: '32px' }} />
                </div>
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#691B19',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Share Your Experience
                </h3>
                
                <p style={{
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  Help others by sharing your spiritual journey and experiences with our services
                </p>
              </div>
              
              <Button
                icon={<StarOutlined />}
                onClick={() => setTestimonialModalVisible(true)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #691B19, #8B2635)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500'
                }}
              >
                Write Testimonial
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form form={passwordForm} onFinish={handlePasswordChange} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                background: '#691B19',
                border: 'none',
                width: '100%'
              }}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Testimonial Modal */}
      <Modal
        title="Write Testimonial"
        open={testimonialModalVisible}
        onCancel={() => setTestimonialModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={testimonialForm} onFinish={handleTestimonialSubmit} layout="vertical">
          <Form.Item
            name="service"
            label="Service/Pooja"
            rules={[{ required: true, message: 'Please enter the service name' }]}
          >
            <Input placeholder="Which service or pooja did you experience?" />
          </Form.Item>
          
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate />
          </Form.Item>
          
          <Form.Item
            name="testimonial"
            label="Your Experience"
            rules={[{ required: true, message: 'Please share your experience' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Share your spiritual experience and how it helped you..."
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                background: '#691B19',
                border: 'none',
                width: '100%'
              }}
            >
              Submit Testimonial
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserDashboard;