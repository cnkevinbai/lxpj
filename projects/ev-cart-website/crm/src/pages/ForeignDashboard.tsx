import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Progress, Tag } from 'antd'
import {
  GlobalOutlined,
  InboxOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  DollarOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import apiClient from '../services/api'
import dayjs from 'dayjs'

/**
 * 外贸业务仪表盘
 */
const ForeignDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalInquiries: 0,
    totalOrders: 0,
    totalAmount: 0,
    conversionRate: 0,
  })
  const [recentInquiries, setRecentInquiries] = useState([])
  const [topCountries, setTopCountries] = useState([])

  useEffect(() => {
    loadStats()
    loadRecentInquiries()
    loadTopCountries()
  }, [])

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/foreign/stats')
      setStats(response.data)
    } catch (error) {
      console.error('加载统计失败', error)
    }
  }

  const loadRecentInquiries = async () => {
    try {
      const response = await apiClient.get('/foreign-inquiries', {
        params: { limit: 5 },
      })
      setRecentInquiries(response.data.data)
    } catch (error) {
      console.error('加载询盘失败', error)
    }
  }

  const loadTopCountries = async () => {
    try {
      const response = await apiClient.get('/foreign-leads/stats', {
        params: { groupBy: 'country' },
      })
      setTopCountries(response.data.byCountry.slice(0, 5))
    } catch (error) {
      console.error('加载国家统计失败', error)
    }
  }

  const inquiryColumns = [
    {
      title: '询盘编号',
      dataIndex: 'inquiryNo',
      key: 'inquiryNo',
    },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: '国家',
      dataIndex: ['customer', 'country'],
      key: 'country',
      render: (country: string) => <Tag>{country}</Tag>,
    },
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          new: 'blue',
          reading: 'orange',
          quoted: 'purple',
          negotiated: 'cyan',
          won: 'green',
          lost: 'red',
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
  ]

  return (
    <div className="p-4">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="外贸线索"
              value={stats.totalLeads}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="外贸客户"
              value={stats.totalCustomers}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="询盘数量"
              value={stats.totalInquiries}
              prefix={<MailOutlined />}
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
                <RiseOutlined /> 较上月提升 3.2%
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="热门国家/地区">
            <div className="grid grid-cols-5 gap-4">
              {topCountries.map((item: any, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-brand-blue">{item.count}</div>
                  <div className="text-sm text-gray-500 truncate">{item.country}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近询盘 */}
      <Card title="最近询盘">
        <Table
          columns={inquiryColumns}
          dataSource={recentInquiries}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  )
}

export default ForeignDashboard
