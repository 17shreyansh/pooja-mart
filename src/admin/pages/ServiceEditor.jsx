import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, Row, Col, Switch, Space, App } from 'antd';
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
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('isActive', values.isActive || true);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (id) {
        await servicesAPI.update(id, formData);
        message.success('Service category updated successfully');
      } else {
        await servicesAPI.create(formData);
        message.success('Service category created successfully');
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
            {id ? 'Edit Service Category' : 'Create New Service Category'}
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Service Category Name" rules={[{ required: true }]}>
            <Input placeholder="Enter service category name" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Detailed description of the service category" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="image" label="Category Image" rules={[{ required: !id }]}>
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
            <Col span={12}>
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
                {id ? 'Update Service Category' : 'Create Service Category'}
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