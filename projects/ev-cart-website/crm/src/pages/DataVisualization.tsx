import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Progress } from 'antd'
import { Line, Bar, Pie } from '@ant-design/plots'
import {
  RiseOutlined,
  DollarOutlined,
  TeamOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import apiClient from '../services/api'

/**
 * 数据可视化大屏
 */
const DataVisualization: React.FC = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalAmount: 0,
    conversionRate: 0,
  })
  const [trendData, setTrendData] = useState([])
  const [sourceData, setSourceData] = useState([])
  const [levelData, setLevelData] = useState([])

  useEffect(() => {
    loadStats()
    loadTrendData()
    loadSourceData()
    loadLevelData()
  }, [])

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/stats/overview')
      setStats(response.data)
    } catch (error) {
      console.error('加载统计失败', error)
    }
  }

  const loadTrendData = async () => {
    try {
      const response = await apiClient.get('/reports/trend')
      setTrendData(response.data)
    } catch (error) {
      console.error('加载趋势数据失败', error)
    }
  }

  const loadSourceData = async () => {
    try {
      const response = await apiClient.get('/leads/stats', {
        params: { groupBy: 'source' },
      })
      setSourceData(Object.entries(response.data.bySource).map(([name, value]: [string, any]) => ({
        type: name,
        value,
      })))
    } catch (error) {
      console.error('加载来源数据失败', error)
    }
  }

  const loadLevelData = async () => {
    try {
      const response = await apiClient.get('/customers/stats', {
        params: { groupBy: 'level' },
      })
      setLevelData(Object.entries(response.data.byLevel).map(([name, value]: [string, any]) => ({
        type: `${name}级`,
        value,
      })))
    } catch (error) {
      console.error('加载等级数据失败', error)
    }
  }

  const lineConfig = {
    data: trendData,
    height: 300,
    xField: 'month',
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

  const pieConfig = {
    appendPadding: 10,
    data: sourceData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  }

  const barConfig = {
    data: levelData,
    height: 300,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card className="card-hover">
            <Statistic
              title="线索总数"
              value={stats.totalLeads}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-hover">
            <Statistic
              title="客户总数"
              value={stats.totalCustomers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-hover">
            <Statistic
              title="订单总数"
              value={stats.totalOrders}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-hover">
            <Statistic
              title="转化率"
              value={stats.conversionRate}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={16} className="mb-4">
        <Col span={24}>
          <Card title="业务趋势">
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>

      {/* 来源和等级 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="线索来源分布">
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="客户等级分布">
            <Bar {...barConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DataVisualization
