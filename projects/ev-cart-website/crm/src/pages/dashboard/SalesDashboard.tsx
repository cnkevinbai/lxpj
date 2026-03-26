import React, { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Progress, DatePicker, Select, Space, Button, Avatar } from 'antd'
import { 
  TeamOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined, 
  RiseOutlined, 
  FallOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { Area, Column, Pie } from '@ant-design/plots'

const { RangePicker } = DatePicker
const { Option } = Select

const SalesDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null)

  // 销售趋势数据
  const salesTrendData = [
    { date: '2026-01', sales: 120, target: 100 },
    { date: '2026-02', sales: 132, target: 100 },
    { date: '2026-03', sales: 101, target: 100 },
    { date: '2026-04', sales: 134, target: 100 },
    { date: '2026-05', sales: 90, target: 100 },
    { date: '2026-06', sales: 230, target: 100 },
    { date: '2026-07', sales: 210, target: 100 },
  ]

  // 产品线分布
  const productData = [
    { type: '智能换电柜', value: 35 },
    { type: '锂电池', value: 25 },
    { type: '配件', value: 15 },
    { type: '软件服务', value: 15 },
    { type: '其他', value: 10 },
  ]

  // 销售团队排行
  const salesTeamData = [
    { id: '1', name: '张三', avatar: '👨‍💼', deals: 28, amount: 1280000, rate: 156 },
    { id: '2', name: '李四', avatar: '👩‍💼', deals: 25, amount: 1150000, rate: 142 },
    { id: '3', name: '王五', avatar: '👨‍💼', deals: 22, amount: 980000, rate: 128 },
    { id: '4', name: '赵六', avatar: '👩‍💼', deals: 18, amount: 750000, rate: 95 },
    { id: '5', name: '钱七', avatar: '👨‍💼', deals: 15, amount: 620000, rate: 82 },
  ]

  // 待跟进商机
  const followUpData = [
    { id: '1', customer: '某某物流公司', amount: 150000, stage: '方案报价', days: 2 },
    { id: '2', customer: '某某科技公司', amount: 500000, stage: '谈判审核', days: 5 },
    { id: '3', customer: '某某贸易公司', amount: 80000, stage: '需求分析', days: 1 },
    { id: '4', customer: '某某制造公司', amount: 320000, stage: '初步接洽', days: 7 },
  ]

  const trendConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'sales',
    seriesField: 'sales',
    smooth: true,
    areaStyle: { fill: 'l(270) 0:#1890ff 1:#1890ff' },
    line: { size: 2 },
  }

  const pieConfig = {
    appendPadding: 10,
    data: productData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  }

  const columns = [
    {
      title: '销售人员',
      dataIndex: 'name',
      width: 150,
      render: (name: string, record: any) => (
        <Space>
          <Avatar size="small">{record.avatar}</Avatar>
          {name}
        </Space>
      ),
    },
    {
      title: '成交单数',
      dataIndex: 'deals',
      width: 100,
      sorter: (a: any, b: any) => a.deals - b.deals,
    },
    {
      title: '成交金额',
      dataIndex: 'amount',
      width: 130,
      render: (amount: number) => `¥${(amount / 10000).toFixed(0)}万`,
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: '目标完成率',
      dataIndex: 'rate',
      width: 130,
      render: (rate: number) => (
        <Progress
          percent={rate}
          strokeColor={rate >= 100 ? '#52c41a' : rate >= 80 ? '#faad14' : '#ff4d4f'}
          format={() => `${rate}%`}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: () => <Button type="link" size="small"><MoreOutlined /></Button>,
    },
  ]

  const followUpColumns = [
    {
      title: '客户',
      dataIndex: 'customer',
      width: 180,
    },
    {
      title: '预计金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => `¥${(amount / 10000).toFixed(1)}万`,
    },
    {
      title: '销售阶段',
      dataIndex: 'stage',
      width: 120,
      render: (stage: string) => <Tag color="blue">{stage}</Tag>,
    },
    {
      title: '待跟进天数',
      dataIndex: 'days',
      width: 120,
      render: (days: number) => (
        <Tag color={days > 3 ? 'red' : 'green'}>{days}天</Tag>
      ),
    },
  ]

  return (
    <div>
      {/* 顶部筛选 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <span style={{ fontSize: 16, fontWeight: 600 }}>销售数据分析</span>
          <RangePicker onChange={(dates) => setDateRange(dates)} />
        </Space>
        <Space>
          <Button>导出报表</Button>
          <Button type="primary">刷新数据</Button>
        </Space>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={210}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="万"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="环比增长"
              value={12.5}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成交订单数"
              value={108}
              suffix="单"
              valueStyle={{ color: '#722ed1' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="新增客户"
              value={35}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title="📈 销售趋势">
            <Column {...trendConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📊 产品线分布">
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 销售团队和待跟进 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card 
            title="🏆 销售团队排行"
            extra={<Button type="link">查看全部</Button>}
          >
            <Table
              columns={columns}
              dataSource={salesTeamData}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title="⏰ 待跟进商机"
            extra={<Button type="link">查看全部</Button>}
          >
            <Table
              columns={followUpColumns}
              dataSource={followUpData}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SalesDashboard
