import React from 'react'
import { Card, Row, Col, Statistic, Progress } from 'antd'
import {
  TeamOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { Line, Bar, Pie } from '@ant-design/plots'

const Dashboard: React.FC = () => {
  const stats = [
    { title: '总客户数', value: 1258, icon: <TeamOutlined />, color: '#1890ff' },
    { title: '新增线索', value: 86, icon: <InboxOutlined />, color: '#52c41a' },
    { title: '本月订单', value: 42, icon: <ShoppingCartOutlined />, color: '#faad14' },
    { title: '销售额', value: '¥2.8M', icon: <DollarOutlined />, color: '#722ed1' },
  ]

  const lineConfig = {
    data: [
      { month: '1 月', value: 120 },
      { month: '2 月', value: 180 },
      { month: '3 月', value: 220 },
      { month: '4 月', value: 280 },
      { month: '5 月', value: 350 },
      { month: '6 月', value: 420 },
    ],
    xField: 'month',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    color: '#1890ff',
  }

  const pieConfig = {
    appendPadding: 10,
    data: [
      { type: '观光车', value: 45 },
      { type: '巡逻车', value: 25 },
      { type: '货车', value: 15 },
      { type: '巴士', value: 15 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card title="销售趋势" className="mb-6">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="产品销售占比" className="mb-6">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Card title="最近活动">
        {/* TODO: 实现活动列表 */}
        <p className="text-gray-500">暂无数据</p>
      </Card>
    </div>
  )
}

export default Dashboard
