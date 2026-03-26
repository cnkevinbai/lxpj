/**
 * ERP 运营管理仪表盘
 * 统一UI风格
 */
import { Row, Col, Card, Typography, Button } from 'antd'
import {
  ShopOutlined,
  ShoppingOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

// 模块功能入口
const moduleEntries = [
  {
    key: 'purchase',
    title: '采购管理',
    description: '采购申请、采购订单、供应商管理',
    icon: <ShoppingOutlined style={{ fontSize: 28 }} />,
    color: '#1890ff',
    path: '/erp/purchase',
    stats: [
      { label: '待审批', value: 5 },
      { label: '本月采购', value: '¥128万' },
    ],
  },
  {
    key: 'inventory',
    title: '库存管理',
    description: '库存查询、出入库、库存预警',
    icon: <HomeOutlined style={{ fontSize: 28 }} />,
    color: '#52c41a',
    path: '/erp/inventory',
    stats: [
      { label: '库存品类', value: 156 },
      { label: '预警', value: 8 },
    ],
  },
  {
    key: 'production',
    title: '生产管理',
    description: '生产计划、生产工单、生产进度',
    icon: <ThunderboltOutlined style={{ fontSize: 28 }} />,
    color: '#722ed1',
    path: '/erp/production',
    stats: [
      { label: '进行中', value: 12 },
      { label: '平均进度', value: '68%' },
    ],
  },
  {
    key: 'products',
    title: '产品管理',
    description: '产品档案、规格管理、价格管理',
    icon: <AppstoreOutlined style={{ fontSize: 28 }} />,
    color: '#13c2c2',
    path: '/erp/products',
    stats: [
      { label: '产品总数', value: 89 },
      { label: '在售', value: 76 },
    ],
  },
  {
    key: 'bom',
    title: '物料清单',
    description: 'BOM管理、物料构成、成本核算',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#fa8c16',
    path: '/erp/bom',
    stats: [
      { label: 'BOM数量', value: 45 },
      { label: '启用', value: 42 },
    ],
  },
  {
    key: 'production-plans',
    title: '生产计划',
    description: '计划编制、计划审批、计划跟踪',
    icon: <FileTextOutlined style={{ fontSize: 28 }} />,
    color: '#eb2f96',
    path: '/erp/production-plans',
    stats: [
      { label: '进行中', value: 3 },
      { label: '待审批', value: 1 },
    ],
  },
]

// 快捷操作
const quickActions = [
  { key: 'new-purchase', label: '新建采购单', icon: <PlusOutlined />, path: '/erp/purchase' },
  { key: 'stock-in', label: '入库登记', icon: <PlusOutlined />, path: '/erp/inventory' },
  { key: 'new-production', label: '新建生产单', icon: <PlusOutlined />, path: '/erp/production' },
]

export default function ERPDashboard() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <div 
            className="icon-btn"
            style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}
          >
            <ShopOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <Title level={4} className="page-header-title">运营管理</Title>
            <Text type="secondary">采购、库存、生产一体化管理</Text>
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
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/erp/purchase')}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <ShoppingOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">采购订单</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>42</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#faad14' }}>5笔待审批</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/erp/inventory')}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <HomeOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">库存品类</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>156</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#ff4d4f' }}>8项预警</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/erp/production')}>
            <div className="stat-icon" style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
              <ThunderboltOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">生产工单</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#722ed1' }}>12</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>平均进度 68%</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/erp/products')}>
            <div className="stat-icon" style={{ backgroundColor: '#e6fffb', color: '#13c2c2' }}>
              <AppstoreOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">产品总数</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#13c2c2' }}>89</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>76个在售</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 功能模块入口 */}
      <Card className="daoda-card" title="功能模块" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {moduleEntries.map((entry) => (
            <Col xs={24} sm={12} md={8} lg={6} key={entry.key}>
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