import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, App } from 'antd';
import { UserOutlined, LockOutlined, CrownOutlined } from '@ant-design/icons';
import { authAPI } from '../utils/api';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        message.success('Welcome to Puja Mart Admin Panel!');
        onLogin(response.data.admin);
      } else {
        message.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6B1E1E 0%, #8B2635 50%, #A0334A 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: 450, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          border: 'none'
        }}
        styles={{ body: { padding: '40px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <CrownOutlined style={{ fontSize: '48px', color: '#6B1E1E', marginBottom: '16px' }} />
          <Title level={2} style={{ color: '#6B1E1E', marginBottom: '8px' }}>
            Puja Mart Admin
          </Title>
          <Text type="secondary">Sign in to manage your website</Text>
        </div>
        
        <Form onFinish={onFinish} size="large" layout="vertical">
          <Form.Item 
            name="email" 
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#6B1E1E' }} />} 
              placeholder="admin@pujamart.com" 
              style={{ height: '48px' }}
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#6B1E1E' }} />} 
              placeholder="Enter your password" 
              style={{ height: '48px' }}
            />
          </Form.Item>
          
          <Form.Item style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{ 
                height: '48px', 
                fontSize: '16px', 
                fontWeight: '600',
                background: '#6B1E1E',
                borderColor: '#6B1E1E'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Default: admin@pujamart.com / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;