import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, Row, Col, Switch, InputNumber, Space, App } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI } from '../utils/api';

const ServiceEditor = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await servicesAPI.getAllAdmin();
      const service = response.data.data.find(s => s._id === id);
      if (service) {
        form.setFieldsValue(service);
      }
    } catch (error) {
      message.error('Failed to fetch service');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('price', values.price);
    formData.append('isActive', values.isActive || true);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (id) {
        await servicesAPI.update(id, formData);
        message.success('Service updated successfully');
      } else {
        await servicesAPI.create(formData);
        message.success('Service created successfully');
      }
      navigate('/admin/services');
    } catch (error) {
      message.error('Operation failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/services')} />
            {id ? 'Edit Service' : 'Create New Service'}
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="title" label="Service Title" rules={[{ required: true }]}>
                <Input placeholder="Enter service title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Input placeholder="e.g., Priest Services, Decoration" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Detailed description of the service" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter price"
                  min={0}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="image" label="Service Image">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive"
                  style={{ marginTop: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {id ? 'Update Service' : 'Create Service'}
              </Button>
              <Button onClick={() => navigate('/admin/services')} size="large">
                Cancel
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ServiceEditor;