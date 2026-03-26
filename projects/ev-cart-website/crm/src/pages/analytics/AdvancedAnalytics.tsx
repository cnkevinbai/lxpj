import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Progress, Tag, Space, DatePicker, Select, Button, Avatar } from 'antd'
import { RiseOutlined, FallOutlined, TeamOutlined, DollarOutlined, ShoppingCartOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Line, Column, Pie, Area } from '@ant-design/plots'

const { RangePicker } = DatePicker
const { Option } = Select

const AdvancedAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null)

  // 核心指标
  const metrics = {
    revenue: { value: 1268.5, unit: '万', change: 12.5, trend: 'up' },
    orders: { value: 1458, unit: '单', change: 8.3, trend: 'up' },
    customers: { value: 328, unit: '个', change: -2.1, trend: 'down' },
    conversion: { value: 68.5, unit: '%', change: 5.2, trend: 'up' },
  }

  // 销售趋势
  const salesTrendData = [
    { month: '1 月', revenue: 120, orders: 145, customers: 42 },
    { month: '2 月', revenue: 132, orders: 158, customers: 48 },
    { month: '3 月', revenue: 101, orders: 125, customers: 35 },
    { month: '4 月', revenue: 134, orders: 162, customers: 52 },
    { month: '5 月', revenue: 90, orders: 108, customers: 28 },
    { month: '6 月', revenue: 230, orders: 285, customers: 78 },
    { month: '7 月', revenue: 210, orders: 265, customers: 68 },
    { month: '8 月', revenue: 251.5, orders: 310, customers: 85 },
  ]

  // 产品线分析
  const productPerformance = [
    { product: '智能换电柜 V3', revenue: 525, sales: 350, profit: 175, margin: 33.3 },
    { product: '智能换电柜 V2', revenue: 216, sales: 180, profit: 65, margin: 30.1 },
    { product: '锂电池 48V', revenue: 144, sales: 1200, profit: 48, margin: 33.3 },
    { product: '锂电池 60V', revenue: 120, sales: 800, profit: 36, margin: 30.0 },
    { product: '配件包', revenue: 37.5, sales: 2500, profit: 15, margin: 40.0 },
  ]

  // 客户分群
  const customerSegments = [
    { segment: '战略客户', count: 15, revenue: 450, rate: 35.5 },
    { segment: '重点客户', count: 45, revenue: 380, rate: 30.0 },
    { segment: '普通客户', count: 120, revenue: 280, rate: 22.1 },
    { segment: '潜在客户', count: 148, revenue: 158.5, rate: 12.4 },
  ]

  // 销售团队绩效
  const salesPerformance = [
    { name: '张三', avatar: '👨‍💼', deals: 48, revenue: 285, target: 200, rate: 142.5 },
    { name: '李四', avatar: '👩‍💼', deals: 42, revenue: 258, target: 200, rate: 129.0 },
    { name: '王五', avatar: '👨‍💼', deals: 38, revenue: 225, target: 200, rate: 112.5 },
    { name: '赵六', avatar: '👩‍💼', deals: 35, revenue: 198, target: 200, rate: 99.0 },
    { name: '钱七', avatar: '👨‍💼', deals: 30, revenue: 165, target: 200, rate: 82.5 },
  ]

  const lineConfig = {
    data: salesTrendData,
    xField: 'month',
    yField: 'revenue',
    seriesField: 'revenue',
    smooth: true,
    areaStyle: { fill: 'l(270) 0:#1890ff 0.5:#722ed1 1:#722ed1' },
  }

  const columnConfig = {
    data: productPerformance,
    xField: 'product',
    yField: 'revenue',
    seriesField: 'revenue',
    color: '#1890ff',
    label: {
      position: 'top',
      content: (item: any) => `¥${item.revenue}万`,
    },
  }

  const pieConfig = {
    appendPadding: 10,
    data: customerSegments.map(s => ({ type: s.segment, value: s.revenue })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 顶部筛选 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>📊 高级数据分析</h1>
          <p style={{ color: '#666' }}>全方位业务数据洞察与决策支持</p>
        </div>
        <Space>
          <RangePicker onChange={(dates) => setDateRange(dates)} />
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">全部业务</Option>
            <Option value="sales">销售</Option>
            <Option value="product">产品</Option>
            <Option value="customer">客户</Option>
          </Select>
          <Button type="primary">导出报告</Button>
        </Space>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总营收"
              value={metrics.revenue.value}
              precision={1}
              suffix={`万 ${metrics.revenue.change > 0 ? '↑' : '↓'}${metrics.revenue.change}%`}
              valueStyle={{ color: metrics.revenue.change > 0 ? '#52c41a' : '#ff4d4f', fontSize: 28, fontWeight: 700 }}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={metrics.orders.value}
              suffix={`万 ${metrics.orders.change > 0 ? '↑' : '↓'}${metrics.orders.change}%`}
              valueStyle={{ color: metrics.orders.change > 0 ? '#52c41a' : '#ff4d4f', fontSize: 28, fontWeight: 700 }}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="新增客户"
              value={metrics.customers.value}
              suffix={`个 ${metrics.customers.change > 0 ? '↑' : '↓'}${Math.abs(metrics.customers.change)}%`}
              valueStyle={{ color: metrics.customers.change > 0 ? '#52c41a' : '#ff4d4f', fontSize: 28, fontWeight: 700 }}
              prefix={<UsergroupAddOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="转化率"
              value={metrics.conversion.value}
              suffix={`% ${metrics.conversion.change > 0 ? '↑' : '↓'}${metrics.conversion.change}%`}
              valueStyle={{ color: metrics.conversion.change > 0 ? '#52c41a' : '#ff4d4f', fontSize: 28, fontWeight: 700 }}
              prefix={<TeamOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 销售趋势和产品分析 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="📈 销售趋势分析">
            <Line {...lineConfig} height={320} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📊 客户分布">
            <Pie {...pieConfig} height={320} />
          </Card>
        </Col>
      </Row>

      {/* 产品线和团队绩效 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="🏆 产品线绩效">
            <Table
              dataSource={productPerformance}
              rowKey="product"
              pagination={false}
              columns={[
                { title: '产品名称', dataIndex: 'product', width: 200 },
                { title: '销售额 (万)', dataIndex: 'revenue', width: 120, sorter: (a: any, b: any) => a.revenue - b.revenue },
                { title: '销量', dataIndex: 'sales', width: 100, sorter: (a: any, b: any) => a.sales - b.sales },
                { title: '利润 (万)', dataIndex: 'profit', width: 100, render: (p: number) => <span style={{ color: '#52c41a' }}>¥{p}万</span> },
                { 
                  title: '毛利率', 
                  dataIndex: 'margin', 
                  width: 120,
                  render: (m: number) => (
                    <Progress
                      percent={m}
                      strokeColor={m > 35 ? '#52c41a' : m > 30 ? '#faad14' : '#ff4d4f'}
                      format={() => `${m}%`}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="👥 销售团队绩效">
            {salesPerformance.map((sales, index) => (
              <div key={sales.name} style={{ 
                padding: '12px 0', 
                borderBottom: index < salesPerformance.length - 1 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <Avatar size={40}>{sales.avatar}</Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>{sales.name}</strong>
                    <span style={{ color: sales.rate >= 100 ? '#52c41a' : '#faad14' }}>{sales.rate}%</span>
                  </div>
                  <Progress
                    percent={sales.rate}
                    strokeColor={sales.rate >= 100 ? '#52c41a' : '#faad14'}
                    size="small"
                    format={() => `¥${sales.revenue}万`}
                  />
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 客户分群分析 */}
      <Card title="👔 客户分群分析">
        <Table
          dataSource={customerSegments}
          rowKey="segment"
          pagination={false}
          columns={[
            { title: '客户群体', dataIndex: 'segment', width: 150 },
            { title: '客户数', dataIndex: 'count', width: 120, sorter: (a: any, b: any) => a.count - b.count },
            { title: '贡献营收 (万)', dataIndex: 'revenue', width: 150, render: (r: number) => <span style={{ color: '#1890ff', fontWeight: 600 }}>¥{r}万</span> },
            { title: '占比', dataIndex: 'rate', width: 120, render: (r: number) => `${r}%` },
            {
              title: '价值等级',
              key: 'level',
              width: 150,
              render: (_: any, record: any) => (
                <Tag color={record.rate > 30 ? 'purple' : record.rate > 20 ? 'blue' : 'green'}>
                  {record.rate > 30 ? '高价值' : record.rate > 20 ? '中价值' : '普通价值'}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export default AdvancedAnalytics
