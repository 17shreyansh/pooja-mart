import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Spin } from 'antd';
import { ToolOutlined, StarOutlined, ShoppingOutlined, MessageOutlined, TrophyOutlined } from '@ant-design/icons';
import { dashboardAPI } from '../utils/api';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Services',
      value: stats.services || 0,
      icon: <ToolOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
      borderColor: '#b7eb8f'
    },
    {
      title: 'Featured Poojas',
      value: stats.poojas || 0,
      icon: <StarOutlined />,
      color: '#fa8c16',
      bgColor: '#fff7e6',
      borderColor: '#ffd591'
    },
    {
      title: 'Collection Items',
      value: stats.collection || 0,
      icon: <ShoppingOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials || 0,
      icon: <MessageOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff',
      borderColor: '#d3adf7'
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <TrophyOutlined style={{ fontSize: '24px', color: '#6B1E1E' }} />
          <Title level={2} style={{ margin: 0, color: '#6B1E1E' }}>
            Dashboard Overview
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Welcome to your Puja Mart admin panel. Here's your content summary.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {statsCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: card.bgColor,
                border: `1px solid ${card.borderColor}`,
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Statistic
                title={
                  <Text strong style={{ color: '#666', fontSize: '14px' }}>
                    {card.title}
                  </Text>
                }
                value={card.value}
                prefix={
                  <div style={{
                    background: card.color,
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'inline-flex',
                    marginRight: '12px'
                  }}>
                    {React.cloneElement(card.icon, { style: { color: 'white', fontSize: '20px' } })}
                  </div>
                }
                valueStyle={{ 
                  color: card.color, 
                  fontSize: '28px', 
                  fontWeight: 'bold' 
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        style={{ 
          marginTop: 32, 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6B1E1E 0%, #8B2635 100%)',
          border: 'none'
        }}
        styles={{ body: { padding: '32px', textAlign: 'center' } }}
      >
        <Title level={3} style={{ color: 'white', marginBottom: 16 }}>
          🕉️ Manage Your Spiritual Services
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
          Use the sidebar navigation to manage services, poojas, collection items, and testimonials.
        </Text>
      </Card>
    </div>
  );
};

export default Dashboard;