import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Select, Space } from 'antd'
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { Line, Pie, Column } from '@ant-design/plots'

const { RangePicker } = DatePicker

export default function StatisticDashboard() {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<[any, any] | null>(null)
  const [overview, setOverview] = useState<any>(null)
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [typeDistribution, setTypeDistribution] = useState<any[]>([])
  const [technicianStats, setTechnicianStats] = useState<any[]>([])

  // 总体统计卡片
  const overviewCards = overview ? [
    {
      title: '总工单数',
      value: overview.total,
      icon: <TeamOutlined />,
      color: '#1890ff',
    },
    {
      title: '完成率',
      value: `${overview.completionRate}%`,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: '平均响应',
      value: '2.5 小时',
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      title: '满意度',
      value: `${overview.avgSatisfaction}分`,
      icon: <StarOutlined />,
      color: '#722ed1',
    },
  ] : []

  // 趋势图配置
  const lineConfig = {
    data: dailyStats.flatMap((item: any) => [
      { date: item.date.slice(0, 10), type: '总工单', value: item.totalTickets },
      { date: item.date.slice(0, 10), type: '已完成', value: item.completedTickets },
    ]),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  }

  // 类型分布饼图配置
  const pieConfig = {
    appendPadding: 10,
    data: typeDistribution,
    angleField: 'count',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  }

  // 人员绩效表格
  const technicianColumns = [
    {
      title: '服务人员',
      dataIndex: 'technicianName',
      key: 'technicianName',
    },
    {
      title: '总工单',
      dataIndex: 'totalTickets',
      key: 'totalTickets',
      sorter: (a: any, b: any) => a.totalTickets - b.totalTickets,
    },
    {
      title: '已完成',
      dataIndex: 'completedTickets',
      key: 'completedTickets',
      render: (count: number, record: any) => (
        <span>{count} ({((count / record.totalTickets) * 100).toFixed(0)}%)</span>
      ),
    },
    {
      title: '满意度',
      dataIndex: 'avgSatisfaction',
      key: 'avgSatisfaction',
      render: (score: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{score.toFixed(1)}</span>
        </Space>
      ),
      sorter: (a: any, b: any) => a.avgSatisfaction - b.avgSatisfaction,
    },
    {
      title: '绩效评级',
      key: 'rating',
      render: (_: any, record: any) => {
        const score = record.avgSatisfaction
        let color = 'default'
        let text = '普通'
        if (score >= 4.8) {
          color = 'green'
          text = '优秀'
        } else if (score >= 4.5) {
          color = 'blue'
          text = '良好'
        } else if (score >= 4.0) {
          color: 'orange'
          text = '一般'
        }
        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>服务统计报表</h1>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [any, any])}
          />
          <Select defaultValue="30" style={{ width: 120 }}>
            <Select.Option value="7">最近 7 天</Select.Option>
            <Select.Option value="30">最近 30 天</Select.Option>
            <Select.Option value="90">最近 90 天</Select.Option>
          </Select>
        </Space>
      </div>

      {/* 总体统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {overviewCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 趋势图和饼图 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="工单趋势">
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="工单类型分布">
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 人员绩效 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="服务人员绩效">
            <Table
              columns={technicianColumns}
              dataSource={technicianStats}
              rowKey="technicianId"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
