import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Switch, Space, message, Popconfirm, Tag } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminAPI } from '../utils/api';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });

  useEffect(() => {
    fetchSubscribers();
  }, [pagination.current, pagination.pageSize]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.get('/newsletter', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize
        }
      });
      setSubscribers(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }));
    } catch (error) {
      message.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      await adminAPI.put(`/newsletter/${id}`, { isActive });
      message.success('Subscriber status updated');
      fetchSubscribers();
    } catch (error) {
      message.error('Failed to update subscriber status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.delete(`/newsletter/${id}`);
      message.success('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error) {
      message.error('Failed to delete subscriber');
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.get('/newsletter/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'newsletter-subscribers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      message.success('Subscribers exported successfully');
    } catch (error) {
      message.error('Failed to export subscribers');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true
    },
    {
      title: 'Subscribed Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(record._id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      )
    }
  ];

  const handleTableChange = (paginationConfig) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: pagination.total
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Newsletter Subscribers"
        extra={
          <Space>
            <Tag color="blue">Total: {pagination.total}</Tag>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={subscribers}
          loading={loading}
          rowKey="_id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} subscribers`
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Newsletter;