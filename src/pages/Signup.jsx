import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const response = await userAuthAPI.register(values);
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.success('Account created successfully!');
      navigate('/user/dashboard');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

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
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: 'none'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#691B19',
              marginBottom: '8px',
              fontFamily: 'Bastoni, serif'
            }}>
              Create Account
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Join our spiritual community
            </p>
          </div>

          <Form onFinish={handleSignup} layout="vertical">
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                size="large"
                style={{
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
                style={{
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Phone Number"
                size="large"
                style={{
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                style={{
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
                style={{
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #691B19, #8B2635)',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  fontSize: '16px',
                  height: '48px'
                }}
              >
                Create Account
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#691B19', 
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  Sign In
                </Link>
              </span>
            </div>
          </Form>
        </Card>

        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>
    </>
  );
};

export default Signup;