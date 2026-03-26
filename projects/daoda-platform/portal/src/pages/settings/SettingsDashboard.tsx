/**
 * 系统设置仪表盘
 */
import { Row, Col, Card, Typography, Button, Space } from 'antd'
import {
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  ToolOutlined,
  ApiOutlined,
  MenuOutlined,
  KeyOutlined,
  FileSearchOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const moduleEntries = [
  {
    key: 'users',
    title: '用户管理',
    description: '用户账号、用户信息、用户状态',
    icon: <UserOutlined style={{ fontSize: 28 }} />,
    color: '#1890ff',
    path: '/settings/users',
    stats: { label: '用户总数', value: 45 },
  },
  {
    key: 'roles',
    title: '角色管理',
    description: '角色定义、权限分配、角色成员',
    icon: <TeamOutlined style={{ fontSize: 28 }} />,
    color: '#52c41a',
    path: '/settings/roles',
    stats: { label: '角色数', value: 8 },
  },
  {
    key: 'tenants',
    title: '租户管理',
    description: '租户信息、租户配置、租户套餐',
    icon: <BankOutlined style={{ fontSize: 28 }} />,
    color: '#722ed1',
    path: '/settings/tenants',
    stats: { label: '租户数', value: 3 },
  },
  {
    key: 'menus',
    title: '菜单管理',
    description: '菜单配置、菜单权限、菜单排序',
    icon: <MenuOutlined style={{ fontSize: 28 }} />,
    color: '#13c2c2',
    path: '/settings/menus',
    stats: { label: '菜单项', value: 28 },
  },
  {
    key: 'modules',
    title: '模块管理',
    description: '业务模块、模块配置、模块状态',
    icon: <ToolOutlined style={{ fontSize: 28 }} />,
    color: '#fa8c16',
    path: '/settings/modules',
    stats: { label: '已启用', value: 6 },
  },
  {
    key: 'api-keys',
    title: 'API密钥',
    description: '密钥管理、权限控制、密钥监控',
    icon: <KeyOutlined style={{ fontSize: 28 }} />,
    color: '#eb2f96',
    path: '/settings/api-keys',
    stats: { label: '有效密钥', value: 2 },
  },
  {
    key: 'webhooks',
    title: 'Webhook',
    description: '事件订阅、回调配置、日志记录',
    icon: <ApiOutlined style={{ fontSize: 28 }} />,
    color: '#2f54eb',
    path: '/settings/webhooks',
    stats: { label: 'Webhook', value: 5 },
  },
  {
    key: 'logs',
    title: '系统日志',
    description: '操作日志、错误日志、访问日志',
    icon: <FileSearchOutlined style={{ fontSize: 28 }} />,
    color: '#8c8c8c',
    path: '/settings/logs',
    stats: { label: '今日日志', value: 156 },
  },
]

export default function SettingsDashboard() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="icon-btn" style={{ backgroundColor: '#f0f5ff', color: '#8c8c8c' }}>
            <SettingOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <Title level={4} className="page-header-title">系统设置</Title>
            <Text type="secondary">用户、角色、租户、配置管理</Text>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/settings/users')}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <UserOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">用户总数</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>45</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>3 待激活</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/settings/roles')}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <TeamOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">角色数量</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>8</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>系统角色</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/settings/modules')}>
            <div className="stat-icon" style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <ToolOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">已启用模块</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#fa8c16' }}>6</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#8c8c8c' }}>共 8 个模块</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="daoda-card stat-card" hoverable onClick={() => navigate('/settings/logs')}>
            <div className="stat-icon" style={{ backgroundColor: '#f0f5ff', color: '#8c8c8c' }}>
              <FileSearchOutlined />
            </div>
            <div className="stat-content">
              <Text type="secondary" className="stat-label">今日日志</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#8c8c8c' }}>156</Text>
              </div>
              <Text style={{ fontSize: 12, color: '#ff4d4f' }}>2 错误</Text>
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