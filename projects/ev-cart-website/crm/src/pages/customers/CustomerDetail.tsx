import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Descriptions, Card, Tabs, Table, Tag, Button, Space, Timeline, message, Badge, Statistic, Row, Col } from 'antd'
import { EditOutlined, BackwardOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons'

interface Customer {
  id: string
  customerCode: string
  customerName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  province: string
  city: string
  address: string
  level: string
  status: string
  totalOrders: number
  totalAmount: number
  lastOrderDate: string
  createdAt: string
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)

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

  const fetchCustomer = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/customers/${id}`)
      const data = await response.json()
      setCustomer(data)
    } catch (error) {
      message.error('加载客户详情失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    const response = await fetch(`/api/v1/orders?customerId=${id}&limit=10`)
    const data = await response.json()
    setOrders(data.data || [])
  }

  const fetchContacts = async () => {
    const response = await fetch(`/api/v1/customers/${id}/contacts`)
    const data = await response.json()
    setContacts(data.data || [])
  }

  useEffect(() => {
    if (id) {
      fetchCustomer()
      fetchOrders()
      fetchContacts()
    }
  }, [id])

  if (loading || !customer) {
    return <div>加载中...</div>
  }

  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderCode', width: 150 },
    { title: '订单日期', dataIndex: 'orderDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '金额', dataIndex: 'totalAmount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag>{s}</Tag> },
  ]

  const contactColumns = [
    { title: '联系人', dataIndex: 'name', width: 120 },
    { title: '职位', dataIndex: 'position', width: 100 },
    { title: '电话', dataIndex: 'phone', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 180 },
    { title: '是否主要', dataIndex: 'isPrimary', width: 80, render: (p: boolean) => p ? <Badge status="success" text="是" /> : <Badge status="default" text="否" /> },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<BackwardOutlined />} onClick={() => navigate('/customers')}>
            返回列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/customers/${id}/edit`)}
          >
            编辑客户
          </Button>
        </Space>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={customer.totalOrders || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="消费总额"
              value={customer.totalAmount || 0}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户级别"
              value={customer.level === 'A' ? 'A 级' : customer.level === 'B' ? 'B 级' : 'C 级'}
              valueStyle={{ color: levelColors[customer.level] }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="状态"
              value={customer.status === 'active' ? '活跃' : customer.status === 'inactive' ? '未激活' : '潜在'}
              valueStyle={{ color: statusColors[customer.status] }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'info',
            label: '基本信息',
            children: (
              <Card>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="客户编码">{customer.customerCode}</Descriptions.Item>
                  <Descriptions.Item label="客户名称">{customer.customerName}</Descriptions.Item>
                  <Descriptions.Item label="联系人">{customer.contactPerson}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{customer.contactPhone}</Descriptions.Item>
                  <Descriptions.Item label="联系邮箱">{customer.contactEmail}</Descriptions.Item>
                  <Descriptions.Item label="所在区域">{customer.province}·{customer.city}</Descriptions.Item>
                  <Descriptions.Item label="详细地址" span={2}>{customer.address || '-'}</Descriptions.Item>
                  <Descriptions.Item label="客户级别">
                    <Tag color={levelColors[customer.level]}>
                      {customer.level === 'A' ? 'A 级 - 重点客户' : customer.level === 'B' ? 'B 级 - 普通客户' : 'C 级 - 潜在客户'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={statusColors[customer.status]}>
                      {customer.status === 'active' ? '活跃' : customer.status === 'inactive' ? '未激活' : '潜在'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="最后订单日期">
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
          {
            key: 'orders',
            label: `订单记录 (${orders.length})`,
            children: (
              <Card>
                <Table
                  columns={orderColumns}
                  dataSource={orders}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 600 }}
                />
              </Card>
            ),
          },
          {
            key: 'contacts',
            label: `联系人 (${contacts.length})`,
            children: (
              <Card>
                <Table
                  columns={contactColumns}
                  dataSource={contacts}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'timeline',
            label: '跟进记录',
            children: (
              <Card>
                <Timeline>
                  <Timeline.Item color="green">客户创建 - {new Date(customer.createdAt).toLocaleDateString()}</Timeline.Item>
                  <Timeline.Item color="blue">首次下单 - {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : '暂无'}</Timeline.Item>
                  <Timeline.Item color="purple">累计消费 - ¥{(customer.totalAmount || 0).toLocaleString()}</Timeline.Item>
                </Timeline>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default CustomerDetail
