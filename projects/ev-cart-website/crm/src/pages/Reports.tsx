import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, DatePicker, Select, Button, Space, Statistic, Tag } from 'antd'
import { Bar, Line, Pie } from '@ant-design/charts'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<[any, any]>()
  const [reportType, setReportType] = useState('sales')

  // 销售报表数据
  const salesReportConfig = {
    data: [
      { month: '01 月', sales: 1250000, target: 1000000 },
      { month: '02 月', sales: 1580000, target: 1200000 },
      { month: '03 月', sales: 2100000, target: 1500000 },
    ],
    xField: 'month',
    yField: ['sales', 'target'],
    isGroup: true,
    columnStyle: { radius: [4, 4, 0, 0] },
  }

  // 客户统计报表
  const customerReportConfig = {
    appendPadding: 10,
    data: [
      { type: '新增客户', value: 156 },
      { type: '活跃客户', value: 428 },
      { type: '沉睡客户', value: 89 },
      { type: '流失客户', value: 23 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: { type: 'outer', content: '{name} {percentage}' },
  }

  // 产品销售排行
  const productRankingData = [
    { rank: 1, product: 'EV Cart Pro', sales: 2580000, growth: 15.8 },
    { rank: 2, product: 'EV Cart Standard', sales: 1850000, growth: 12.5 },
    { rank: 3, product: 'EV Cart Lite', sales: 1250000, growth: 8.2 },
    { rank: 4, product: '配件包 A', sales: 680000, growth: -2.3 },
    { rank: 5, product: '配件包 B', sales: 420000, growth: 5.6 },
  ]

  const productColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (rank: number) => `🏆 ${rank}` },
    { title: '产品名称', dataIndex: 'product', key: 'product', width: 200 },
    { title: '销售额', dataIndex: 'sales', key: 'sales', width: 120, render: (amount: number) => `¥${amount.toLocaleString()}` },
    { title: '同比增长', dataIndex: 'growth', key: 'growth', width: 100, render: (growth: number) => (
      <span style={{ color: growth > 0 ? '#52c41a' : '#ff4d4f' }}>
        {growth > 0 ? '↑' : '↓'} {Math.abs(growth)}%
      </span>
    )},
  ]

  // 经销商绩效报表
  const dealerPerformanceData = [
    { dealer: '深圳经销商', score: 96.5, sales: 5800000, level: 'strategic' },
    { dealer: '广州经销商', score: 92.8, sales: 4200000, level: 'platinum' },
    { dealer: '上海经销商', score: 88.5, sales: 3500000, level: 'gold' },
    { dealer: '北京经销商', score: 85.2, sales: 2800000, level: 'gold' },
    { dealer: '成都经销商', score: 78.6, sales: 1500000, level: 'standard' },
  ]

  const dealerColumns = [
    { title: '经销商', dataIndex: 'dealer', key: 'dealer', width: 150 },
    { title: '绩效分数', dataIndex: 'score', key: 'score', width: 100, render: (score: number) => (
      <span style={{ color: score >= 90 ? '#52c41a' : score >= 80 ? '#faad14' : '#ff4d4f' }}>{score}</span>
    )},
    { title: '销售额', dataIndex: 'sales', key: 'sales', width: 120, render: (amount: number) => `¥${amount.toLocaleString()}` },
    { title: '等级', dataIndex: 'level', key: 'level', width: 100, render: (level: string) => ({
      strategic: '战略', platinum: '白金', gold: '金牌', standard: '标准', trial: '试用',
    }[level] || level) },
  ]

  return (
    <div>
      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 150 }}
            options={[
              { label: '销售报表', value: 'sales' },
              { label: '客户报表', value: 'customer' },
              { label: '产品报表', value: 'product' },
              { label: '经销商报表', value: 'dealer' },
              { label: '招聘报表', value: 'recruitment' },
            ]}
          />
          <RangePicker onChange={(dates) => setDateRange(dates as [any, any])} />
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>刷新</Button>
          <Button icon={<DownloadOutlined />}>导出报表</Button>
        </Space>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总销售额" value={8560000} prefix="¥" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="订单总数" value={1256} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="客户总数" value={856} suffix="人" valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="同比增长" value={15.8} suffix="%" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      {/* 图表报表 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="销售目标对比">
            <Bar {...salesReportConfig} height={300} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="客户分布统计">
            <Pie {...customerReportConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 产品排行 */}
      <Card title="🏆 产品销售排行 TOP5" style={{ marginBottom: 16 }}>
        <Table columns={productColumns} dataSource={productRankingData} rowKey="rank" pagination={false} />
      </Card>

      {/* 经销商绩效 */}
      <Card title="📊 经销商绩效排行 TOP5">
        <Table columns={dealerColumns} dataSource={dealerPerformanceData} rowKey="dealer" pagination={false} />
      </Card>
    </div>
  )
}

export default Reports
