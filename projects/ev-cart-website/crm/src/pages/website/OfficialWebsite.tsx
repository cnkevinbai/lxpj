import React from 'react'
import { Button, Space, Card, Row, Col, Statistic } from 'antd'
import {
  RocketOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'

const OfficialWebsite: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* 导航栏 */}
      <div style={{
        height: 64,
        background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 80px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
          ⚡ EV CART
        </div>
        <Space size={40} style={{ color: 'white' }}>
          <span style={{ cursor: 'pointer' }}>首页</span>
          <span style={{ cursor: 'pointer' }}>产品中心</span>
          <span style={{ cursor: 'pointer' }}>解决方案</span>
          <span style={{ cursor: 'pointer' }}>服务支持</span>
          <span style={{ cursor: 'pointer' }}>关于我们</span>
          <span style={{ cursor: 'pointer' }}>联系我们</span>
        </Space>
        <Space>
          <Button type="primary" ghost>登录</Button>
          <Button type="primary">免费注册</Button>
        </Space>
      </div>

      {/* Hero Banner */}
      <div style={{
        height: 600,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}>
        <div>
          <h1 style={{ fontSize: 56, fontWeight: 800, marginBottom: 24 }}>
            新能源汽车智能换电领导者
          </h1>
          <p style={{ fontSize: 20, marginBottom: 40, opacity: 0.9 }}>
            智能 · 高效 · 安全 · 环保
          </p>
          <Space size={24}>
            <Button type="primary" size="large" style={{ height: 48, padding: '0 40px', fontSize: 16 }}>
              了解产品
            </Button>
            <Button size="large" ghost style={{ height: 48, padding: '0 40px', fontSize: 16, color: 'white', borderColor: 'white' }}>
              联系我们
            </Button>
          </Space>
        </div>
      </div>

      {/* 核心优势 */}
      <div style={{ padding: '80px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 16, fontWeight: 700 }}>
          为什么选择道达智能
        </h2>
        <p style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 60 }}>
          行业领先的技术实力，完善的售后服务体系
        </p>
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', padding: 32, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <RocketOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>技术领先</h3>
              <p style={{ color: '#666' }}>AI 智能识别，5G 物联网技术</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', padding: 32, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <SafetyCertificateOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>安全可靠</h3>
              <p style={{ color: '#666' }}>多重安全保护，7×24 小时监控</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', padding: 32, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <ThunderboltOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>高效便捷</h3>
              <p style={{ color: '#666' }}>3 分钟快速换电，智能调度</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', padding: 32, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <GlobalOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>全球服务</h3>
              <p style={{ color: '#666' }}>全国 20+ 城市，200+ 服务网点</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 数据统计 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <Row gutter={32}>
          <Col span={6}>
            <Statistic
              title="服务城市"
              value={20}
              suffix="+"
              valueStyle={{ fontSize: 48, fontWeight: 700, color: '#1890ff' }}
              prefix={<GlobalOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="服务网点"
              value={200}
              suffix="+"
              valueStyle={{ fontSize: 48, fontWeight: 700, color: '#52c41a' }}
              prefix={<SafetyCertificateOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="服务企业"
              value={500}
              suffix="+"
              valueStyle={{ fontSize: 48, fontWeight: 700, color: '#faad14' }}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="客户满意度"
              value={98}
              suffix="%"
              valueStyle={{ fontSize: 48, fontWeight: 700, color: '#722ed1' }}
              prefix={<TrophyOutlined />}
            />
          </Col>
        </Row>
      </div>

      {/* 产品中心 */}
      <div style={{ padding: '80px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 16, fontWeight: 700 }}>
          核心产品
        </h2>
        <p style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 60 }}>
          自主研发，行业领先
        </p>
        <Row gutter={32}>
          <Col span={8}>
            <Card
              hoverable
              cover={<div style={{ height: 200, background: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>🔋</div>}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>智能换电柜 V3</h3>
              <p style={{ color: '#666', margin: '12px 0' }}>第三代智能换电设备，支持 20 块电池同时充换</p>
              <Button type="primary" block>了解详情</Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={<div style={{ height: 200, background: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>⚡</div>}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>锂电池系列</h3>
              <p style={{ color: '#666', margin: '12px 0' }}>48V/60V 锂电池，长续航，高安全</p>
              <Button type="primary" block>了解详情</Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={<div style={{ height: 200, background: '#722ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>💻</div>}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>智能管理系统</h3>
              <p style={{ color: '#666', margin: '12px 0' }}>SaaS 平台，实时监控，智能调度</p>
              <Button type="primary" block>了解详情</Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 页脚 */}
      <div style={{
        background: '#001529',
        color: 'white',
        padding: '60px 80px',
      }}>
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
        <div style={{
          borderTop: '1px solid #333',
          marginTop: 40,
          paddingTop: 20,
          textAlign: 'center',
          color: '#666',
        }}>
          © 2026 道达智能 版权所有
        </div>
      </div>
    </div>
  )
}

export default OfficialWebsite
