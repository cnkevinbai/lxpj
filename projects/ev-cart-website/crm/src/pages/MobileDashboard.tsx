import React from 'react'
import { Card, Statistic, Row, Col, Button, List } from 'antd'
import {
  TeamOutlined,
  InboxOutlined,
  OpportunityOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  ScanOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

/**
 * 移动端仪表盘
 * 支持业务员移动端办公
 */
const MobileDashboard: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: <PlusOutlined />,
      label: '录入线索',
      action: () => navigate('/crm/leads/create'),
    },
    {
      icon: <TeamOutlined />,
      label: '新建客户',
      action: () => navigate('/crm/customers/create'),
    },
    {
      icon: <ScanOutlined />,
      label: '扫码录入',
      action: () => navigate('/crm/scan'),
    },
    {
      icon: <OpportunityOutlined />,
      label: '新建商机',
      action: () => navigate('/crm/opportunities/create'),
    },
  ]

  return (
    <div className="p-4">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="我的线索"
              value={28}
              prefix={<InboxOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="我的客户"
              value={56}
              prefix={<TeamOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="我的商机"
              value={15}
              prefix={<OpportunityOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="我的订单"
              value={8}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ fontSize: 20 }}
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

      {/* 待办事项 */}
      <Card title="待办事项">
        <List
          size="small"
          dataSource={[
            { id: 1, title: '跟进张三的询价', time: '今天 14:00' },
            { id: 2, title: '拜访李总公司', time: '明天 10:00' },
            { id: 3, title: '提交王五的方案', time: '后天 16:00' },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.time}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default MobileDashboard
