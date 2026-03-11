import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Progress, Tag } from 'antd'
import {
  TeamOutlined,
  InboxOutlined,
  OpportunityOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import apiClient from '../services/api'
import dayjs from 'dayjs'

/**
 * 内贸业务仪表盘
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalOpportunities: 0,
    totalOrders: 0,
    totalAmount: 0,
    conversionRate: 0,
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [topSales, setTopSales] = useState([])

  useEffect(() => {
    loadStats()
    loadRecentLeads()
    loadTopSales()
  }, [])

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/stats/domestic')
      setStats(response.data)
    } catch (error) {
      console.error('加载统计失败', error)
    }
  }

  const loadRecentLeads = async () => {
    try {
      const response = await apiClient.get('/leads', {
        params: { limit: 5, businessType: 'domestic' },
      })
      setRecentLeads(response.data.data)
    } catch (error) {
      console.error('加载线索失败', error)
    }
  }

  const loadTopSales = async () => {
    try {
      const response = await apiClient.get('/performance/top-sales', {
        params: { limit: 5, businessType: 'domestic' },
      })
      setTopSales(response.data)
    } catch (error) {
      console.error('加载销售排名失败', error)
    }
  }

  const leadColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '意向产品',
      dataIndex: 'productInterest',
      key: 'productInterest',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => <Tag>{source}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
  ]

  const salesColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => (
        <span className={`font-bold ${rank <= 3 ? 'text-red-500' : ''}`}>
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
        </span>
      ),
    },
    {
      title: '业务员',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '线索数',
      dataIndex: 'leadCount',
      key: 'leadCount',
    },
    {
      title: '成交客户',
      dataIndex: 'customerCount',
      key: 'customerCount',
    },
    {
      title: '业绩进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} status={progress >= 100 ? 'success' : 'active'} />
      ),
    },
  ]

  return (
    <div className="p-4">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="线索总数"
              value={stats.totalLeads}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={stats.totalCustomers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="商机总数"
              value={stats.totalOpportunities}
              prefix={<OpportunityOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单金额"
              value={stats.totalAmount}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card title="转化率">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-blue mb-2">
                {stats.conversionRate}%
              </div>
              <Progress
                percent={stats.conversionRate}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                status="active"
              />
              <div className="text-sm text-gray-500 mt-2">
                <RiseOutlined /> 较上月提升 2.5%
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="业绩概览">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>本月目标</span>
                  <span>¥800,000</span>
                </div>
                <Progress percent={65} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>季度目标</span>
                  <span>¥2,000,000</span>
                </div>
                <Progress percent={45} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>年度目标</span>
                  <span>¥8,000,000</span>
                </div>
                <Progress percent={28} strokeColor="#722ed1" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近线索和销售排名 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近线索">
            <Table
              columns={leadColumns}
              dataSource={recentLeads}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="销售排名">
            <Table
              columns={salesColumns}
              dataSource={topSales.map((item: any, index) => ({
                ...item,
                rank: index + 1,
              }))}
              rowKey="userId"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
