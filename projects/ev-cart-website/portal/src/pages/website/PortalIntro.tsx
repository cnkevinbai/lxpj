import { Card, Row, Col, Typography, Button, Space, Statistic, Progress, Tag } from 'antd'
import { Link } from 'react-router-dom'
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CloudServerOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  MobileOutlined,
  SecurityScanOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const PortalIntro = () => {
  // 系统模块统计
  const systemStats = [
    { name: 'CRM', modules: 10, progress: 92, color: '#1890ff', icon: <TeamOutlined /> },
    { name: 'ERP', modules: 10, progress: 88, color: '#52c41a', icon: <AppstoreOutlined /> },
    { name: '财务', modules: 6, progress: 82, color: '#faad14', icon: <CloudServerOutlined /> },
    { name: '外贸', modules: 8, progress: 85, color: '#722ed1', icon: <GlobalOutlined /> },
    { name: '售后', modules: 6, progress: 99, color: '#13c2c2', icon: <CloudServerOutlined /> },
    { name: 'HR', modules: 6, progress: 82, color: '#eb2f96', icon: <TeamOutlined /> },
    { name: 'CMS', modules: 6, progress: 82, color: '#f5222d', icon: <MobileOutlined /> },
    { name: '消息', modules: 6, progress: 90, color: '#fa8c16', icon: <ThunderboltOutlined /> },
  ]

  // 核心特性
  const features = [
    {
      icon: '🔐',
      title: '统一认证',
      desc: '单点登录（SSO），一次登录访问所有系统',
    },
    {
      icon: '👥',
      title: '权限管理',
      desc: 'RBAC 角色权限控制，精细化访问管理',
    },
    {
      icon: '📊',
      title: '数据看板',
      desc: '统一工作台，实时掌握业务数据',
    },
    {
      icon: '🔄',
      title: '流程自动化',
      desc: '业财一体化，业务单据自动生成财务凭证',
    },
    {
      icon: '📱',
      title: '多端协同',
      desc: 'Web + APP + 鸿蒙，三端数据实时同步',
    },
    {
      icon: '🛡️',
      title: '安全可靠',
      desc: '数据加密、备份、审计，全方位安全保障',
    },
  ]

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        color: '#fff',
        textAlign: 'center',
      }}>
        <Title level={1} style={{ color: '#fff', fontSize: '48px', marginBottom: '16px' }}>
          <DashboardOutlined /> 业务管理系统
        </Title>
        <Paragraph style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          8 大核心系统，50+ 功能模块，455+ API 接口，全面覆盖企业经营管理
        </Paragraph>
      </div>

      {/* 系统入口 */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
          系统入口
        </Title>
        <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: '48px' }}>
          点击下方系统卡片，进入相应的业务管理系统
        </Paragraph>

        <Row gutter={[32, 32]}>
          {systemStats.map((sys, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Link to={`/portal/${sys.name.toLowerCase() === 'crm' ? 'crm' : sys.name.toLowerCase()}`}>
                <Card
                  hoverable
                  style={{
                    textAlign: 'center',
                    height: '100%',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ fontSize: '56px', color: sys.color, marginBottom: '20px' }}>
                    {sys.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    {sys.name}系统
                  </Title>
                  <div style={{ marginBottom: '16px' }}>
                    <Tag color={sys.color}>{sys.modules} 个模块</Tag>
                  </div>
                  <Progress
                    percent={sys.progress}
                    strokeColor={sys.color}
                    format={() => `${sys.progress}% 完成`}
                    size="small"
                  />
                  <div style={{ marginTop: '16px' }}>
                    <Button type="primary" shape="round" size="small">
                      进入系统 <ArrowRightOutlined />
                    </Button>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* 核心特性 */}
      <div style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            核心特性
          </Title>
          <Row gutter={[48, 48]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  style={{
                    textAlign: 'center',
                    height: '100%',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '64px', marginBottom: '24px' }}>{feature.icon}</div>
                  <Title level={4} style={{ marginBottom: '12px' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: '#666' }}>
                    {feature.desc}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 系统架构 */}
      <div style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
            系统架构
          </Title>
          <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: '48px' }}>
            统一平台，模块化设计，灵活扩展
          </Paragraph>

          <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎨</div>
                  <Title level={3}>前端层</Title>
                  <Paragraph style={{ color: '#666' }}>
                    React 18 + Vite + TypeScript<br/>
                    Ant Design 5 组件库<br/>
                    响应式设计，全设备适配
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>⚙️</div>
                  <Title level={3}>后端层</Title>
                  <Paragraph style={{ color: '#666' }}>
                    NestJS 10 + TypeScript<br/>
                    Prisma ORM + PostgreSQL 15<br/>
                    RESTful API + WebSocket
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔒</div>
                  <Title level={3}>安全层</Title>
                  <Paragraph style={{ color: '#666' }}>
                    JWT 认证 + RBAC 权限<br/>
                    数据加密存储<br/>
                    审计日志 + 定期备份
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      {/* 数据统计 */}
      <div style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[48, 48]}>
            <Col xs={12} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>功能模块</span>}
                value={81}
                valueStyle={{ color: '#fff', fontSize: '48px', fontWeight: 'bold' }}
              />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>API 接口</span>}
                value={455}
                suffix={<span style={{ fontSize: '24px' }}>+</span>}
                valueStyle={{ color: '#fff', fontSize: '48px', fontWeight: 'bold' }}
              />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>数据表</span>}
                value={20}
                valueStyle={{ color: '#fff', fontSize: '48px', fontWeight: 'bold' }}
              />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>枚举类型</span>}
                value={25}
                valueStyle={{ color: '#fff', fontSize: '48px', fontWeight: 'bold' }}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* 完成度 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          系统完成度
        </Title>
        <Card style={{ border: 'none', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          {systemStats.map((sys, index) => (
            <div key={index} style={{ marginBottom: index === systemStats.length - 1 ? 0 : 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Space>
                  <span style={{ color: sys.color, fontSize: '20px' }}>{sys.icon}</span>
                  <strong>{sys.name}系统</strong>
                </Space>
                <span style={{ color: '#666' }}>{sys.modules} 个模块 · {sys.progress}%</span>
              </div>
              <Progress
                percent={sys.progress}
                strokeColor={sys.color}
                format={() => null}
              />
              <div style={{ marginTop: '8px', marginBottom: '24px' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <span style={{ color: '#666', fontSize: '14px' }}>核心功能已完成，可投入使用</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* CTA */}
      <div style={{
        padding: '80px 0',
        background: '#fff',
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
      }}>
        <Title level={2} style={{ marginBottom: '16px' }}>
          准备好体验了吗？
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
          立即登录业务管理系统，开启数字化转型之旅
        </Paragraph>
        <Space size="large">
          <Link to="/portal">
            <Button type="primary" size="large" shape="round">
              进入系统 <ArrowRightOutlined />
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large" shape="round">
              咨询演示
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  )
}

export default PortalIntro
