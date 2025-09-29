import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, App, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { citiesAPI } from '../utils/api';

const Cities = () => {
  const { message } = App.useApp();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await citiesAPI.getAllAdmin();
      setCities(response.data.data);
    } catch (error) {
      message.error('Failed to fetch cities');
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCity) {
        await citiesAPI.update(editingCity._id, values);
        message.success('City updated successfully');
      } else {
        await citiesAPI.create(values);
        message.success('City created successfully');
      }
      setModalVisible(false);
      setEditingCity(null);
      form.resetFields();
      fetchCities();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    form.setFieldsValue(city);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await citiesAPI.delete(id);
      message.success('City deleted successfully');
      fetchCities();
    } catch (error) {
      message.error('Failed to delete city');
    }
  };

  const columns = [
    {
      title: 'City Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      sorter: (a, b) => a.state.localeCompare(b.state),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this city?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Cities Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCity(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add City
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={cities}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={editingCity ? 'Edit City' : 'Add New City'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCity(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="City Name"
            rules={[{ required: true, message: 'Please enter city name' }]}
          >
            <Input placeholder="Enter city name" />
          </Form.Item>

          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: 'Please enter state name' }]}
          >
            <Input placeholder="Enter state name" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCity ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Cities;