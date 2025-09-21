import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, App, Select, Card, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const Services = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
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
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description',
      render: (text) => text ? text.substring(0, 50) + '...' : 'No description'
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => price ? `₹${price}` : 'N/A'
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
      render: (image) => image ? <img src={`${API_BASE_URL}${image}`} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : 'No image'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/services/edit/${record._id}`)} style={{ marginRight: 8 }} />
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/services/new')}>
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


    </div>
  );
};

export default Services;