import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { poojasAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const Poojas = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPoojas();
  }, []);

  const fetchPoojas = async () => {
    setLoading(true);
    try {
      const response = await poojasAPI.getAll();
      setPoojas(response.data.data);
    } catch (error) {
      message.error('Failed to fetch poojas');
    }
    setLoading(false);
  };



  const handleDelete = async (id) => {
    try {
      await poojasAPI.delete(id);
      message.success('Pooja deleted');
      fetchPoojas();
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
    { 
      title: 'Service Category', 
      dataIndex: 'service', 
      key: 'service',
      render: (service) => service?.name || 'No service'
    },
    {
      title: 'Packages',
      dataIndex: 'packages',
      key: 'packages',
      render: (packages) => packages ? packages.length : 0
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
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/poojas/edit/${record._id}`)} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this pooja?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Poojas</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/poojas/new')}>
          Add Pooja
        </Button>
      </div>

      <Table columns={columns} dataSource={poojas} loading={loading} rowKey="_id" />


    </div>
  );
};

export default Poojas;