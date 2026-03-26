import React, { useState } from 'react'
import { Card, Row, Col, Button, Space, Table, Tag, Checkbox, Empty, message } from 'antd'
import { SwapOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const ProductCompare: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const products = [
    {
      id: '1',
      name: '智能换电柜 V3',
      category: '换电设备',
      price: 15000,
      image: 'https://picsum.photos/300/200?random=1',
      specs: {
        '电池容量': '20 块',
        '功率': '50kW',
        '尺寸': '2000×1200×600mm',
        '重量': '500kg',
        '防护等级': 'IP54',
        'AI 识别': true,
        '5G 联网': true,
        '智能调度': true,
      },
      hot: true,
    },
    {
      id: '2',
      name: '智能换电柜 V2',
      category: '换电设备',
      price: 12000,
      image: 'https://picsum.photos/300/200?random=2',
      specs: {
        '电池容量': '15 块',
        '功率': '40kW',
        '尺寸': '1800×1000×500mm',
        '重量': '400kg',
        '防护等级': 'IP54',
        'AI 识别': false,
        '5G 联网': false,
        '智能调度': true,
      },
      hot: false,
    },
    {
      id: '5',
      name: '智能管理系统',
      category: '软件系统',
      price: 9800,
      image: 'https://picsum.photos/300/200?random=3',
      specs: {
        '部署方式': 'SaaS 云部署',
        '用户数': '不限',
        '数据存储': '云端存储',
        '支持终端': 'PC/APP/小程序',
        'AI 识别': true,
        '5G 联网': true,
        '智能调度': true,
      },
      hot: true,
    },
  ]

  const handleCompare = (id: string, checked: boolean) => {
    if (checked) {
      if (selectedProducts.length >= 3) {
        message.warning('最多只能对比 3 个产品')
        return
      }
      setSelectedProducts([...selectedProducts, id])
    } else {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id))
    }
  }

  const compareProducts = products.filter(p => selectedProducts.includes(p.id))

  const comparisonData = [
    {
      feature: '产品价格',
      items: compareProducts.map(p => `¥${p.price.toLocaleString()}`),
    },
    {
      feature: '电池容量',
      items: compareProducts.map(p => p.specs['电池容量'] || '-'),
    },
    {
      feature: '功率',
      items: compareProducts.map(p => p.specs['功率'] || '-'),
    },
    {
      feature: '尺寸',
      items: compareProducts.map(p => p.specs['尺寸'] || '-'),
    },
    {
      feature: '重量',
      items: compareProducts.map(p => p.specs['重量'] || '-'),
    },
    {
      feature: '防护等级',
      items: compareProducts.map(p => p.specs['防护等级'] || '-'),
    },
    {
      feature: 'AI 识别',
      items: compareProducts.map(p => p.specs['AI 识别'] ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CloseOutlined style={{ color: '#ff4d4f' }} />),
    },
    {
      feature: '5G 联网',
      items: compareProducts.map(p => p.specs['5G 联网'] ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CloseOutlined style={{ color: '#ff4d4f' }} />),
    },
    {
      feature: '智能调度',
      items: compareProducts.map(p => p.specs['智能调度'] ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CloseOutlined style={{ color: '#ff4d4f' }} />),
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
          <a href="/products" style={{ color: '#1890ff', fontWeight: 600 }}>产品中心</a>
          <a href="/solutions" style={{ color: '#666' }}>解决方案</a>
          <a href="/dealer" style={{ color: '#666' }}>经销商加盟</a>
          <a href="/service" style={{ color: '#666' }}>服务支持</a>
          <a href="/about" style={{ color: '#666' }}>关于我们</a>
          <a href="/contact" style={{ color: '#666' }}>联系我们</a>
        </Space>
        <Space>
          <Button ghost>登录</Button>
          <Button type="primary">联系咨询</Button>
        </Space>
      </div>

      {/* 页面标题 */}
      <div style={{
        height: 200,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>
            <SwapOutlined /> 产品对比
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>选择最多 3 个产品进行对比</p>
        </div>
      </div>

      <div style={{ padding: '40px 80px' }}>
        {/* 产品选择 */}
        <Card title="选择产品进行对比" style={{ marginBottom: 32 }}>
          <Row gutter={16}>
            {products.map((product) => (
              <Col span={8} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleCompare(product.id, e.target.checked)}
                    >
                      加入对比
                    </Checkbox>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{product.name}</span>
                        {product.hot && <Tag color="red">热销</Tag>}
                      </div>
                    }
                    description={
                      <div style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 18 }}>
                        ¥{product.price.toLocaleString()}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 对比结果 */}
        {compareProducts.length > 0 ? (
          <Card title="产品对比">
            <Table
              dataSource={comparisonData}
              rowKey="feature"
              pagination={false}
              columns={[
                {
                  title: '对比项',
                  dataIndex: 'feature',
                  width: 200,
                  fixed: 'left',
                  render: (feature: string) => <strong>{feature}</strong>,
                },
                ...compareProducts.map((product, index) => ({
                  title: (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>{product.name}</div>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }}
                      />
                    </div>
                  ),
                  dataIndex: `item${index}`,
                  key: `item${index}`,
                  render: (_: any, record: any) => record.items[index],
                })),
              ]}
            />
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Space size={16}>
                <Button type="primary" size="large">
                  批量询价
                </Button>
                <Button size="large">
                  下载对比报告
                </Button>
              </Space>
            </div>
          </Card>
        ) : (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="请选择至少 2 个产品进行对比"
            />
          </Card>
        )}
      </div>

      {/* 页脚 */}
      <div style={{ background: '#001529', color: 'white', padding: '60px 80px', marginTop: 40 }}>
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

export default ProductCompare
