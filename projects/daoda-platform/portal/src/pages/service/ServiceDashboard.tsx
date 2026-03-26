/**
 * 售后服务仪表盘
 */
import { Row, Col, Card, Typography, Button } from 'antd'
import {
  CustomerServiceOutlined,
  ToolOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const moduleEntries = [
  {
    key: 'tickets',
    title: '工单管理',
    description: '服务工单、派单、处理进度',
    icon: <ToolOutlined style={{ fontSize: 28 }} />,
    color: '#13c2c2',
    path: '/service/tickets',
    stats: [
      { label: '待处理', value: 23 },
      { label: '今日完成', value: 8 },
    ],
  },
  {
    key: 'contracts',
    title: '合同管理',
    description: '服务合同、合同续签、合同到期',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#722ed1',
    path: '/service/contracts',
    stats: [
      { label: '有效合同', value: 56 },
      { label: '即将到期', value: 5 },
    ],
  },
  {
    key: 'parts',
    title: '配件管理',
    description: '配件库存、配件申请、配件出库',
    icon: <AppstoreOutlined style={{ fontSize: 28 }} />,
    color: '#fa8c16',
    path: '/service/parts',
    stats: [
      { label: '配件种类', value: 128 },
      { label: '库存预警', value: 12 },
    ],
  },
]

export default function ServiceDashboard() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="icon-btn" style={{ backgroundColor: '#e6fffb', color: '#13c2c2' }}>
            <CustomerServiceOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <Title level={4} className="page-header-title">售后服务</Title>
            <Text type="secondary">工单、合同、配件管理</Text>
          </div>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/service/tickets')}>
            新建工单
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/service/contracts')}>
            新建合同
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/service/tickets')}>
            <div className="stat-icon" style={{ backgroundColor: '#e6fffb', color: '#13c2c2' }}>
              <ToolOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">待处理工单</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#13c2c2' }}>23</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#faad14' }}>今日新增 5</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/service/tickets')}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <ToolOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">今日完成</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>8</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>满意度 98%</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/service/contracts')}>
            <div className="stat-icon" style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
              <FileTextOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">有效合同</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#722ed1' }}>56</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#ff4d4f' }}>5份即将到期</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/service/parts')}>
            <div className="stat-icon" style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <AppstoreOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">配件种类</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#fa8c16' }}>128</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#ff4d4f' }}>12项库存预警</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="daoda-card" title="功能模块">
        <Row gutter={[16, 16]}>
          {moduleEntries.map((entry) => (
            <Col xs={24} sm={12} md={8} key={entry.key}>
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