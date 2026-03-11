import React, { useState, useEffect } from 'react'
import { Table, Card, Tag, Space, Button, Statistic, Row, Col } from 'antd'
import { ShoppingCartOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

const Orders: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, revenue: 0 })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [listRes, statsRes] = await Promise.all([
        apiClient.get('/orders', { params: { page: 1, limit: 20 } }),
        apiClient.get('/orders/statistics')
      ])
      setData(listRes.data.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const statusConfig: any = {
    pending: { color: 'orange', text: '待处理' },
    confirmed: { color: 'blue', text: '已确认' },
    production: { color: 'purple', text: '生产中' },
    ready: { color: 'cyan', text: '待发货' },
    shipped: { color: 'geekblue', text: '已发货' },
    completed: { color: 'green', text: '已完成' },
  }

  const paymentConfig: any = {
    unpaid: { color: 'red', text: '未付款' },
    partial: { color: 'orange', text: '部分付款' },
    paid: { color: 'green', text: '已付款' },
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${(amount || 0).toLocaleString()}`,
    },
    {
      title: '已付金额',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number) => `¥${(amount || 0).toLocaleString()}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusConfig[status]?.color}>
          {statusConfig[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '付款状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <Tag color={paymentConfig[status]?.color}>
          {paymentConfig[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <Button type="primary">新建订单</Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={stats.total}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理订单"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成订单"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售收入"
              value={stats.revenue}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 订单列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}

export default Orders
