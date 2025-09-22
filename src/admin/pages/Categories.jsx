import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, App, Card, Form, Input, Upload, Switch, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { adminAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const Categories = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.get('/categories/admin');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('isActive', values.isActive || true);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (editingCategory) {
        await adminAPI.put(`/categories/${editingCategory._id}`, formData);
        message.success('Category updated successfully');
      } else {
        await adminAPI.post('/categories', formData);
        message.success('Category created successfully');
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setFileList([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.delete(`/categories/${id}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Error deleting category');
    }
  };

  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setEditingCategory(null);
    setShowModal(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description',
      render: (text) => text ? text.substring(0, 50) + '...' : 'No description'
    },
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
      render: (image) => image ? <img src={`${API_BASE_URL}/uploads/${image}`} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : 'No image'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Categories Management" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          Add Category
        </Button>
      }>
        <Table columns={columns} dataSource={categories} loading={loading} rowKey="_id" />
      </Card>

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={showModal}
        onCancel={resetForm}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>
          
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter category description" />
          </Form.Item>
          
          <Form.Item label="Image" rules={[{ required: !editingCategory }]}>
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
          
          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <div style={{ textAlign: 'right' }}>
            <Button onClick={resetForm} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;