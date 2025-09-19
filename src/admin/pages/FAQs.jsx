import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Switch, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminAPI } from '../utils/api';

const { TextArea } = Input;

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.get('/faqs/admin');
      setFaqs(response.data.data);
    } catch (error) {
      message.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFaq(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    form.setFieldsValue(faq);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingFaq) {
        await adminAPI.put(`/faqs/${editingFaq._id}`, values);
        message.success('FAQ updated successfully');
      } else {
        await adminAPI.post('/faqs', values);
        message.success('FAQ created successfully');
      }
      setIsModalVisible(false);
      fetchFaqs();
    } catch (error) {
      message.error('Failed to save FAQ');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.delete(`/faqs/${id}`);
      message.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (error) {
      message.error('Failed to delete FAQ');
    }
  };

  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
      render: (text) => text.length > 100 ? `${text.substring(0, 100)}...` : text
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
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
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="FAQ Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add FAQ
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={faqs}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true, order: 0 }}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter the question' }]}
          >
            <Input placeholder="Enter FAQ question" />
          </Form.Item>

          <Form.Item
            name="answer"
            label="Answer"
            rules={[{ required: true, message: 'Please enter the answer' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter FAQ answer"
            />
          </Form.Item>

          <Form.Item
            name="order"
            label="Display Order"
            rules={[{ required: true, message: 'Please enter display order' }]}
          >
            <Input type="number" placeholder="0" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingFaq ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FAQs;