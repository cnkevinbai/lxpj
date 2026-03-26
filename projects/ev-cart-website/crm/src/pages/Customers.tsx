import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Input, Space, Tag, Modal, Form, message, Popconfirm, Select } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

const CustomerList: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/customers', {
        params: { page, limit: 20, search }
      })
      setData(response.data.data)
      setTotal(response.data.total)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, search])

  const handleCreate = async (values: any) => {
    try {
      await apiClient.post('/customers', values)
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/customers/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'company' ? 'blue' : type === 'government' ? 'purple' : 'green'
        return <Tag color={color}>{type === 'company' ? '企业' : type === 'government' ? '政府' : '个人'}</Tag>
      },
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const color = level === 'A' ? 'red' : level === 'B' ? 'orange' : 'green'
        return <Tag color={color}>{level}级</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'potential' ? 'blue' : status === 'following' ? 'orange' : status === '成交' ? 'green' : 'gray'
        return <Tag color={color}>{status === 'potential' ? '潜在' : status === 'following' ? '跟进中' : status === '成交' ? '成交' : '流失'}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">客户管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新建客户
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="搜索客户名称/联系人/电话"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => setPage(1)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: 20,
            total: total,
            onChange: (p) => setPage(p),
          }}
        />
      </Card>

      <Modal
        title="新建客户"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="客户名称" rules={[{ required: true }]}>
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="type" label="客户类型" rules={[{ required: true }]}>
            <Select placeholder="请选择客户类型">
              <Select.Option value="company">企业</Select.Option>
              <Select.Option value="individual">个人</Select.Option>
              <Select.Option value="government">政府</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="industry" label="行业">
            <Input placeholder="请输入行业" />
          </Form.Item>
          <Form.Item name="contactPerson" label="联系人">
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item name="contactPhone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="contactEmail" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="province" label="省份">
            <Input placeholder="请输入省份" />
          </Form.Item>
          <Form.Item name="city" label="城市">
            <Input placeholder="请输入城市" />
          </Form.Item>
          <Form.Item name="level" label="客户等级" initialValue="C">
            <Select placeholder="请选择客户等级">
              <Select.Option value="A">A 级</Select.Option>
              <Select.Option value="B">B 级</Select.Option>
              <Select.Option value="C">C 级</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CustomerList
