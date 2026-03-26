import React from 'react'
import { Card, Row, Col, Statistic, Progress, Tag, Space, Button, Avatar, Timeline, Badge } from 'antd'
import {
  MobileOutlined,
  DashboardOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons'

const MobileDashboard: React.FC = () => {
  const quickActions = [
    { icon: <CheckCircleOutlined />, label: '完成工单', color: '#52c41a', count: 12 },
    { icon: <ClockCircleOutlined />, label: '待跟进', color: '#faad14', count: 8 },
    { icon: <BellOutlined />, label: '新通知', color: '#1890ff', count: 5 },
    { icon: <StarOutlined />, label: '重点客户', color: '#722ed1', count: 3 },
  ]

  const recentActivities = [
    { time: '10:30', event: '完成了服务单 SV20260313001', user: '王师傅' },
    { time: '10:15', event: '新建客户 某某科技公司', user: '销售 A' },
    { time: '09:50', event: '提交了订单 ORD20260313001', user: '销售 B' },
    { time: '09:30', event: '处理了客户投诉', user: '客服 A' },
    { time: '09:00', event: '开始了今日工作', user: '系统' },
  ]

  const topProducts = [
    { name: '智能换电柜 V3', sales: 350, revenue: 525, trend: 'up' },
    { name: '锂电池 48V', sales: 1200, revenue: 144, trend: 'up' },
    { name: '智能换电柜 V2', sales: 180, revenue: 216, trend: 'down' },
  ]

  return (
    <div style={{ padding: 16, background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部状态栏 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>移动工作台</h2>
            <p style={{ color: '#666', fontSize: 14 }}>随时随地处理业务</p>
          </div>
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          </Badge>
        </div>
      </Card>

      {/* 快捷操作 */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        {quickActions.map((action, index) => (
          <Col span={6} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => {}}
            >
              <div style={{ color: action.color, fontSize: 32, marginBottom: 8 }}>
                {action.icon}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{action.count}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{action.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 核心指标 */}
      <Card title="📊 今日数据" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="销售额"
              value={45.8}
              precision={1}
              prefix="¥"
              suffix="万"
              valueStyle={{ fontSize: 20, color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="订单数"
              value={28}
              suffix="单"
              valueStyle={{ fontSize: 20, color: '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="新增客户"
              value={5}
              suffix="个"
              valueStyle={{ fontSize: 20, color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 动态和排行 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="📝 最近动态">
            <Timeline
              items={recentActivities.map((item) => ({
                color: 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.event}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {item.time} - {item.user}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="🏆 产品排行">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                style={{
                  padding: '12px 0',
                  borderBottom: index < topProducts.length - 1 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: index === 0 ? '#faad14' : index === 1 ? '#73d13d' : '#1890ff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{product.name}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    销量 {product.sales} | 收入 ¥{product.revenue}万
                  </div>
                </div>
                <div style={{ color: product.trend === 'up' ? '#52c41a' : '#ff4d4f' }}>
                  {product.trend === 'up' ? '↑' : '↓'}
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default MobileDashboard
