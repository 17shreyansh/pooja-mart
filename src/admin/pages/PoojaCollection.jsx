import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Popconfirm, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { poojaCollectionAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const PoojaCollection = () => {
  const { message } = App.useApp();
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

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

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subtitle1', values.subtitle1);
    formData.append('subtitle2', values.subtitle2);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (editingItem) {
        await poojaCollectionAPI.update(editingItem._id, formData);
        message.success('Item updated');
      } else {
        await poojaCollectionAPI.create(formData);
        message.success('Item created');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
      setFileList([]);
      fetchItems();
    } catch (error) {
      message.error('Operation failed');
    }
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
    { title: 'Subtitle 1', dataIndex: 'subtitle1', key: 'subtitle1' },
    { title: 'Subtitle 2', dataIndex: 'subtitle2', key: 'subtitle2' },
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
            setEditingItem(record);
            form.setFieldsValue(record);
            setFileList([]);
            setModalVisible(true);
          }} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(record._id)}>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add Item
        </Button>
      </div>

      <Table columns={columns} dataSource={items} loading={loading} rowKey="_id" />

      <Modal
        title={editingItem ? 'Edit Item' : 'Add Item'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingItem(null);
          setFileList([]);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subtitle1" label="Subtitle 1" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subtitle2" label="Subtitle 2" rules={[{ required: true }]}>
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
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PoojaCollection;