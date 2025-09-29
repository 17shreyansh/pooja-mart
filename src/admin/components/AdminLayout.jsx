import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  ToolOutlined, 
  StarOutlined, 
  ShoppingOutlined, 
  MessageOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  ContactsOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  MailOutlined
} from '@ant-design/icons';
import '../styles/AdminLayout.css';

const { Text } = Typography;

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children, onLogout, admin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path.includes('/services')) return 'services';
    if (path.includes('/poojas')) return 'poojas';
    if (path.includes('/collections')) return 'collections';
    if (path.includes('/cities')) return 'cities';
    if (path.includes('/offers')) return 'offers';
    if (path.includes('/user-testimonials')) return 'user-testimonials';
    if (path.includes('/testimonials')) return 'testimonials';
    if (path.includes('/leads')) return 'leads';
    if (path.includes('/faqs')) return 'faqs';
    if (path.includes('/pages')) return 'pages';
    if (path.includes('/home-page')) return 'home-page';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/newsletter')) return 'newsletter';
    return 'dashboard';
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'leads', icon: <ContactsOutlined />, label: 'Leads' },
    { key: 'services', icon: <ToolOutlined />, label: 'Service Categories' },
    { key: 'poojas', icon: <StarOutlined />, label: 'Poojas' },
    { key: 'collections', icon: <ShoppingOutlined />, label: 'Collections' },
    { key: 'cities', icon: <ContactsOutlined />, label: 'Cities' },
    { key: 'offers', icon: <StarOutlined />, label: 'Festive Offers' },
    { key: 'testimonials', icon: <MessageOutlined />, label: 'Testimonials' },
    { key: 'user-testimonials', icon: <UserOutlined />, label: 'User Reviews' },
    { key: 'faqs', icon: <QuestionCircleOutlined />, label: 'FAQs' },
    { key: 'pages', icon: <FileTextOutlined />, label: 'Pages' },
    { key: 'home-page', icon: <SettingOutlined />, label: 'Home Page Edit' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { key: 'newsletter', icon: <MailOutlined />, label: 'Newsletter' },
  ];
  
  const handleMenuClick = ({ key }) => {
    navigate(`/admin/${key}`);
  };

  return (
    <div className="admin-layout">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          theme="dark"
          breakpoint="lg"
          collapsedWidth={isMobile ? 0 : 80}
          width={250}
          style={{
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 1000,
            overflow: 'auto'
          }}
        >
        <div style={{ 
          height: 64, 
          margin: '16px', 
          background: 'linear-gradient(135deg, #6B1E1E, #8B2635)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: collapsed ? '16px' : '18px',
          boxShadow: '0 4px 12px rgba(107, 30, 30, 0.3)'
        }}>
          {collapsed ? '🕉️' : '🕉️ Puja Mart'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
        <Layout style={{ 
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), 
          transition: 'margin-left 0.2s' 
        }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Dropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: 'Profile',
                },
                {
                  key: 'settings',
                  icon: <SettingOutlined />,
                  label: 'Settings',
                },
                {
                  type: 'divider',
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: onLogout,
                  danger: true
                }
              ]
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', minWidth: '120px' }}>
              <Avatar 
                style={{ backgroundColor: '#6B1E1E' }} 
                icon={<UserOutlined />} 
                size="small"
              />
              <div style={{ display: collapsed ? 'none' : 'block' }}>
                <Text strong style={{ fontSize: '14px', display: 'block', lineHeight: '1.2' }}>
                  {admin?.name || 'Admin'}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', lineHeight: '1.2' }}>
                  {admin?.email?.split('@')[0] || 'admin'}
                </Text>
              </div>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: 0, 
          padding: '32px', 
          background: '#fff',
          minHeight: '100vh'
        }}>
          {children}
        </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;