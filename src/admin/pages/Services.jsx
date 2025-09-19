import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Popconfirm, App, Switch, Select, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { servicesAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const Services = () => {
  const { message } = App.useApp();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '' });

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAllAdmin(filters);
      setServices(response.data.data);
      setCategories(response.data.categories || []);
    } catch (error) {
      message.error('Failed to fetch services');
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    formData.append('category', values.category);
    formData.append('isActive', values.isActive || true);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, formData);
        message.success('Service updated');
      } else {
        await servicesAPI.create(formData);
        message.success('Service created');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingService(null);
      setFileList([]);
      fetchServices();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await servicesAPI.delete(id);
      message.success('Service deleted');
      fetchServices();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Subtitle', dataIndex: 'subtitle', key: 'subtitle' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive) => isActive ? 'Active' : 'Inactive'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <img src={`${API_BASE_URL}${image}`} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : 'No image'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingService(record);
            form.setFieldsValue(record);
            setFileList([]);
            setModalVisible(true);
          }} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this service?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Services Management" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add Service
        </Button>
      }>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Input.Search
            placeholder="Search services..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by category"
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value })}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map(cat => (
              <Select.Option key={cat} value={cat}>{cat}</Select.Option>
            ))}
          </Select>
        </div>
        
        <Table columns={columns} dataSource={services} loading={loading} rowKey="_id" />
      </Card>

      <Modal
        title={editingService ? 'Edit Service' : 'Add Service'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingService(null);
          setFileList([]);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subtitle" label="Subtitle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input placeholder="e.g., Wedding, Festival, Daily Worship" />
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingService ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;