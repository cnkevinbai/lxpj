import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Progress, Table, Tag, Space, DatePicker, Select, message } from 'antd'
import {
  TrophyOutlined,
  DollarOutlined,
  RiseOutlined,
  TeamOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Line, Bar, Pie } from '@ant-design/charts'

interface DealerAnalytics {
  id: string
  dealerCode: string
  companyName: string
  level: string
  province: string
  performanceScore: number
  salesTarget: number
  salesActual: number
  totalRebate: number
  assessmentCount: number
  lastAssessmentGrade: string
}

const DealerAnalytics: React.FC = () => {
  const [dealers, setDealers] = useState<DealerAnalytics[]>([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [filterLevel, setFilterLevel] = useState<string>()
  const [filterProvince, setFilterProvince] = useState<string>()

  const levelColors: Record<string, string> = {
    trial: 'default',
    standard: 'blue',
    gold: 'gold',
    platinum: 'purple',
    strategic: 'red',
  }

  const levelLabels: Record<string, string> = {
    trial: '试用',
    standard: '标准',
    gold: '金牌',
    platinum: '白金',
    strategic: '战略',
  }

  // 获取经销商列表
  const fetchDealers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterLevel) params.append('level', filterLevel)
      if (filterProvince) params.append('province', filterProvince)
      
      const response = await fetch(`/api/v1/dealers?${params}&limit=100`)
      const data = await response.json()
      setDealers(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/dealers/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchDealers()
    fetchStatistics()
  }, [filterLevel, filterProvince])

  // 等级分布数据
  const levelData = Object.entries(statistics.levels || {}).map(([key, value]) => ({
    type: levelLabels[key] || key,
    value: value as number,
  }))

  const levelPieConfig = {
    appendPadding: 10,
    data: levelData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    color: ['#d9d9d9', '#1890ff', '#faad14', '#722ed1', '#ff4d4f'],
  }

  // 省份销售数据
  const provinceData = dealers.reduce((acc: any, dealer) => {
    const key = dealer.province
    if (!acc[key]) {
      acc[key] = { province: key, target: 0, actual: 0 }
    }
    acc[key].target += dealer.salesTarget || 0
    acc[key].actual += dealer.salesActual || 0
    return acc
  }, {})

  const provinceChartData = Object.values(provinceData).map((d: any) => ({
    province: d.province,
    目标: d.target / 10000,
    实际: d.actual / 10000,
  }))

  const provinceBarConfig = {
    data: provinceChartData,
    isGroup: true,
    xField: 'province',
    yField: 'value',
    seriesField: 'type',
    legend: { position: 'top' } as any,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  }

  // 绩效分布
  const scoreRanges = [
    { range: '90-100', count: dealers.filter(d => d.performanceScore >= 90).length },
    { range: '80-89', count: dealers.filter(d => d.performanceScore >= 80 && d.performanceScore < 90).length },
    { range: '70-79', count: dealers.filter(d => d.performanceScore >= 70 && d.performanceScore < 80).length },
    { range: '60-69', count: dealers.filter(d => d.performanceScore >= 60 && d.performanceScore < 70).length },
    { range: '<60', count: dealers.filter(d => d.performanceScore < 60).length },
  ]

  const scoreBarConfig = {
    data: scoreRanges,
    xField: 'range',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#ff4d4f', '#faad14', '#1890ff', '#52c41a', '#722ed1'],
  }

  // 经销商排行表格
  const columns: ColumnsType<DealerAnalytics> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => {
        if (index === 0) return <span style={{ color: '#gold', fontSize: 18 }}>🥇</span>
        if (index === 1) return <span style={{ color: '#silver', fontSize: 18 }}>🥈</span>
        if (index === 2) return <span style={{ color: '#cd7f32', fontSize: 18 }}>🥉</span>
        return index + 1
      },
    },
    {
      title: '经销商',
      key: 'dealer',
      width: 200,
      render: (_, record) => (
        <div>
          <strong>{record.companyName}</strong>
          <br />
          <small style={{ color: '#999' }}>{record.dealerCode}</small>
        </div>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => (
        <Tag color={levelColors[level]}>{levelLabels[level]}</Tag>
      ),
    },
    {
      title: '区域',
      dataIndex: 'province',
      key: 'province',
      width: 100,
    },
    {
      title: '绩效分数',
      dataIndex: 'performanceScore',
      key: 'performanceScore',
      width: 100,
      render: (score) => (
        <Progress
          type="circle"
          percent={score}
          size={40}
          strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'}
          format={(percent) => percent?.toFixed(0)}
        />
      ),
    },
    {
      title: '销售达成率',
      key: 'rate',
      width: 120,
      render: (_, record) => {
        const rate = record.salesTarget ? (record.salesActual / record.salesTarget) * 100 : 0
        return (
          <span style={{ color: rate >= 100 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
            {rate.toFixed(1)}%
          </span>
        )
      },
    },
    {
      title: '销售额',
      key: 'sales',
      width: 120,
      render: (_, record) => `¥${(record.salesActual || 0).toLocaleString()}`,
    },
    {
      title: '累计返利',
      dataIndex: 'totalRebate',
      key: 'totalRebate',
      width: 100,
      render: (amount) => `¥${(amount || 0).toLocaleString()}`,
    },
  ]

  // 按绩效排序
  const sortedDealers = [...dealers].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))

  return (
    <div>
      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="等级筛选"
            style={{ width: 120 }}
            allowClear
            value={filterLevel}
            onChange={setFilterLevel}
            options={[
              { label: '试用', value: 'trial' },
              { label: '标准', value: 'standard' },
              { label: '金牌', value: 'gold' },
              { label: '白金', value: 'platinum' },
              { label: '战略', value: 'strategic' },
            ]}
          />
          <Select
            placeholder="省份筛选"
            style={{ width: 120 }}
            allowClear
            value={filterProvince}
            onChange={setFilterProvince}
            options={[
              { label: '广东', value: '广东' },
              { label: '江苏', value: '江苏' },
              { label: '浙江', value: '浙江' },
              { label: '山东', value: '山东' },
              { label: '四川', value: '四川' },
            ]}
          />
        </Space>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="经销商总数"
              value={statistics.total || dealers.length}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均绩效分数"
              value={dealers.length ? (dealers.reduce((sum, d) => sum + (d.performanceScore || 0), 0) / dealers.length).toFixed(1) : 0}
              suffix="分"
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售目标达成率"
              value={statistics.sales?.target ? ((statistics.sales.actual / statistics.sales.target) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计发放返利"
              value={dealers.reduce((sum, d) => sum + (d.totalRebate || 0), 0).toLocaleString()}
              prefix={<DollarOutlined />}
              suffix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="等级分布">
            <Pie {...levelPieConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="绩效分布">
            <Bar {...scoreBarConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="省份销售对比（万元）">
            <div style={{ height: 300, overflow: 'auto' }}>
              {/* 这里可以使用 Bar 图表，需要转换数据结构 */}
              <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
                省份销售图表
                <br />
                {provinceChartData.length} 个省份数据
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 经销商排行榜 */}
      <Card title="🏆 经销商绩效排行榜">
        <Table
          columns={columns}
          dataSource={sortedDealers.slice(0, 20)}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}

export default DealerAnalytics
