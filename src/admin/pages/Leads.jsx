import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Modal, Form, Input, Select, Space, Statistic, Row, Col, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { leadsAPI } from '../utils/api';

const { Option } = Select;
const { TextArea } = Input;

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [filters]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadsAPI.getAll(filters);
      setLeads(response.data.data);
    } catch (error) {
      message.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await leadsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
    setIsViewModalVisible(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    form.setFieldsValue({
      status: lead.status,
      priority: lead.priority,
      notes: lead.notes
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await leadsAPI.update(selectedLead._id, values);
      message.success('Lead updated successfully');
      setIsModalVisible(false);
      fetchLeads();
      fetchStats();
    } catch (error) {
      message.error('Failed to update lead');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await leadsAPI.delete(id);
          message.success('Lead deleted successfully');
          fetchLeads();
          fetchStats();
        } catch (error) {
          message.error('Failed to delete lead');
        }
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'blue',
      contacted: 'orange',
      qualified: 'purple',
      converted: 'green',
      closed: 'red'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'green',
      medium: 'orange',
      high: 'red'
    };
    return colors[priority] || 'default';
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: true
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            <a href={`tel:${record.phone}`}>{record.phone}</a>
          </Space>
          <Space>
            <MailOutlined />
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </Space>
        </Space>
      )
    },
    {
      title: 'Service',
      key: 'service',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{record.serviceType}</Tag>
          {record.serviceName && <span>{record.serviceName}</span>}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Contacted', value: 'contacted' },
        { text: 'Qualified', value: 'qualified' },
        { text: 'Converted', value: 'converted' },
        { text: 'Closed', value: 'closed' }
      ]
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          />
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Leads" value={stats.totalLeads || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="New Leads" value={stats.newLeads || 0} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Qualified" value={stats.qualifiedLeads || 0} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Conversion Rate" 
              value={stats.conversionRate || 0} 
              suffix="%" 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
      </Row>

      <Card title="Leads Management">
        <Table
          columns={columns}
          dataSource={leads}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            onChange: (page, pageSize) => {
              setFilters({ ...filters, page, limit: pageSize });
            }
          }}
        />
      </Card>

      <Modal
        title="Lead Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedLead && (
          <div style={{ padding: '16px 0' }}>
            <p><strong>Name:</strong> {selectedLead.firstName} {selectedLead.lastName}</p>
            <p><strong>Email:</strong> {selectedLead.email}</p>
            <p><strong>Phone:</strong> {selectedLead.phone}</p>
            <p><strong>Subject:</strong> {selectedLead.subject}</p>
            <p><strong>Message:</strong> {selectedLead.message}</p>
            <p><strong>Service Type:</strong> {selectedLead.serviceType}</p>
            {selectedLead.serviceName && <p><strong>Service:</strong> {selectedLead.serviceName}</p>}
            {selectedLead.city && <p><strong>City:</strong> {selectedLead.city}</p>}
            {selectedLead.notes && <p><strong>Notes:</strong> {selectedLead.notes}</p>}
            <p><strong>Status:</strong> <Tag color={getStatusColor(selectedLead.status)}>{selectedLead.status.toUpperCase()}</Tag></p>
            <p><strong>Priority:</strong> <Tag color={getPriorityColor(selectedLead.priority)}>{selectedLead.priority.toUpperCase()}</Tag></p>
            <p><strong>Created:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Update Lead"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="new">New</Option>
              <Option value="contacted">Contacted</Option>
              <Option value="qualified">Qualified</Option>
              <Option value="converted">Converted</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Add notes about this lead..." />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Lead
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Leads;