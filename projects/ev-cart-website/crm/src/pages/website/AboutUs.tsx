import React from 'react'
import { Card, Row, Col, Button, Space, Timeline, Statistic, Progress } from 'antd'
import { TrophyOutlined, TeamOutlined, RiseOutlined, GlobalOutlined } from '@ant-design/icons'

const AboutUs: React.FC = () => {
  const milestones = [
    { year: '2020', event: '公司成立，开始智能换电技术研发', color: '#1890ff' },
    { year: '2021', event: '第一代智能换电柜 V1 发布', color: '#52c41a' },
    { year: '2022', event: '获得 A 轮融资，服务网络覆盖 10 个城市', color: '#faad14' },
    { year: '2023', event: '第二代智能换电柜 V2 发布，获多项专利', color: '#722ed1' },
    { year: '2024', event: '服务网络覆盖全国 20+ 城市，200+ 服务网点', color: '#eb2f96' },
    { year: '2025', event: '第三代智能换电柜 V3 发布，AI 智能识别', color: '#13c2c2' },
    { year: '2026', event: '服务企业超过 500 家，客户满意度 98%', color: '#52c41a' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <div style={{
        height: 64,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 80px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>⚡ EV CART</div>
        <Space size={40}>
          <a href="/website" style={{ color: '#666' }}>首页</a>
          <a href="/products" style={{ color: '#666' }}>产品中心</a>
          <a href="/solutions" style={{ color: '#666' }}>解决方案</a>
          <a href="/service" style={{ color: '#666' }}>服务支持</a>
          <a href="/about" style={{ color: '#1890ff', fontWeight: 600 }}>关于我们</a>
          <a href="/contact" style={{ color: '#666' }}>联系我们</a>
        </Space>
        <Space>
          <Button ghost>登录</Button>
          <Button type="primary">联系咨询</Button>
        </Space>
      </div>

      {/* 页面标题 */}
      <div style={{
        height: 400,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}>
        <div>
          <h1 style={{ fontSize: 56, fontWeight: 700, marginBottom: 16 }}>关于我们</h1>
          <p style={{ fontSize: 20, opacity: 0.9 }}>新能源汽车智能换电领导者</p>
          <p style={{ fontSize: 16, opacity: 0.8, marginTop: 8 }}>智能 · 高效 · 安全 · 环保</p>
        </div>
      </div>

      {/* 公司简介 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <Row gutter={64} align="middle">
          <Col span={12}>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>公司简介</h2>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#666', marginBottom: 24 }}>
              道达智能是一家专注于新能源汽车智能换电技术研发与应用的高新技术企业。
              公司成立于 2020 年，总部位于四川省眉山市，在全国 20+ 城市设有服务网点。
            </p>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#666', marginBottom: 24 }}>
              我们致力于为客户提供智能、高效、安全的换电解决方案，主要产品包括智能换电柜、
              锂电池系列、智能管理系统等，广泛应用于共享出行、物流配送、工业园区等场景。
            </p>
            <p style={{ fontSize: 16, lineHeight: 2, color: '#666' }}>
              截至目前，道达智能已服务企业超过 500 家，部署智能换电设备超过 10000 台，
              客户满意度达到 98%，是新能源汽车智能换电领域的领先企业。
            </p>
          </Col>
          <Col span={12}>
            <div style={{
              height: 400,
              background: 'linear-gradient(135deg, #1890ff22 0%, #1890ff44 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 120,
            }}>
              🏢
            </div>
          </Col>
        </Row>
      </div>

      {/* 数据统计 */}
      <div style={{ padding: '80px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          实力见证
        </h2>
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="服务城市"
                value={20}
                suffix="+"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#1890ff' }}
                prefix={<GlobalOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="服务网点"
                value={200}
                suffix="+"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#52c41a' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="服务企业"
                value={500}
                suffix="+"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#faad14' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="客户满意度"
                value={98}
                suffix="%"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#722ed1' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 发展历程 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          发展历程
        </h2>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Timeline
            items={milestones.map((item) => ({
              color: item.color,
              children: (
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 18 }}>{item.year}年</strong>
                    <span style={{ color: '#666' }}>{item.event}</span>
                  </div>
                </Card>
              ),
            }))}
          />
        </div>
      </div>

      {/* 荣誉资质 */}
      <div style={{ padding: '80px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          荣誉资质
        </h2>
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>高新技术企业</h3>
              <p style={{ color: '#666', fontSize: 13 }}>2023 年认定</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🥇</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>行业创新企业奖</h3>
              <p style={{ color: '#666', fontSize: 13 }}>2025 年度</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📜</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>多项技术专利</h3>
              <p style={{ color: '#666', fontSize: 13 }}>50+ 项专利</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>⭐</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>AAA 信用企业</h3>
              <p style={{ color: '#666', fontSize: 13 }}>诚信经营示范</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 企业文化 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          企业文化
        </h2>
        <Row gutter={32}>
          <Col span={8}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>企业使命</h3>
              <p style={{ color: '#666', lineHeight: 2 }}>
                让新能源汽车换电更智能、更便捷
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👁️</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>企业愿景</h3>
              <p style={{ color: '#666', lineHeight: 2 }}>
                成为全球领先的新能源汽车智能换电解决方案提供商
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>核心价值观</h3>
              <p style={{ color: '#666', lineHeight: 2 }}>
                创新、品质、服务、共赢
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 页脚 */}
      <div style={{ background: '#001529', color: 'white', padding: '60px 80px' }}>
        <Row gutter={80}>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>关于我们</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>公司简介</p>
            <p style={{ color: '#999', lineHeight: 2 }}>发展历程</p>
            <p style={{ color: '#999', lineHeight: 2 }}>荣誉资质</p>
          </Col>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>产品中心</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>智能换电柜</p>
            <p style={{ color: '#999', lineHeight: 2 }}>锂电池</p>
            <p style={{ color: '#999', lineHeight: 2 }}>管理系统</p>
          </Col>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>服务支持</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>售后服务</p>
            <p style={{ color: '#999', lineHeight: 2 }}>技术支持</p>
            <p style={{ color: '#999', lineHeight: 2 }}>常见问题</p>
          </Col>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>联系我们</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>电话：400-888-8888</p>
            <p style={{ color: '#999', lineHeight: 2 }}>邮箱：contact@evcart.com</p>
            <p style={{ color: '#999', lineHeight: 2 }}>地址：四川省眉山市</p>
          </Col>
        </Row>
        <div style={{ borderTop: '1px solid #333', marginTop: 40, paddingTop: 20, textAlign: 'center', color: '#666' }}>
          © 2026 道达智能 版权所有
        </div>
      </div>
    </div>
  )
}

export default AboutUs
