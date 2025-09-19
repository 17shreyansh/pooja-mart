import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { poojasAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const Poojas = () => {
  const { message } = App.useApp();
  const [poojas, setPoojas] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPooja, setEditingPooja] = useState(null);
  const [form] = Form.useForm();

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

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (editingPooja) {
        await poojasAPI.update(editingPooja._id, formData);
        message.success('Pooja updated');
      } else {
        await poojasAPI.create(formData);
        message.success('Pooja created');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingPooja(null);
      setFileList([]);
      fetchPoojas();
    } catch (error) {
      message.error('Operation failed');
    }
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
    { title: 'Subtitle', dataIndex: 'subtitle', key: 'subtitle' },
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
            setEditingPooja(record);
            form.setFieldsValue(record);
            setFileList([]);
            setModalVisible(true);
          }} style={{ marginRight: 8 }} />
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add Pooja
        </Button>
      </div>

      <Table columns={columns} dataSource={poojas} loading={loading} rowKey="_id" />

      <Modal
        title={editingPooja ? 'Edit Pooja' : 'Add Pooja'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingPooja(null);
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
              {editingPooja ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Poojas;