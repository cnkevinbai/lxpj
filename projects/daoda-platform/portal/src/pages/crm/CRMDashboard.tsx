/**
 * CRM 客户管理仪表盘
 */
import { Row, Col, Card, Typography, Button, Space } from 'antd'
import {
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const moduleEntries = [
  {
    key: 'customers',
    title: '客户管理',
    description: '客户档案、联系人、跟进记录',
    icon: <TeamOutlined style={{ fontSize: 28 }} />,
    color: '#1890ff',
    path: '/crm/customers',
    stats: { label: '客户总数', value: 128 },
  },
  {
    key: 'leads',
    title: '线索管理',
    description: '销售线索、线索转化',
    icon: <UserOutlined style={{ fontSize: 28 }} />,
    color: '#52c41a',
    path: '/crm/leads',
    stats: { label: '待跟进', value: 23 },
  },
  {
    key: 'opportunities',
    title: '商机管理',
    description: '商机跟进、销售漏斗',
    icon: <ShoppingCartOutlined style={{ fontSize: 28 }} />,
    color: '#722ed1',
    path: '/crm/opportunities',
    stats: { label: '进行中', value: 15 },
  },
  {
    key: 'orders',
    title: '订单管理',
    description: '销售订单、订单跟踪',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#fa8c16',
    path: '/crm/orders',
    stats: { label: '待处理', value: 8 },
  },
  {
    key: 'quotations',
    title: '报价管理',
    description: '报价单、价格审批',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#13c2c2',
    path: '/crm/quotations',
    stats: { label: '待报价', value: 5 },
  },
]

export default function CRMDashboard() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="icon-btn" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
            <TeamOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <Title level={4} className="page-header-title">客户管理</Title>
            <Text type="secondary">客户关系管理全流程</Text>
          </div>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/crm/customers')}>
            新建客户
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/crm/leads')}>
            新建线索
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/crm/customers')}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <TeamOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">客户总数</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>128</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>+12% 本月</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/crm/leads')}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <UserOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">待跟进线索</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>23</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>今日新增 5</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/crm/opportunities')}>
            <div className="stat-icon" style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
              <ShoppingCartOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">进行中商机</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#722ed1' }}>15</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>金额 ¥256万</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/crm/orders')}>
            <div className="stat-icon" style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <FileTextOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">本月订单</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#fa8c16' }}>56</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>+8% 较上月</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="daoda-card" title="功能模块">
        <Row gutter={[16, 16]}>
          {moduleEntries.map((entry) => (
            <Col xs={24} sm={12} md={8} lg={6} key={entry.key}>
              <div className="module-card" onClick={() => navigate(entry.path)}>
                <div className="module-card-header">
                  <div className="module-card-icon" style={{ backgroundColor: `${entry.color}15`, color: entry.color }}>
                    {entry.icon}
                  </div>
                  <div className="module-card-info">
                    <Text strong>{entry.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{entry.description}</Text>
                  </div>
                </div>
                <div className="module-card-stats">
                  <div className="module-card-stat">
                    <Text type="secondary" style={{ fontSize: 12 }}>{entry.stats.label}</Text>
                    <Text strong style={{ color: entry.color }}>{entry.stats.value}</Text>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}