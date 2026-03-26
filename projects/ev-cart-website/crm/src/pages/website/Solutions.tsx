import React from 'react'
import { Card, Row, Col, Button, Space, Timeline, Tag, Statistic } from 'antd'
import { CheckCircleOutlined, RiseOutlined, TeamOutlined } from '@ant-design/icons'

const Solutions: React.FC = () => {
  const solutions = [
    {
      id: '1',
      title: '城市共享换电解决方案',
      icon: '🏙️',
      description: '为共享出行企业提供智能换电网络建设方案',
      features: [
        '快速部署换电网络',
        '智能调度系统',
        '运营数据分析',
        '7×24 小时运维支持',
      ],
      benefits: [
        { label: '换电效率', value: '3 分钟/次' },
        { label: '覆盖范围', value: '5km 半径' },
        { label: '运营成本', value: '↓40%' },
      ],
      cases: ['某某共享出行', '某某物流公司'],
    },
    {
      id: '2',
      title: '物流配送换电解决方案',
      icon: '📦',
      description: '为物流配送企业提供高效换电服务',
      features: [
        '定制化换电方案',
        '车队管理系统',
        '成本优化分析',
        '专属运维团队',
      ],
      benefits: [
        { label: '配送效率', value: '↑50%' },
        { label: '车辆利用率', value: '↑30%' },
        { label: '运营成本', value: '↓35%' },
      ],
      cases: ['某某快递', '某某外卖'],
    },
    {
      id: '3',
      title: '园区换电解决方案',
      icon: '🏭',
      description: '为工业园区提供封闭式换电网络',
      features: [
        '园区专属换电站',
        '车辆统一管理',
        '能源管理系统',
        '安全监控系统',
      ],
      benefits: [
        { label: '管理效率', value: '↑60%' },
        { label: '安全事故', value: '↓90%' },
        { label: '能源成本', value: '↓25%' },
      ],
      cases: ['某某工业园区', '某某科技园区'],
    },
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
          <a href="/solutions" style={{ color: '#1890ff', fontWeight: 600 }}>解决方案</a>
          <a href="/service" style={{ color: '#666' }}>服务支持</a>
          <a href="/about" style={{ color: '#666' }}>关于我们</a>
        </Space>
        <Space>
          <Button ghost>登录</Button>
          <Button type="primary">联系咨询</Button>
        </Space>
      </div>

      {/* 页面标题 */}
      <div style={{
        height: 300,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>解决方案</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>为不同场景提供专业换电解决方案</p>
        </div>
      </div>

      {/* 解决方案列表 */}
      <div style={{ padding: '40px 80px' }}>
        {solutions.map((solution, index) => (
          <Card
            key={solution.id}
            style={{
              marginBottom: 32,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <Row gutter={32}>
              <Col span={8} style={{
                background: `linear-gradient(135deg, #1890ff11 0%, #1890ff22 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 120,
                minHeight: 400,
              }}>
                {solution.icon}
              </Col>
              <Col span={16}>
                <div style={{ padding: '40px 0' }}>
                  <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
                    {solution.title}
                  </h2>
                  <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
                    {solution.description}
                  </p>

                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>核心功能</h3>
                  <Space direction="vertical" size={12} style={{ marginBottom: 32 }}>
                    {solution.features.map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </Space>

                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>客户收益</h3>
                  <Row gutter={16} style={{ marginBottom: 32 }}>
                    {solution.benefits.map((benefit, i) => (
                      <Col span={8} key={i}>
                        <div style={{ textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: 8 }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: '#1890ff', marginBottom: 8 }}>
                            {benefit.value}
                          </div>
                          <div style={{ color: '#666', fontSize: 14 }}>{benefit.label}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>成功案例</h3>
                  <Space size={8} style={{ marginBottom: 32 }}>
                    {solution.cases.map((case_, i) => (
                      <Tag key={i} color="blue" style={{ padding: '4px 12px', fontSize: 14 }}>
                        {case_}
                      </Tag>
                    ))}
                  </Space>

                  <Button type="primary" size="large">
                    获取详细方案
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* 合作流程 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 16, fontWeight: 700 }}>
          合作流程
        </h2>
        <p style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 60 }}>
          简单 5 步，开启智能换电之旅
        </p>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Timeline
            mode="alternate"
            items={[
              {
                color: '#1890ff',
                children: (
                  <Card size="small">
                    <h3>需求沟通</h3>
                    <p style={{ color: '#666' }}>了解客户需求，提供初步方案</p>
                  </Card>
                ),
              },
              {
                color: '#52c41a',
                children: (
                  <Card size="small">
                    <h3>方案设计</h3>
                    <p style={{ color: '#666' }}>定制化设计方案，优化成本效益</p>
                  </Card>
                ),
              },
              {
                color: '#faad14',
                children: (
                  <Card size="small">
                    <h3>部署实施</h3>
                    <p style={{ color: '#666' }}>专业团队部署，快速上线运营</p>
                  </Card>
                ),
              },
              {
                color: '#722ed1',
                children: (
                  <Card size="small">
                    <h3>培训交付</h3>
                    <p style={{ color: '#666' }}>系统培训，确保熟练使用</p>
                  </Card>
                ),
              },
              {
                color: '#eb2f96',
                children: (
                  <Card size="small">
                    <h3>运维支持</h3>
                    <p style={{ color: '#666' }}>7×24 小时运维，持续优化升级</p>
                  </Card>
                ),
              },
            ]}
          />
        </div>
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

export default Solutions
