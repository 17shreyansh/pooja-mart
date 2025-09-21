import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, Row, Col, Switch, Space, Select, App } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { poojasAPI, servicesAPI, poojaCollectionAPI } from '../utils/api';

const PoojaEditor = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchCollections();
    if (id) fetchPooja();
  }, [id]);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAllAdmin();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await poojaCollectionAPI.getAllAdmin();
      setCollections(response.data.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchPooja = async () => {
    try {
      const response = await poojasAPI.getAll({ id });
      const pooja = response.data.data.find(p => p._id === id);
      if (pooja) {
        form.setFieldsValue({
          ...pooja,
          services: pooja.services?.map(s => s._id || s),
          collections: pooja.collections?.map(c => c._id || c)
        });
      }
    } catch (error) {
      message.error('Failed to fetch pooja');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('services', JSON.stringify(values.services || []));
    formData.append('collections', JSON.stringify(values.collections || []));
    formData.append('isActive', values.isActive || true);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (id) {
        await poojasAPI.update(id, formData);
        message.success('Pooja updated successfully');
      } else {
        await poojasAPI.create(formData);
        message.success('Pooja created successfully');
      }
      navigate('/admin/poojas');
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
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/poojas')} />
            {id ? 'Edit Pooja' : 'Create New Pooja'}
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="Enter pooja title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Input placeholder="e.g., Festival, Special Occasion" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Detailed description of the pooja" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="services" label="Included Services">
                <Select
                  mode="multiple"
                  placeholder="Select services included in this pooja"
                  options={services.map(s => ({ label: s.title, value: s._id }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="collections" label="Included Items">
                <Select
                  mode="multiple"
                  placeholder="Select items included in this pooja"
                  options={collections.map(c => ({ label: c.title, value: c._id }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="image" label="Image">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          </Row>
          
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Update Pooja' : 'Create Pooja'}
            </Button>
            <Button onClick={() => navigate('/admin/poojas')}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default PoojaEditor;