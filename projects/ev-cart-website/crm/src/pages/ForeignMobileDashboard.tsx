import React, { useState, useEffect } from 'react'
import { Card, Statistic, Row, Col, Button, List, Tag } from 'antd'
import {
  GlobalOutlined,
  MailOutlined,
  DollarOutlined,
  PlusOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/api'

/**
 * 外贸移动端仪表盘
 */
const ForeignMobileDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalInquiries: 0,
    totalOrders: 0,
    pendingFollowups: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/foreign/stats')
      setStats(response.data)
    } catch (error) {
      console.error('加载统计失败', error)
    }
  }

  const quickActions = [
    {
      icon: <PlusOutlined />,
      label: '录入线索',
      action: () => navigate('/crm/foreign-leads/create'),
    },
    {
      icon: <MailOutlined />,
      label: '新建询盘',
      action: () => navigate('/crm/foreign-inquiries/create'),
    },
    {
      icon: <WhatsAppOutlined />,
      label: 'WhatsApp 联系',
      action: () => window.open('https://wa.me/', '_blank'),
    },
    {
      icon: <DollarOutlined />,
      label: '新建订单',
      action: () => navigate('/crm/foreign-orders/create'),
    },
  ]

  return (
    <div className="p-4">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="外贸线索"
              value={stats.totalLeads}
              prefix={<GlobalOutlined />}
              valueStyle={{ fontSize: 20, color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="询盘数量"
              value={stats.totalInquiries}
              prefix={<MailOutlined />}
              valueStyle={{ fontSize: 20, color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="订单金额"
              value={stats.totalOrders}
              prefix={<DollarOutlined />}
              valueStyle={{ fontSize: 20, color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="待跟进"
              value={stats.pendingFollowups}
              valueStyle={{ fontSize: 20, color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" className="mb-4">
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center p-2"
            >
              <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mb-2">
                {action.icon}
              </div>
              <span className="text-xs text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* 最近询盘 */}
      <Card title="最近询盘">
        <List
          size="small"
          dataSource={[]}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={item.subject}
                description={
                  <div className="flex justify-between">
                    <span>{item.customer?.name}</span>
                    <Tag>{item.customer?.country}</Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default ForeignMobileDashboard
