import React from 'react'
import { Button, Space, Card, Row, Col, Descriptions, Tag } from 'antd'
import { ShoppingCartOutlined, GlobalOutlined, BarChartOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const About: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: 24, color: '#1890ff' }}>EV Cart</h1>
        <Space size="large">
          <a href="/" style={{ color: '#666' }}>首页</a>
          <a href="/products" style={{ color: '#666' }}>产品中心</a>
          <a href="/about" style={{ color: '#1890ff' }}>关于我们</a>
          <a href="/contact" style={{ color: '#666' }}>联系我们</a>
          <Button type="primary">登录系统</Button>
        </Space>
      </div>

      {/* 内容区域 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* 返回按钮 */}
        <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 24 }} onClick={() => window.history.back()}>
          返回首页
        </Button>

        {/* 公司介绍 */}
        <Card style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>关于 EV Cart</h2>
          <p style={{ fontSize: 16, lineHeight: 2, color: '#666', textAlign: 'center' }}>
            EV Cart 企业数字化系统是一套功能完整、技术先进的企业管理系统，包含 CRM（客户关系管理）、
            ERP（企业资源计划）、财务管理、售后服务四大核心系统，帮助企业实现数字化转型，提升管理效率。
          </p>
        </Card>

        {/* 核心特性 */}
        <Card title="核心特性" style={{ marginBottom: 24 }}>
          <Row gutter={32}>
            <Col span={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <ShoppingCartOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                <h3>CRM 系统</h3>
                <p style={{ color: '#999' }}>客户管理 / 订单管理 / 经销商管理</p>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <GlobalOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
                <h3>ERP 系统</h3>
                <p style={{ color: '#999' }}>采购管理 / 生产管理 / 库存管理</p>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <BarChartOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                <h3>财务管理</h3>
                <p style={{ color: '#999' }}>应收应付 / 发票管理 / 成本核算</p>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <TeamOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
                <h3>售后服务</h3>
                <p style={{ color: '#999' }}>服务请求 / 工单管理 / 客户反馈</p>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 项目统计 */}
        <Card title="项目统计" style={{ marginBottom: 24 }}>
          <Row gutter={32} style={{ textAlign: 'center' }}>
            <Col span={6}>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>19</div>
              <div style={{ color: '#999', marginTop: 8 }}>后端模块</div>
            </Col>
            <Col span={6}>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#52c41a' }}>34</div>
              <div style={{ color: '#999', marginTop: 8 }}>前端页面</div>
            </Col>
            <Col span={6}>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#faad14' }}>45+</div>
              <div style={{ color: '#999', marginTop: 8 }}>数据库表</div>
            </Col>
            <Col span={6}>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#722ed1' }}>100+</div>
              <div style={{ color: '#999', marginTop: 8 }}>API 接口</div>
            </Col>
          </Row>
        </Card>

        {/* 技术栈 */}
        <Card title="技术栈">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="后端框架">NestJS 10 + TypeScript 5</Descriptions.Item>
            <Descriptions.Item label="前端框架">React 18 + Ant Design 5</Descriptions.Item>
            <Descriptions.Item label="数据库">PostgreSQL 14</Descriptions.Item>
            <Descriptions.Item label="ORM">TypeORM</Descriptions.Item>
            <Descriptions.Item label="认证">JWT + Passport</Descriptions.Item>
            <Descriptions.Item label="部署">Docker + Nginx</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 团队信息 */}
        <Card title="开发团队" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 16, lineHeight: 2, color: '#666' }}>
            <strong>开发者:</strong> 渔晓白 ⚙️<br/>
            <strong>完成时间:</strong> 2026-03-12<br/>
            <strong>开发周期:</strong> 1 天<br/>
            <strong>版本:</strong> v1.0.0
          </p>
        </Card>

        {/* 联系方式 */}
        <Card title="联系方式">
          <p style={{ fontSize: 16, lineHeight: 2, color: '#666' }}>
            <strong>官网:</strong> https://www.evcart.com<br/>
            <strong>邮箱:</strong> support@evcart.com<br/>
            <strong>电话:</strong> 400-888-8888
          </p>
        </Card>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '40px 50px', background: '#333', color: '#fff', textAlign: 'center', marginTop: 40 }}>
        <p>© 2026 EV Cart. All rights reserved.</p>
        <p>联系方式：400-888-8888 | 邮箱：info@evcart.com</p>
      </div>
    </div>
  )
}

export default About
