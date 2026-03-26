/**
 * 财务管理模块主页
 * 统一UI风格
 */
import { Row, Col, Card, Typography, Button } from 'antd'
import {
  DollarOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  WalletOutlined,
  PlusOutlined,
  AuditOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

// 模块功能入口
const moduleEntries = [
  {
    key: 'overview',
    title: '财务概览',
    description: '财务数据一览、经营分析',
    icon: <AuditOutlined style={{ fontSize: 28 }} />,
    color: '#1890ff',
    path: '/finance/overview',
    stats: [
      { label: '本月营收', value: '¥256万' },
      { label: '同比增长', value: '+18%' },
    ],
  },
  {
    key: 'receivables',
    title: '应收管理',
    description: '应收账款、收款登记、账龄分析',
    icon: <WalletOutlined style={{ fontSize: 28 }} />,
    color: '#52c41a',
    path: '/finance/receivables',
    stats: [
      { label: '应收金额', value: '¥89万' },
      { label: '待收款', value: 23 },
    ],
  },
  {
    key: 'payables',
    title: '应付管理',
    description: '应付账款、付款申请、供应商结算',
    icon: <CreditCardOutlined style={{ fontSize: 28 }} />,
    color: '#fa8c16',
    path: '/finance/payables',
    stats: [
      { label: '应付金额', value: '¥56万' },
      { label: '待付款', value: 15 },
    ],
  },
  {
    key: 'invoices',
    title: '发票管理',
    description: '开票申请、发票查询、发票核销',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#722ed1',
    path: '/finance/invoices',
    stats: [
      { label: '本月开票', value: 68 },
      { label: '待开票', value: 12 },
    ],
  },
]

// 快捷操作
const quickActions = [
  { key: 'new-receivable', label: '新增应收', icon: <PlusOutlined />, path: '/finance/receivables' },
  { key: 'new-payable', label: '新增应付', icon: <PlusOutlined />, path: '/finance/payables' },
  { key: 'new-invoice', label: '开票申请', icon: <PlusOutlined />, path: '/finance/invoices' },
]

export default function FinanceDashboard() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <div 
            className="icon-btn"
            style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}
          >
            <DollarOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <Title level={4} className="page-header-title">财务管理</Title>
            <Text type="secondary">应收应付、发票、财务分析</Text>
          </div>
        </div>
        <div className="page-header-actions">
          {quickActions.map((action) => (
            <Button 
              key={action.key}
              type="primary"
              icon={action.icon}
              onClick={() => navigate(action.path)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 数据统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/finance/overview')}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <DollarOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">本月营收</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>256</Text>
                <Text type="secondary">万</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>+18% 较上月</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/finance/receivables')}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <WalletOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">应收账款</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>89</Text>
                <Text type="secondary">万</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>23笔待收款</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/finance/payables')}>
            <div className="stat-icon" style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <CreditCardOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">应付账款</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#fa8c16' }}>56</Text>
                <Text type="secondary">万</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>15笔待付款</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/finance/invoices')}>
            <div className="stat-icon" style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
              <FileTextOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">本月开票</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#722ed1' }}>68</Text>
                <Text type="secondary">张</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#faad14' }}>12张待开票</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 功能模块入口 */}
      <Card className="daoda-card" title="功能模块" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {moduleEntries.map((entry) => (
            <Col xs={24} sm={12} md={6} key={entry.key}>
              <div 
                className="module-card"
                onClick={() => navigate(entry.path)}
              >
                <div className="module-card-header">
                  <div 
                    className="module-card-icon"
                    style={{ backgroundColor: `${entry.color}15`, color: entry.color }}
                  >
                    {entry.icon}
                  </div>
                  <div className="module-card-info">
                    <Text strong>{entry.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{entry.description}</Text>
                  </div>
                </div>
                <div className="module-card-stats">
                  {entry.stats.map((stat, index) => (
                    <div key={index} className="module-card-stat">
                      <Text type="secondary" style={{ fontSize: 12 }}>{stat.label}</Text>
                      <Text strong style={{ color: entry.color }}>{stat.value}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}