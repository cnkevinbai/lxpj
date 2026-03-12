import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Select, Modal, Form, message, Card, Statistic, Row, Col, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Customer {
  id: string
  customerCode: string
  customerName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  province: string
  city: string
  level: string
  status: string
  totalOrders: number
  totalAmount: number
  createdAt: string
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [searchText, setSearchText] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>()
  const [filterStatus, setFilterStatus] = useState<string>()
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()
  const [statistics, setStatistics] = useState<any>({})

  const levelColors: Record<string, string> = {
    A: 'red',
    B: 'blue',
    C: 'default',
  }

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    potential: 'processing',
  }

  const statusLabels: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    potential: '潜在',
  }

  // 获取客户列表
  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (searchText) params.append('search', searchText)
      if (filterLevel) params.append('level', filterLevel)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/v1/customers?${params}`)
      const data = await response.json()
      setCustomers(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载客户列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/customers/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchStatistics()
  }, [page, limit, filterLevel, filterStatus])

  // 创建客户
  const handleCreate = async (values: any) => {
    try {
      await fetch('/api/v1/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('创建成功')
      setCreateVisible(false)
      form.resetFields()
      fetchCustomers()
    } catch (error) {
      message.error('创建失败')
    }
  }

  // 删除客户
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/customers/${id}`, { method: 'DELETE' })
      message.success('删除成功')
      fetchCustomers()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<Customer> = [
    {
      title: '客户编码',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '所在区域',
      key: 'location',
      width: 150,
      render: (_, record) => `${record.province}·${record.city}`,
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => (
        <Tag color={levelColors[level]}>{level === 'A' ? 'A 级' : level === 'B' ? 'B 级' : 'C 级'}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '订单数',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 80,
    },
    {
      title: '消费金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => `¥${(amount || 0).toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此客户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={statistics.total || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃客户"
              value={statistics.active || 0}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="A 级客户"
              value={statistics.levelA || 0}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户总价值"
              value={statistics.totalValue || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索客户名称/联系人"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchCustomers}
          />
          <Select
            placeholder="客户级别"
            style={{ width: 100 }}
            allowClear
            value={filterLevel}
            onChange={setFilterLevel}
            options={[
              { label: 'A 级', value: 'A' },
              { label: 'B 级', value: 'B' },
              { label: 'C 级', value: 'C' },
            ]}
          />
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: '活跃', value: 'active' },
              { label: '未激活', value: 'inactive' },
              { label: '潜在', value: 'potential' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchCustomers}>
            查询
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            新增客户
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page)
            setLimit(pageSize || 20)
          },
        }}
        scroll={{ x: 1400 }}
      />

      {/* 创建客户弹窗 */}
      <Modal
        title="创建客户"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="customerName"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="contactEmail"
            label="联系邮箱"
            rules={[
              { required: true, message: '请输入联系邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' },
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item
            name="level"
            label="客户级别"
            initialValue="C"
          >
            <Select>
              <Select.Option value="A">A 级 - 重点客户</Select.Option>
              <Select.Option value="B">B 级 - 普通客户</Select.Option>
              <Select.Option value="C">C 级 - 潜在客户</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Customers
