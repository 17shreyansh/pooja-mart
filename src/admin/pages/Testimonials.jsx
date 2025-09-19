import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { testimonialsAPI } from '../utils/api';

const { TextArea } = Input;

const Testimonials = () => {
  const { message } = App.useApp();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data.data);
    } catch (error) {
      message.error('Failed to fetch testimonials');
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTestimonial) {
        await testimonialsAPI.update(editingTestimonial._id, values);
        message.success('Testimonial updated');
      } else {
        await testimonialsAPI.create(values);
        message.success('Testimonial created');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await testimonialsAPI.delete(id);
      message.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const columns = [
    { 
      title: 'Testimonial', 
      dataIndex: 'testimonial', 
      key: 'testimonial',
      render: (text) => text.length > 100 ? `${text.substring(0, 100)}...` : text
    },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingTestimonial(record);
            form.setFieldsValue(record);
            setModalVisible(true);
          }} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this testimonial?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Testimonials</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add Testimonial
        </Button>
      </div>

      <Table columns={columns} dataSource={testimonials} loading={loading} rowKey="_id" />

      <Modal
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingTestimonial(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="testimonial" label="Testimonial" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTestimonial ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Testimonials;