import { Card, Row, Col, Collapse, Typography, Button, Space, Tag, List } from 'antd'
import { Link } from 'react-router-dom'
import {
  CustomerServiceOutlined,
  BookOutlined,
  FileTextOutlined,
  PhoneOutlined,
  DownloadOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { Panel } = Collapse

const Service = () => {
  // 服务支持内容
  const services = [
    {
      icon: <CustomerServiceOutlined style={{ fontSize: '48px' }} />,
      color: '#1890ff',
      title: '在线客服',
      desc: '7×24 小时在线支持，快速响应您的问题',
      features: ['即时聊天', '远程协助', '问题跟踪', '满意度评价'],
      link: '/portal/aftersales',
    },
    {
      icon: <PhoneOutlined style={{ fontSize: '48px' }} />,
      color: '#52c41a',
      title: '电话支持',
      desc: '专业客服团队，提供电话咨询服务',
      features: ['400 热线', '技术专家', '快速响应', '问题解决'],
      phone: '400-888-8888',
    },
    {
      icon: <BookOutlined style={{ fontSize: '48px' }} />,
      color: '#faad14',
      title: '帮助文档',
      desc: '详细的产品文档和使用指南',
      features: ['产品手册', '操作指南', '最佳实践', '常见问题'],
      link: '/docs',
    },
    {
      icon: <VideoCameraOutlined style={{ fontSize: '48px' }} />,
      color: '#722ed1',
      title: '培训视频',
      desc: '系统化视频教程，快速上手',
      features: ['入门教程', '进阶培训', '功能详解', '案例演示'],
      link: '/videos',
    },
  ]

  // 常见问题
  const faqs = [
    {
      question: '如何开始使用系统？',
      answer: '注册账号后，您可以立即登录系统体验。我们提供新手引导，帮助您快速熟悉系统功能。如需帮助，可联系在线客服或拨打 400 热线。',
    },
    {
      question: '系统支持哪些浏览器？',
      answer: '系统支持主流浏览器，包括 Chrome 90+、Firefox 88+、Safari 14+、Edge 90+。建议使用最新版本的 Chrome 浏览器以获得最佳体验。',
    },
    {
      question: '数据安全性如何保障？',
      answer: '我们采用多重安全措施：JWT 认证 + RBAC 权限控制、数据加密存储、定期备份、安全审计日志等，全方位保障您的数据安全。',
    },
    {
      question: '是否提供定制化开发？',
      answer: '是的，我们提供定制化开发服务。根据您的需求，我们可以定制功能模块、界面风格、业务流程等。请联系销售团队获取详细方案。',
    },
    {
      question: '如何申请成为经销商？',
      answer: '您可以在"经销商加盟"页面在线提交申请，我们将在 1-3 个工作日内与您联系。也可以直接拨打招商热线咨询。',
    },
    {
      question: '系统支持移动端吗？',
      answer: '支持！我们提供 Web 端、手机 APP 和鸿蒙 APP，三端数据实时同步，随时随地办公。',
    },
  ]

  // 下载资源
  const resources = [
    { name: '产品手册 v3.0', type: 'PDF', size: '15.2 MB', downloads: '1,234' },
    { name: '快速入门指南', type: 'PDF', size: '3.8 MB', downloads: '2,567' },
    { name: 'API 接口文档', type: 'PDF', size: '8.5 MB', downloads: '892' },
    { name: '系统部署手册', type: 'PDF', size: '12.1 MB', downloads: '654' },
    { name: '用户操作视频', type: 'MP4', size: '256 MB', downloads: '3,421' },
    { name: '功能演示视频', type: 'MP4', size: '189 MB', downloads: '2,890' },
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
          <CustomerServiceOutlined /> 服务支持
        </Title>
        <Paragraph style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          全方位的服务支持体系，为您的使用保驾护航
        </Paragraph>
      </div>

      {/* 服务方式 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          服务方式
        </Title>
        <Row gutter={[32, 32]}>
          {services.map((service, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ color: service.color, marginBottom: '20px' }}>
                  {service.icon}
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  {service.title}
                </Title>
                <Paragraph style={{ color: '#666', marginBottom: '20px' }}>
                  {service.desc}
                </Paragraph>
                <div style={{ marginBottom: '24px' }}>
                  {service.features.map((feature, i) => (
                    <Tag key={i} color={service.color} style={{ margin: '4px' }}>
                      {feature}
                    </Tag>
                  ))}
                </div>
                {service.link && (
                  <Link to={service.link}>
                    <Button type="primary" shape="round" size="small">
                      立即体验 <ArrowRightOutlined />
                    </Button>
                  </Link>
                )}
                {service.phone && (
                  <Paragraph style={{ fontSize: '20px', fontWeight: 'bold', color: service.color, margin: 0 }}>
                    {service.phone}
                  </Paragraph>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 下载资源 */}
      <div style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
            <DownloadOutlined /> 下载资源
          </Title>
          <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: '48px' }}>
            产品手册、操作指南、培训视频等资源下载
          </Paragraph>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title={<><FileTextOutlined /> 文档资料</>} size="small">
                <List
                  size="small"
                  dataSource={resources.filter(r => r.type === 'PDF')}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small" icon={<DownloadOutlined />}>
                          下载
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={`${item.type} · ${item.size} · 下载 ${item.downloads} 次`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={<><VideoCameraOutlined /> 培训视频</>} size="small">
                <List
                  size="small"
                  dataSource={resources.filter(r => r.type === 'MP4')}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small" icon={<DownloadOutlined />}>
                          下载
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={`${item.type} · ${item.size} · 下载 ${item.downloads} 次`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Button size="large" shape="round">
              查看全部资源 <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>

      {/* 常见问题 */}
      <div style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
            <QuestionCircleOutlined /> 常见问题
          </Title>
          <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: '48px' }}>
            快速找到您需要的答案
          </Paragraph>

          <Collapse
            defaultActiveKey={['1']}
            size="large"
            style={{ borderRadius: '12px' }}
          >
            {faqs.map((faq, index) => (
              <Panel
                header={
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    {faq.question}
                  </span>
                }
                key={String(index + 1)}
              >
                <Paragraph style={{ fontSize: '15px', lineHeight: 1.8, color: '#666' }}>
                  {faq.answer}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Paragraph type="secondary">
              没有找到答案？<Link to="/contact">联系客服</Link> 或 <Link to="/portal/aftersales">提交工单</Link>
            </Paragraph>
          </div>
        </div>
      </div>

      {/* 服务流程 */}
      <div style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            服务流程
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  1
                </div>
                <Title level={4}>提交问题</Title>
                <Paragraph style={{ color: '#666' }}>
                  在线客服、电话、工单系统
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  2
                </div>
                <Title level={4}>问题受理</Title>
                <Paragraph style={{ color: '#666' }}>
                  客服确认问题，分配专业人员
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  3
                </div>
                <Title level={4}>问题解决</Title>
                <Paragraph style={{ color: '#666' }}>
                  技术人员处理，实时反馈进度
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  4
                </div>
                <Title level={4}>满意度评价</Title>
                <Paragraph style={{ color: '#666' }}>
                  问题解决后，邀请评价反馈
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        textAlign: 'center',
      }}>
        <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>
          需要更多帮助？
        </Title>
        <Paragraph style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.95 }}>
          我们的专业团队随时为您服务
        </Paragraph>
        <Space size="large">
          <Link to="/contact">
            <Button type="primary" size="large" shape="round" style={{ background: '#fff', color: '#667eea', border: 'none' }}>
              联系客服
            </Button>
          </Link>
          <Link to="/portal/aftersales">
            <Button size="large" shape="round" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '2px solid #fff' }}>
              提交工单
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  )
}

export default Service
