import React from 'react'
import { Button, Space, Card, Row, Col, Statistic } from 'antd'
import { ShoppingCartOutlined, GlobalOutlined, BarChartOutlined, TeamOutlined } from '@ant-design/icons'

const Home: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 导航栏 */}
      <div style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.1)' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 28 }}>EV Cart</h1>
        <Space size="large">
          <a href="#products" style={{ color: '#fff' }}>产品中心</a>
          <a href="#about" style={{ color: '#fff' }}>关于我们</a>
          <a href="#contact" style={{ color: '#fff' }}>联系我们</a>
          <Button type="primary" size="large">登录系统</Button>
        </Space>
      </div>

      {/* Hero 区域 */}
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
        <h2 style={{ fontSize: 48, marginBottom: 20 }}>EV Cart 企业数字化系统</h2>
        <p style={{ fontSize: 20, marginBottom: 40, opacity: 0.9 }}>完整的企业数字化解决方案 - CRM + ERP + 财务 + 售后一体化</p>
        <Space size="large">
          <Button type="primary" size="large" style={{ height: 50, padding: '0 40px' }}>立即体验</Button>
          <Button size="large" style={{ height: 50, padding: '0 40px' }}>了解更多</Button>
        </Space>
      </div>

      {/* 特性展示 */}
      <div style={{ padding: '80px 50px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 60 }}>核心特性</h2>
        <Row gutter={32}>
          <Col span={6}>
            <Card hoverable style={{ textAlign: 'center', padding: '40px 20px' }}>
              <ShoppingCartOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 20 }} />
              <h3>CRM 系统</h3>
              <p style={{ color: '#999' }}>客户管理 / 订单管理 / 经销商管理</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card hoverable style={{ textAlign: 'center', padding: '40px 20px' }}>
              <GlobalOutlined style={{ fontSize: 64, color: '#722ed1', marginBottom: 20 }} />
              <h3>ERP 系统</h3>
              <p style={{ color: '#999' }}>采购管理 / 生产管理 / 库存管理</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card hoverable style={{ textAlign: 'center', padding: '40px 20px' }}>
              <BarChartOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 20 }} />
              <h3>财务管理</h3>
              <p style={{ color: '#999' '>应收应付 / 发票管理 / 成本核算</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card hoverable style={{ textAlign: 'center', padding: '40px 20px' }}>
              <TeamOutlined style={{ fontSize: 64, color: '#faad14', marginBottom: 20 }} />
              <h3>售后服务</h3>
              <p style={{ color: '#999' }}>服务请求 / 工单管理 / 客户反馈</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 数据统计 */}
      <div style={{ padding: '80px 50px', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 60 }}>系统统计</h2>
        <Row gutter={32} style={{ textAlign: 'center' }}>
          <Col span={6}>
            <Statistic title="后端模块" value={19} suffix="个" valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col span={6}>
            <Statistic title="前端页面" value={34} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Col>
          <Col span={6}>
            <Statistic title="数据库表" value={45} suffix="张" valueStyle={{ color: '#faad14' }} />
          </Col>
          <Col span={6}>
            <Statistic title="API 接口" value={100} suffix="个" valueStyle={{ color: '#722ed1' }} />
          </Col>
        </Row>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '40px 50px', background: '#333', color: '#fff', textAlign: 'center' }}>
        <p>© 2026 EV Cart. All rights reserved.</p>
        <p>联系方式：400-888-8888 | 邮箱：info@evcart.com</p>
      </div>
    </div>
  )
}

export default Home
