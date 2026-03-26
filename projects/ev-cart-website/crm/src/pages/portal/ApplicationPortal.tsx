import React from 'react'
import { Card, Row, Col, Button, Space, Input, Avatar, Badge } from 'antd'
import { CheckCircleOutlined, StarOutlined } from '@ant-design/icons'
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  DollarOutlined,
  BuildOutlined,
  ToolOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  GlobalOutlined,
  CloudOutlined,
  RocketOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons'

const ApplicationPortal: React.FC = () => {
  const applications = [
    {
      category: '业务系统',
      apps: [
        {
          name: 'CRM 客户管理',
          icon: <TeamOutlined />,
          color: '#1890ff',
          desc: '客户关系管理与销售自动化',
          status: 'running',
          path: '/customers',
        },
        {
          name: '销售管理',
          icon: <ShoppingCartOutlined />,
          color: '#52c41a',
          desc: '销售流程与商机管理',
          status: 'running',
          path: '/opportunities',
        },
        {
          name: '服务管理',
          icon: <ToolOutlined />,
          color: '#faad14',
          desc: '售后服务与客户支持',
          status: 'running',
          path: '/service',
        },
      ],
    },
    {
      category: 'ERP 系统',
      apps: [
        {
          name: '生产管理',
          icon: <BuildOutlined />,
          color: '#722ed1',
          desc: '生产计划与制造执行',
          status: 'running',
          path: '/production-orders',
        },
        {
          name: '采购管理',
          icon: <ShoppingCartOutlined />,
          color: '#13c2c2',
          desc: '供应商与采购订单',
          status: 'running',
          path: '/purchase',
        },
        {
          name: '库存管理',
          icon: <CloudOutlined />,
          color: '#eb2f96',
          desc: '库存查询与调拨',
          status: 'running',
          path: '/inventory',
        },
      ],
    },
    {
      category: '财务系统',
      apps: [
        {
          name: '财务管理',
          icon: <DollarOutlined />,
          color: '#fa8c16',
          desc: '财务核算与资金管理',
          status: 'running',
          path: '/finance',
        },
        {
          name: '成本管理',
          icon: <BarChartOutlined />,
          color: '#2f54eb',
          desc: '成本核算与分析',
          status: 'running',
          path: '/cost-accounting',
        },
        {
          name: '资产管理',
          icon: <FileTextOutlined />,
          color: '#1890ff',
          desc: '固定资产管理',
          status: 'running',
          path: '/assets',
        },
      ],
    },
    {
      category: '售后服务',
      apps: [
        {
          name: '服务工单',
          icon: <ToolOutlined />,
          color: '#fa8c16',
          desc: '服务工单管理',
          status: 'running',
          path: '/service',
        },
        {
          name: '服务流程',
          icon: <CheckCircleOutlined />,
          color: '#52c41a',
          desc: '全流程可视化',
          status: 'running',
          path: '/service-process',
        },
        {
          name: '客户评价',
          icon: <StarOutlined />,
          color: '#722ed1',
          desc: '满意度管理',
          status: 'running',
          path: '/customer-feedback',
        },
      ],
    },
    {
      category: '管理系统',
      apps: [
        {
          name: '数据报表',
          icon: <BarChartOutlined />,
          color: '#52c41a',
          desc: '数据分析与决策支持',
          status: 'running',
          path: '/reports-center',
        },
        {
          name: '系统设置',
          icon: <SettingOutlined />,
          color: '#8c8c8c',
          desc: '系统配置与权限管理',
          status: 'running',
          path: '/settings',
        },
        {
          name: '官网管理',
          icon: <GlobalOutlined />,
          color: '#722ed1',
          desc: '集团官网内容管理',
          status: 'running',
          path: '/website',
        },
      ],
    },
  ]

  const quickStats = [
    { label: '今日待办', value: 12, color: '#1890ff' },
    { label: '待处理工单', value: 5, color: '#faad14' },
    { label: '待审批', value: 3, color: '#52c41a' },
    { label: '系统通知', value: 8, color: '#722ed1' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 顶部导航 */}
      <div style={{
        height: 64,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
            ⚡ EV CART GROUP
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
            企业应用门户
          </div>
        </div>
        
        <Space size={24} style={{ color: 'white' }}>
          <Input.Search
            placeholder="搜索应用、功能..."
            prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
            style={{ width: 300, background: 'rgba(255,255,255,0.1)', borderRadius: 20 }}
            allowClear
          />
          <Badge count={8} size="small">
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: 14 }}>管理员</span>
        </Space>
      </div>

      {/* 快捷统计 */}
      <div style={{ padding: '40px 40px 20px' }}>
        <Row gutter={16}>
          {quickStats.map((stat, index) => (
            <Col span={6} key={index}>
              <Card
                hoverable
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  color: 'white',
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>{stat.label}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 应用列表 */}
      <div style={{ padding: '40px' }}>
        {applications.map((category, catIndex) => (
          <div key={catIndex} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'white',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <RocketOutlined />
              {category.category}
            </h2>
            <Row gutter={24}>
              {category.apps.map((app, appIndex) => (
                <Col span={8} key={appIndex}>
                  <Card
                    hoverable
                    onClick={() => window.location.href = app.path}
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: 12,
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: app.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        color: 'white',
                        flexShrink: 0,
                      }}>
                        {app.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                            {app.name}
                          </h3>
                          <Badge color={app.status === 'running' ? '#52c41a' : '#d9d9d9'} />
                        </div>
                        <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                          {app.desc}
                        </p>
                        <div style={{ marginTop: 12 }}>
                          <Button
                            type="primary"
                            size="small"
                            style={{
                              background: app.color,
                              border: 'none',
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              window.location.href = app.path
                            }}
                          >
                            进入系统
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>

      {/* 页脚 */}
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <p>© 2026 道达智能集团 | 企业应用门户 v1.0</p>
        <p style={{ fontSize: 12, marginTop: 8 }}>
          技术支持：IT 部门 | 联系电话：400-888-8888
        </p>
      </div>
    </div>
  )
}

export default ApplicationPortal
