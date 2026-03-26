import { Typography, Card, Space, Avatar, Row, Col, Statistic } from 'antd'
import {
  TrophyOutlined,
  HeartOutlined,
  GlobalOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const About = () => {
  const stats = [
    { label: '服务企业', value: 500, suffix: '+' },
    { label: '功能模块', value: 81 },
    { label: 'API 接口', value: 455, suffix: '+' },
    { label: '用户满意度', value: 98, suffix: '%' },
  ]

  const team = [
    { name: '张三', role: '创始人 & CEO', avatar: '👨‍💼' },
    { name: '李四', role: '技术总监', avatar: '👨‍💻' },
    { name: '王五', role: '产品总监', avatar: '👩‍💼' },
    { name: '赵六', role: '销售总监', avatar: '👨‍💼' },
  ]

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <Title level={1} className="hero-title">关于道达智能</Title>
          <Paragraph className="hero-subtitle">
            专注于企业数字化转型，提供智能化业务管理系统
          </Paragraph>
        </div>
      </section>

      {/* 公司简介 */}
      <section className="company-intro">
        <div className="container">
          <Row gutter={48} align="middle">
            <Col xs={24} md={12}>
              <Title level={2}>公司简介</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                四川道达智能车辆制造有限公司是一家专注于新能源车辆研发、生产和销售的高新技术企业。
                公司总部位于四川眉山，在全国设有多个分支机构。
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                我们深耕新能源车辆行业多年，为 500+ 企业提供专业的产品和服务，
                涵盖观光车、巡逻车、高尔夫球车、无人驾驶车辆等多个领域。
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                公司拥有一支经验丰富、技术精湛的研发团队，采用先进的技术和工艺，
                为客户提供高品质、高性能的新能源车辆产品。
              </Paragraph>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'center' }}>
              <div className="intro-image">🏢</div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 企业文化 */}
      <section className="culture-section">
        <div className="container">
          <Title level={2} className="section-title">企业文化</Title>
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <Card className="culture-card">
                <div className="culture-icon">🎯</div>
                <Title level={3}>企业使命</Title>
                <Paragraph>让出行更简单、更高效、更环保</Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="culture-card">
                <div className="culture-icon">👁️</div>
                <Title level={3}>企业愿景</Title>
                <Paragraph>成为全球领先的新能源车辆制造商</Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="culture-card">
                <div className="culture-icon">💎</div>
                <Title level={3}>核心价值观</Title>
                <Paragraph>客户第一、诚信、创新、卓越</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[48, 48]}>
            {stats.map((stat, i) => (
              <Col xs={12} sm={6} key={i}>
                <div className="stat-item">
                  <Statistic
                    title={<span style={{ color: '#8C8C8C', fontSize: 16 }}>{stat.label}</span>}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: '#0066FF', fontSize: 48, fontWeight: 'bold' }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="advantages-section">
        <div className="container">
          <Title level={2} className="section-title">核心优势</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <Space size="large">
                  <TrophyOutlined style={{ fontSize: 48, color: '#FAAD14' }} />
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>行业经验丰富</Title>
                    <Paragraph style={{ margin: 0, color: '#8C8C8C' }}>深耕行业多年</Paragraph>
                  </div>
                </Space>
                <Paragraph style={{ marginTop: 16 }}>
                  服务 500+ 企业客户，积累了丰富的行业经验和最佳实践，
                  能够准确把握客户需求，提供针对性解决方案。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <Space size="large">
                  <TeamOutlined style={{ fontSize: 48, color: '#1890FF' }} />
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>技术实力雄厚</Title>
                    <Paragraph style={{ margin: 0, color: '#8C8C8C' }}>专业研发团队</Paragraph>
                  </div>
                </Space>
                <Paragraph style={{ marginTop: 16 }}>
                  拥有 50+ 人的专业研发团队，掌握核心技术和专利，
                  确保产品技术领先、性能卓越。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <Space size="large">
                  <HeartOutlined style={{ fontSize: 48, color: '#EB2F96' }} />
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>服务体系完善</Title>
                    <Paragraph style={{ margin: 0, color: '#8C8C8C' }}>7×24 小时服务</Paragraph>
                  </div>
                </Space>
                <Paragraph style={{ marginTop: 16 }}>
                  建立完善的售前、售中、售后服务体系，
                  快速响应客户需求，确保客户满意度。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <Space size="large">
                  <GlobalOutlined style={{ fontSize: 48, color: '#52C41A' }} />
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>全球服务网络</Title>
                    <Paragraph style={{ margin: 0, color: '#8C8C8C' }}>多地分支机构</Paragraph>
                  </div>
                </Space>
                <Paragraph style={{ marginTop: 16 }}>
                  在全国主要城市设有分支机构和服务网点，
                  产品出口海外多个国家，提供本地化服务。
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="team-section">
        <div className="container">
          <Title level={2} className="section-title">核心团队</Title>
          <Row gutter={[32, 32]}>
            {team.map((member, i) => (
              <Col xs={12} sm={6} key={i}>
                <Card className="team-card">
                  <div className="team-avatar">{member.avatar}</div>
                  <Title level={4} style={{ marginBottom: 8 }}>{member.name}</Title>
                  <Paragraph type="secondary">{member.role}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <style>{`
        .about-page { background: #F8F9FA; min-height: 100vh; }
        
        .about-hero {
          padding: 120px 0 80px;
          background: linear-gradient(135deg, #050505 0%, #0A0A0A 100%);
          text-align: center;
        }
        .hero-title {
          color: #FFFFFF !important;
          font-size: 56px !important;
          margin-bottom: 16px !important;
        }
        .hero-subtitle {
          color: #E0E0E0 !important;
          font-size: 20px !important;
          max-width: 800px;
          margin: 0 auto !important;
        }
        
        .company-intro { padding: 80px 0; background: #FFFFFF; }
        .intro-image {
          font-size: 200px;
        }
        
        .culture-section { padding: 80px 0; background: #F8F9FA; }
        .section-title {
          text-align: center;
          font-size: 42px !important;
          margin-bottom: 64px !important;
        }
        .culture-card {
          text-align: center;
          border: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .culture-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .culture-icon {
          font-size: 80px;
          margin-bottom: 24px;
        }
        
        .stats-section { padding: 80px 0; background: #FFFFFF; }
        .stat-item { text-align: center; }
        
        .advantages-section { padding: 80px 0; background: #F8F9FA; }
        .advantage-card {
          border: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        
        .team-section { padding: 80px 0; background: #FFFFFF; }
        .team-card {
          text-align: center;
          border: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .team-avatar {
          font-size: 80px;
          margin-bottom: 16px;
        }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        
        @media (max-width: 1024px) {
          .hero-title { font-size: 36px !important; }
          .intro-image { font-size: 150px; }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; }
          .section-title { font-size: 28px !important; }
        }
      `}</style>
    </div>
  )
}

export default About
