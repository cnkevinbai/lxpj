import React from 'react'
import { Card, Row, Col, Button, Space, Tabs, Tag, Statistic } from 'antd'
import { ThunderboltOutlined, BulbOutlined, CloudOutlined, ShopOutlined } from '@ant-design/icons'

const { TabPane } = Tabs

const ProductCenter: React.FC = () => {
  const products = [
    {
      id: '1',
      name: '智能换电柜 V3',
      icon: <ThunderboltOutlined />,
      color: '#1890ff',
      description: '第三代智能换电设备，支持 20 块电池同时充换',
      features: ['AI 智能识别', '5G 物联网', '模块化设计', '智能调度'],
      specs: {
        '尺寸': '2000×1200×600mm',
        '重量': '500kg',
        '电池容量': '20 块',
        '功率': '50kW',
      },
      price: '面议',
      hot: true,
    },
    {
      id: '2',
      name: '智能换电柜 V2',
      icon: <ThunderboltOutlined />,
      color: '#52c41a',
      description: '第二代智能换电设备，性价比高',
      features: ['智能识别', '4G 联网', '安全可靠'],
      specs: {
        '尺寸': '1800×1000×500mm',
        '重量': '400kg',
        '电池容量': '15 块',
        '功率': '40kW',
      },
      price: '面议',
      hot: false,
    },
    {
      id: '3',
      name: '锂电池 48V',
      icon: <BulbOutlined />,
      color: '#faad14',
      description: '48V 长续航锂电池，安全可靠',
      features: ['长续航', '高安全', '长寿命'],
      specs: {
        '电压': '48V',
        '容量': '20Ah',
        '重量': '5kg',
        '循环次数': '≥1000 次',
      },
      price: '¥1,200',
      hot: true,
    },
    {
      id: '4',
      name: '锂电池 60V',
      icon: <BulbOutlined />,
      color: '#722ed1',
      description: '60V 大功率锂电池，动力强劲',
      features: ['大功率', '长续航', '快充'],
      specs: {
        '电压': '60V',
        '容量': '30Ah',
        '重量': '8kg',
        '循环次数': '≥1000 次',
      },
      price: '¥1,800',
      hot: false,
    },
    {
      id: '5',
      name: '智能管理系统',
      icon: <CloudOutlined />,
      color: '#13c2c2',
      description: 'SaaS 云平台，实时监控与智能调度',
      features: ['实时监控', '智能调度', '数据分析', '远程控制'],
      specs: {
        '部署方式': 'SaaS 云部署',
        '用户数': '不限',
        '数据存储': '云端存储',
        '支持终端': 'PC/APP/小程序',
      },
      price: '¥9,800/年',
      hot: true,
    },
    {
      id: '6',
      name: '配件包',
      icon: <ShopOutlined />,
      color: '#eb2f96',
      description: '换电柜配套配件，品质保证',
      features: ['原厂配件', '品质保证', '快速更换'],
      specs: {
        '配件类型': '多种可选',
        '质保期': '1 年',
        '适配型号': 'V2/V3',
      },
      price: '¥150 起',
      hot: false,
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
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>
          ⚡ EV CART
        </div>
        <Space size={40}>
          <a href="/website" style={{ color: '#666' }}>首页</a>
          <a href="/products" style={{ color: '#1890ff', fontWeight: 600 }}>产品中心</a>
          <a href="/solutions" style={{ color: '#666' }}>解决方案</a>
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
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>产品中心</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>智能 · 高效 · 安全 · 环保</p>
        </div>
      </div>

      {/* 产品分类 */}
      <div style={{ padding: '40px 80px' }}>
        <Tabs defaultActiveKey="all" size="large" centered style={{ marginBottom: 40 }}>
          <TabPane tab="全部产品" key="all" />
          <TabPane tab="换电设备" key="equipment" />
          <TabPane tab="锂电池" key="battery" />
          <TabPane tab="软件系统" key="software" />
          <TabPane tab="配件" key="accessories" />
        </Tabs>

        <Row gutter={[32, 32]}>
          {products.map((product) => (
            <Col span={8} key={product.id}>
              <Card
                hoverable
                cover={
                  <div style={{
                    height: 200,
                    background: `linear-gradient(135deg, ${product.color}22 0%, ${product.color}44 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 80,
                    color: product.color,
                  }}>
                    {product.icon}
                  </div>
                }
                actions={[
                  <Button type="link">查看详情</Button>,
                  <Button type="primary">立即咨询</Button>,
                ]}
              >
                {product.hot && (
                  <Tag color="red" style={{ position: 'absolute', top: 12, right: 12 }}>
                    热销
                  </Tag>
                )}
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{product.name}</span>
                      <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{product.price}</span>
                    </div>
                  }
                  description={
                    <div>
                      <p style={{ color: '#666', marginBottom: 12 }}>{product.description}</p>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        {product.features.map((feature, index) => (
                          <div key={index} style={{ fontSize: 13 }}>
                            ✓ {feature}
                          </div>
                        ))}
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 核心优势 */}
      <div style={{
        padding: '80px 80px',
        background: 'white',
      }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 16, fontWeight: 700 }}>
          为什么选择道达智能
        </h2>
        <p style={{ fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 60 }}>
          行业领先的技术实力，完善的产品体系
        </p>
        <Row gutter={32}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔋</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>自主研发</h3>
              <p style={{ color: '#666' }}>核心技术和专利</p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>品质保证</h3>
              <p style={{ color: '#666' }}>严格质量控制</p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛠️</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>完善售后</h3>
              <p style={{ color: '#666' }}>7×24 小时服务</p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>性价比高</h3>
              <p style={{ color: '#666' }}>合理价格体系</p>
            </div>
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

export default ProductCenter
