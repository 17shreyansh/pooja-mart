import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Tabs, Space, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { adminAPI } from '../utils/api';

const { TextArea } = Input;
const { TabPane } = Tabs;

const HomePageEditor = () => {
  const [loading, setLoading] = useState(false);
  const [heroForm] = Form.useForm();
  const [howItWorksForm] = Form.useForm();

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      const response = await adminAPI.get('/home-page');
      const { hero, howItWorks } = response.data.data;
      
      if (hero) heroForm.setFieldsValue(hero);
      if (howItWorks) howItWorksForm.setFieldsValue(howItWorks);
    } catch (error) {
      console.error('Error fetching home page data:', error);
    }
  };

  const handleSave = async (section, values) => {
    setLoading(true);
    try {
      await adminAPI.put(`/home-page/${section}`, { content: values });
      message.success(`${section} section updated successfully`);
    } catch (error) {
      message.error(`Error updating ${section} section`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Home Page Editor</h1>
      
      <Tabs defaultActiveKey="hero">
        <TabPane tab="Hero Section" key="hero">
          <Card>
            <Form
              form={heroForm}
              layout="vertical"
              onFinish={(values) => handleSave('hero', values)}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter title' }]}
              >
                <Input placeholder="Enter hero title" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea rows={3} placeholder="Enter hero description" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Save Hero Section
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="How It Works" key="howItWorks">
          <Card>
            <Form
              form={howItWorksForm}
              layout="vertical"
              onFinish={(values) => handleSave('howItWorks', values)}
            >
              <Form.Item
                label="Section Heading"
                name="heading"
                rules={[{ required: true, message: 'Please enter heading' }]}
              >
                <Input placeholder="Enter section heading" />
              </Form.Item>

              <Divider>Steps (Images are static, only text is editable)</Divider>
              
              {[0, 1, 2, 3].map((index) => (
                <Card key={index} size="small" style={{ marginBottom: 16 }}>
                  <h4>Step {index + 1}</h4>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      label="Number"
                      name={['steps', index, 'number']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder={`0${index + 1}`} />
                    </Form.Item>
                    
                    <Form.Item
                      label="Title"
                      name={['steps', index, 'title']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter step title" />
                    </Form.Item>
                    
                    <Form.Item
                      label="Description"
                      name={['steps', index, 'description']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter step description" />
                    </Form.Item>
                  </Space>
                </Card>
              ))}

              <Divider>Action Buttons</Divider>
              
              {[0, 1, 2, 3].map((index) => (
                <Form.Item
                  key={index}
                  label={`Button ${index + 1}`}
                  name={['buttons', index]}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={`Enter button ${index + 1} text`} />
                </Form.Item>
              ))}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Save How It Works Section
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HomePageEditor;