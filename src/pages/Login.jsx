import React, { useState } from 'react';
import { Form, Input, Card, message, Button } from 'antd';
import { MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthAPI } from '../utils/api';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      await userAuthAPI.login({ email: values.email });
      setEmail(values.email);
      setStep(2);
      message.success('OTP sent to your email!');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (values) => {
    setLoading(true);
    try {
      const response = await userAuthAPI.verifyLoginOTP({ email, otp: values.otp });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.success('Login successful!');
      navigate('/user/dashboard');
    } catch (error) {
      message.error(error.response?.data?.message || 'Invalid OTP');
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
              {step === 1 ? 'Welcome Back' : 'Verify Email'}
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {step === 1 ? 'Enter your email to sign in' : `Enter OTP sent to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            <Form onFinish={handleSendOTP} layout="vertical">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email Address"
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
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form onFinish={handleVerifyOTP} layout="vertical">
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please enter the OTP' },
                  { len: 6, message: 'OTP must be 6 digits' }
                ]}
              >
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="Enter 6-digit OTP"
                  size="large"
                  maxLength={6}
                  style={{
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    textAlign: 'center',
                    fontSize: '18px',
                    letterSpacing: '4px'
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
                  Verify & Sign In
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button
                  type="link"
                  onClick={() => setStep(1)}
                  style={{ color: '#691B19', fontFamily: 'Poppins, sans-serif' }}
                >
                  Change Email
                </Button>
              </div>
            </Form>
          )}

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                style={{ 
                  color: '#691B19', 
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Sign Up
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

export default Login;