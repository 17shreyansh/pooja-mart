import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { poojaCollectionAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const PoojaCollection = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await poojaCollectionAPI.getAll();
      setItems(response.data.data);
    } catch (error) {
      message.error('Failed to fetch items');
    }
    setLoading(false);
  };



  const handleDelete = async (id) => {
    try {
      await poojaCollectionAPI.delete(id);
      message.success('Item deleted');
      fetchItems();
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
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => stock || 0
    },

    {
      title: 'Attributes',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (attributes) => attributes ? attributes.length : 0
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
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/collections/edit/${record._id}`)} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this collection?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Pooja Collection</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/collections/new')}>
          Add Collection
        </Button>
      </div>

      <Table columns={columns} dataSource={items} loading={loading} rowKey="_id" />


    </div>
  );
};

export default PoojaCollection;