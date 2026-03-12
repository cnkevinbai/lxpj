import React from 'react'
import { Button, Space, Card, Row, Col, Tag, Input } from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'

const Products: React.FC = () => {
  const products = [
    { id: 1, name: 'EV Cart Pro', category: '电动车', price: 25800, image: '/products/pro.jpg', tag: '旗舰版' },
    { id: 2, name: 'EV Cart Standard', category: '电动车', price: 19800, image: '/products/standard.jpg', tag: '标准版' },
    { id: 3, name: 'EV Cart Lite', category: '电动车', price: 13800, image: '/products/lite.jpg', tag: 'Lite 版' },
    { id: 4, name: '配件包 A', category: '配件', price: 380, image: '/products/accessory-a.jpg', tag: '基础' },
    { id: 5, name: '配件包 B', category: '配件', price: 580, image: '/products/accessory-b.jpg', tag: '高级' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: 24, color: '#1890ff' }}>EV Cart</h1>
        <Space size="large">
          <a href="/" style={{ color: '#666' }}>首页</a>
          <a href="/products" style={{ color: '#1890ff' }}>产品中心</a>
          <a href="/about" style={{ color: '#666' }}>关于我们</a>
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

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>产品中心</h2>
          <p style={{ fontSize: 16, color: '#999' }}>高品质电动车及配件产品</p>
        </div>

        {/* 搜索栏 */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Input
            placeholder="搜索产品"
            prefix={<SearchOutlined />}
            style={{ width: 400, maxWidth: '100%' }}
            size="large"
          />
        </div>

        {/* 产品列表 */}
        <Row gutter={[32, 32]}>
          {products.map((product) => (
            <Col span={8} key={product.id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCartOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />
                  </div>
                }
                actions={[
                  <Button type="primary" key="buy">立即购买</Button>,
                  <Button key="cart">加入购物车</Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{product.name}</span>
                      <Tag color={product.tag === '旗舰版' ? 'red' : product.tag === '标准版' ? 'blue' : 'green'}>
                        {product.tag}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ color: '#999', marginBottom: 8 }}>{product.category}</div>
                      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}>
                        ¥{product.price.toLocaleString()}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '40px 50px', background: '#333', color: '#fff', textAlign: 'center', marginTop: 40 }}>
        <p>© 2026 EV Cart. All rights reserved.</p>
        <p>联系方式：400-888-8888 | 邮箱：info@evcart.com</p>
      </div>
    </div>
  )
}

export default Products
