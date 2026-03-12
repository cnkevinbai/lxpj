import React, { useState, useEffect } from 'react'
import PortalLayout from '../components/PortalLayout'
import { Card, Row, Col, Statistic, Button, Space, Table, Tag, Badge, Progress } from 'antd'
import { 
  ShoppingCartOutlined, 
  FileTextOutlined, 
  CustomerServiceOutlined,
  DollarOutlined,
  TrendUpOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'

const Portal: React.FC = () => {
  const [stats, setStats] = useState<any>({})
  const [orders, setOrders] = useState([])
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [statsRes, ordersRes, ticketsRes] = await Promise.all([
        fetch('/api/v1/portal/stats'),
        fetch('/api/v1/portal/orders?limit=5'),
        fetch('/api/v1/portal/tickets?limit=5'),
      ])

      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()
      const ticketsData = await ticketsRes.json()

      setStats(statsData)
      setOrders(ordersData.data || [])
      setTickets(ticketsData.data || [])
    } catch (error) {
      console.error('Load dashboard failed:', error)
    }
  }

  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderCode', width: 150 },
    { title: '订单日期', dataIndex: 'orderDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '金额', dataIndex: 'totalAmount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      render: (s: string) => (
        <Tag color={
          s === 'completed' ? 'success' : 
          s === 'processing' ? 'processing' : 
          s === 'pending' ? 'warning' : 'default'
        }>
          {s === 'completed' ? '已完成' : s === 'processing' ? '处理中' : s === 'pending' ? '待处理' : s}
        </Tag>
      )
    },
    { title: '操作', key: 'action', width: 100, render: () => <a href="#">详情</a> },
  ]

  const ticketColumns = [
    { title: '工单编号', dataIndex: 'ticketCode', width: 150 },
    { title: '问题类型', dataIndex: 'issueType', width: 120 },
    { title: '创建日期', dataIndex: 'createdAt', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      render: (s: string) => (
        <Badge 
          status={
            s === 'completed' ? 'success' : 
            s === 'processing' ? 'processing' : 
            s === 'pending' ? 'warning' : 'default'
          } 
          text={s === 'completed' ? '已完成' : s === 'processing' ? '处理中' : s === 'pending' ? '待处理' : s} 
        />
      )
    },
    { title: '操作', key: 'action', width: 100, render: () => <a href="#">详情</a> },
  ]

  return (
    <PortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 系统入口卡片 */}
        <Row gutter={24} style={{ marginBottom: 32 }}>
          <Col span={8}>
            <Card 
              hoverable
              onClick={() => window.location.href = '/portal/crm'}
              style={{ textAlign: 'center', padding: '40px 20px', cursor: 'pointer' }}
            >
              <TeamOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
              <h3 style={{ fontSize: 24, marginBottom: 12 }}>CRM 系统</h3>
              <p style={{ color: '#999', marginBottom: 24 }}>客户管理 · 订单管理 · 经销商管理</p>
              <Button type="primary" size="large">进入 CRM</Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card 
              hoverable
              onClick={() => window.location.href = '/portal/erp'}
              style={{ textAlign: 'center', padding: '40px 20px', cursor: 'pointer' }}
            >
              <BarChartOutlined style={{ fontSize: 64, color: '#722ed1', marginBottom: 24 }} />
              <h3 style={{ fontSize: 24, marginBottom: 12 }}>ERP 系统</h3>
              <p style={{ color: '#999', marginBottom: 24 }}>采购管理 · 生产管理 · 库存管理</p>
              <Button type="primary" size="large" style={{ background: '#722ed1' }}>进入 ERP</Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card 
              hoverable
              onClick={() => window.location.href = '/portal/service'}
              style={{ textAlign: 'center', padding: '40px 20px', cursor: 'pointer' }}
            >
              <CustomerServiceOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
              <h3 style={{ fontSize: 24, marginBottom: 12 }}>售后管理</h3>
              <p style={{ color: '#999', marginBottom: 24 }}>服务请求 · 工单管理 · 客户反馈</p>
              <Button type="primary" size="large" style={{ background: '#52c41a' }}>进入售后</Button>
            </Card>
          </Col>
        </Row>

        {/* 数据统计 */}
        <Row gutter={16} style={{ marginBottom: 32 }}>
          <Col span={6}>
            <Card onClick={() => window.location.href = '/portal/orders'} style={{ cursor: 'pointer' }}>
              <Statistic
                title="我的订单"
                value={stats.totalOrders || 0}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card onClick={() => window.location.href = '/portal/orders?status=pending'} style={{ cursor: 'pointer' }}>
              <Statistic
                title="待处理订单"
                value={stats.pendingOrders || 0}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card onClick={() => window.location.href = '/portal/tickets'} style={{ cursor: 'pointer' }}>
              <Statistic
                title="服务工单"
                value={stats.totalTickets || 0}
                suffix="个"
                valueStyle={{ color: '#722ed1' }}
                prefix={<CustomerServiceOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="消费总额"
                value={stats.totalAmount || 0}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近订单 */}
        <Card 
          title="最近订单" 
          style={{ marginBottom: 24 }}
          onClick={() => window.location.href = '/portal/orders'}
        >
          <Table 
            columns={orderColumns} 
            dataSource={orders} 
            rowKey="id" 
            pagination={false}
          />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/portal/orders">查看全部订单 →</a>
          </div>
        </Card>

        {/* 最近工单 */}
        <Card 
          title="最近工单"
          onClick={() => window.location.href = '/portal/tickets'}
        >
          <Table 
            columns={ticketColumns} 
            dataSource={tickets} 
            rowKey="id" 
            pagination={false}
          />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/portal/tickets">查看全部工单 →</a>
          </div>
        </Card>
      </motion.div>
    </PortalLayout>
  )
}

export default Portal
