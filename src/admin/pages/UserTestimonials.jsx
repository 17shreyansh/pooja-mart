import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Rate, Modal, message, Card, Statistic } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { testimonialsAPI } from '../utils/api';

const UserTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await testimonialsAPI.getAllAdmin();
      setTestimonials(response.data.data);
    } catch (error) {
      message.error('Failed to fetch testimonials');
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await testimonialsAPI.update(id, { isApproved: true });
      message.success('Testimonial approved');
      fetchTestimonials();
    } catch (error) {
      message.error('Failed to approve testimonial');
    }
  };

  const handleReject = async (id) => {
    try {
      await testimonialsAPI.update(id, { isApproved: false });
      message.success('Testimonial rejected');
      fetchTestimonials();
    } catch (error) {
      message.error('Failed to reject testimonial');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Delete Testimonial',
      content: 'Are you sure you want to delete this testimonial?',
      onOk: async () => {
        try {
          await testimonialsAPI.delete(id);
          message.success('Testimonial deleted');
          fetchTestimonials();
        } catch (error) {
          message.error('Failed to delete testimonial');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.user?.email}
          </div>
        </div>
      )
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service'
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled value={rating} style={{ fontSize: '14px' }} />
    },
    {
      title: 'Testimonial',
      dataIndex: 'testimonial',
      key: 'testimonial',
      render: (text) => (
        <div style={{ maxWidth: '200px' }}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (isApproved) => (
        <Tag color={isApproved ? 'green' : 'orange'}>
          {isApproved ? 'Approved' : 'Pending'}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedTestimonial(record);
              setViewModalVisible(true);
            }}
          />
          {!record.isApproved && (
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              onClick={() => handleApprove(record._id)}
            />
          )}
          {record.isApproved && (
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={() => handleReject(record._id)}
            />
          )}
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      )
    }
  ];

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter(t => t.isApproved).length,
    pending: testimonials.filter(t => !t.isApproved).length,
    avgRating: testimonials.length > 0 
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : 0
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>User Testimonials</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card>
            <Statistic title="Total Testimonials" value={stats.total} />
          </Card>
          <Card>
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
          </Card>
          <Card>
            <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
          <Card>
            <Statistic title="Average Rating" value={stats.avgRating} suffix="/ 5" />
          </Card>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={testimonials}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} testimonials`
        }}
      />

      <Modal
        title="Testimonial Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTestimonial && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Author:</strong> {selectedTestimonial.author}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Email:</strong> {selectedTestimonial.user?.email}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Service:</strong> {selectedTestimonial.service}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Rating:</strong> <Rate disabled value={selectedTestimonial.rating} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Status:</strong>{' '}
              <Tag color={selectedTestimonial.isApproved ? 'green' : 'orange'}>
                {selectedTestimonial.isApproved ? 'Approved' : 'Pending'}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Date:</strong> {new Date(selectedTestimonial.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Testimonial:</strong>
              <div style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '6px', 
                marginTop: '8px',
                lineHeight: '1.6'
              }}>
                {selectedTestimonial.testimonial}
              </div>
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {!selectedTestimonial.isApproved && (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    handleApprove(selectedTestimonial._id);
                    setViewModalVisible(false);
                  }}
                >
                  Approve
                </Button>
              )}
              {selectedTestimonial.isApproved && (
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    handleReject(selectedTestimonial._id);
                    setViewModalVisible(false);
                  }}
                >
                  Reject
                </Button>
              )}
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  handleDelete(selectedTestimonial._id);
                  setViewModalVisible(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserTestimonials;