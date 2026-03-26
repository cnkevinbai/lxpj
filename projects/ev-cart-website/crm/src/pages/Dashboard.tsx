import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Progress, Table, DatePicker, Select, message, Space } from 'antd'
import {
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Line, Bar, Pie } from '@ant-design/charts'

const { RangePicker } = DatePicker

interface DashboardData {
  salesToday: number
  salesMonth: number
  customersTotal: number
  ordersPending: number
  revenueGrowth: number
  customerGrowth: number
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DashboardData>({
    salesToday: 0,
    salesMonth: 0,
    customersTotal: 0,
    ordersPending: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
  })
  const [dateRange, setDateRange] = useState<[any, any]>()

  // 获取仪表盘数据
  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/dashboard')
      const data = await response.json()
      setData(data)
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  // 销售趋势图表配置
  const salesTrendConfig = {
    data: [
      { date: '03-01', sales: 120000 },
      { date: '03-02', sales: 150000 },
      { date: '03-03', sales: 180000 },
      { date: '03-04', sales: 220000 },
      { date: '03-05', sales: 190000 },
      { date: '03-06', sales: 250000 },
      { date: '03-07', sales: 280000 },
    ],
    xField: 'date',
    yField: 'sales',
    point: { size: 5, shape: 'circle' },
    label: {
      style: { fill: '#aaa' },
    },
  }

  // 客户分布图表配置
  const customerDistConfig = {
    appendPadding: 10,
    data: [
      { type: 'A 级客户', value: 120 },
      { type: 'B 级客户', value: 280 },
      { type: 'C 级客户', value: 450 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  }

  // 订单状态表格
  const orderColumns: ColumnsType = [
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => ({
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
      }[status] || status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  const orders = [
    { id: 1, orderCode: 'ORD-20260312-001', customer: '张三', amount: 15800, status: 'pending', createdAt: '2026-03-12' },
    { id: 2, orderCode: 'ORD-20260312-002', customer: '李四', amount: 28500, status: 'processing', createdAt: '2026-03-12' },
    { id: 3, orderCode: 'ORD-20260312-003', customer: '王五', amount: 42000, status: 'pending', createdAt: '2026-03-12' },
  ]

  return (
    <div>
      {/* 日期筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <RangePicker onChange={(dates) => setDateRange(dates as [any, any])} />
          <Select
            defaultValue="7days"
            style={{ width: 120 }}
            options={[
              { label: '最近 7 天', value: '7days' },
              { label: '最近 30 天', value: '30days' },
              { label: '最近 90 天', value: '90days' },
            ]}
          />
        </Space>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={data.salesToday || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={data.salesMonth || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={data.customersTotal || 0}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理订单"
              value={data.ordersPending || 0}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 增长趋势 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="销售趋势">
            <Line {...salesTrendConfig} height={300} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="客户分布">
            <Pie {...customerDistConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 待处理订单 */}
      <Card title="待处理订单">
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  )
}

export default Dashboard
