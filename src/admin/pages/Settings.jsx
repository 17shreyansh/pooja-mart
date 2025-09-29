import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Divider } from 'antd';
import { SaveOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { adminAPI } from '../utils/api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.get('/settings/whatsapp');
      if (response.data.success && response.data.data) {
        form.setFieldsValue({ whatsappNumber: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await adminAPI.put('/settings/whatsapp', values);
      message.success('WhatsApp settings updated successfully');
    } catch (error) {
      message.error('Error updating WhatsApp settings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Settings</h1>
      
      <Card title={<><WhatsAppOutlined style={{ marginRight: '8px' }} />WhatsApp Configuration</>}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="WhatsApp Number"
            name="whatsappNumber"
            rules={[
              { required: true, message: 'Please enter WhatsApp number' },
              { pattern: /^\d{10,15}$/, message: 'Please enter a valid phone number (10-15 digits)' }
            ]}
            help="Enter the WhatsApp number without country code prefix (e.g., 9876543210)"
          >
            <Input 
              placeholder="Enter WhatsApp number" 
              prefix="+91"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Divider />
          
          <div style={{ marginBottom: '16px' }}>
            <h4>How it works:</h4>
            <ul style={{ color: '#666', fontSize: '14px' }}>
              <li>This number will be used for the "Inquiry" button on all cards</li>
              <li>When users click the inquiry button, they'll be redirected to WhatsApp</li>
              <li>A pre-filled message will be sent with service details</li>
              <li>Make sure this number has WhatsApp enabled</li>
            </ul>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              Save WhatsApp Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;