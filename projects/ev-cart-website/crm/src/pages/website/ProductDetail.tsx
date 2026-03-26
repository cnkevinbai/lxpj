import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Button, Space, Tabs, Tag, Statistic, Input, Form, message, Image, Divider } from 'antd'
import {
  ShoppingCartOutlined,
  PhoneOutlined,
  MailOutlined,
  DownloadOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { TabPane } = Tabs

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  // 模拟产品数据
  const product = {
    id: id || '1',
    code: 'P001',
    name: '智能换电柜 V3',
    category: '换电设备',
    description: '第三代智能换电设备，支持 20 块电池同时充换，采用 AI 智能识别技术，5G 物联网连接，模块化设计，智能调度算法优化电池流转效率。',
    price: 15000,
    stock: 150,
    status: 'active',
    hot: true,
    features: [
      'AI 智能识别电池健康状态',
      '5G 物联网技术远程监控',
      '模块化设计快速部署',
      '智能调度算法优化效率',
      '多重安全保护机制',
      '7×24 小时远程运维',
    ],
    specs: {
      '尺寸': '2000×1200×600mm',
      '重量': '500kg',
      '电池容量': '20 块',
      '功率': '50kW',
      '电压': '380V',
      '防护等级': 'IP54',
      '工作温度': '-20℃~50℃',
      '通信方式': '5G/4G/以太网',
    },
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
    ],
    videos: [
      { title: '产品介绍视频', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    downloads: [
      { name: '产品技术手册.pdf', size: '2.5MB' },
      { name: '产品安装指南.pdf', size: '1.8MB' },
      { name: '产品合格证.pdf', size: '0.5MB' },
    ],
    reviews: [
      { customer: '某某物流公司', rating: 5, content: '非常好用，换电效率高，稳定性好！', date: '2026-03-10' },
      { customer: '某某科技公司', rating: 5, content: 'AI 识别很准确，远程监控很方便！', date: '2026-03-08' },
      { customer: '某某贸易公司', rating: 4, content: '整体不错，就是价格稍贵', date: '2026-03-05' },
    ],
  }

  const onFinish = async (values: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          productId: product.id,
          productName: product.name,
        }),
      })
      const result = await response.json()
      if (result.success) {
        message.success('询价提交成功！我们的销售顾问将在 24 小时内联系您！')
        form.resetFields()
      }
    } catch (error) {
      message.error('提交失败，请稍后重试')
    }
  }

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

      {/* 产品详情 */}
      <div style={{ padding: '40px 80px' }}>
        <Row gutter={32}>
          <Col span={12}>
            <Card>
              <Image.PreviewGroup>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {product.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${product.name} - 图片${index + 1}`}
                      style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>{product.name}</h1>
              <div style={{ marginBottom: 16 }}>
                <Tag color="red" style={{ marginRight: 8 }}>热销</Tag>
                <Tag color="blue">{product.category}</Tag>
                <Tag color="green">现货</Tag>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f', marginBottom: 16 }}>
                ¥{product.price.toLocaleString()}
              </div>
              <p style={{ fontSize: 16, lineHeight: 2, color: '#666', marginBottom: 24 }}>
                {product.description}
              </p>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>核心特性</h3>
                <Space direction="vertical" size={8}>
                  {product.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </Space>
              </div>
              <Space size={16}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => message.success('已添加到询价单')}
                >
                  加入询价单
                </Button>
                <Button
                  size="large"
                  icon={<PhoneOutlined />}
                  onClick={() => window.location.href = 'tel:400-888-8888'}
                >
                  立即咨询
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 产品详情 Tabs */}
        <Card style={{ marginTop: 32 }}>
          <Tabs defaultActiveKey="specs">
            <TabPane tab="技术参数" key="specs">
              <Row gutter={32}>
                <Col span={12}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>技术规格</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4 }}>
                        <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>{key}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col span={12}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>产品视频</h3>
                  {product.videos.map((video, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <video
                        src={video.url}
                        controls
                        style={{ width: '100%', borderRadius: 8 }}
                      />
                      <div style={{ marginTop: 8, fontWeight: 600 }}>{video.title}</div>
                    </div>
                  ))}
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="资料下载" key="downloads">
              <div>
                {product.downloads.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: '#f5f5f5',
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{file.name}</div>
                      <div style={{ fontSize: 13, color: '#999' }}>{file.size}</div>
                    </div>
                    <Button icon={<DownloadOutlined />}>下载</Button>
                  </div>
                ))}
              </div>
            </TabPane>

            <TabPane tab="客户评价" key="reviews">
              <div>
                <div style={{ marginBottom: 24 }}>
                  <Statistic
                    title="综合评分"
                    value={4.8}
                    precision={1}
                    suffix="/5.0"
                    valueStyle={{ fontSize: 48, fontWeight: 700, color: '#faad14' }}
                    prefix={<StarOutlined />}
                  />
                </div>
                {product.reviews.map((review, index) => (
                  <Card key={index} size="small" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <strong>{review.customer}</strong>
                      <span style={{ color: '#999', fontSize: 13 }}>{review.date}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarOutlined
                          key={i}
                          style={{ color: i < review.rating ? '#faad14' : '#d9d9d9' }}
                        />
                      ))}
                    </div>
                    <p style={{ color: '#666', margin: 0 }}>{review.content}</p>
                  </Card>
                ))}
              </div>
            </TabPane>

            <TabPane tab="询价" key="inquiry">
              <div style={{ maxWidth: 600 }}>
                <Form onFinish={onFinish} layout="vertical">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                      <Input placeholder="请输入您的姓名" />
                    </Form.Item>
                    <Form.Item name="company" label="公司名称">
                      <Input placeholder="请输入公司名称" />
                    </Form.Item>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                    <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效的邮箱' }]}>
                      <Input placeholder="请输入邮箱地址" />
                    </Form.Item>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item name="quantity" label="需求数量">
                      <Input type="number" placeholder="请输入需求数量" />
                    </Form.Item>
                    <Form.Item name="region" label="所在地区">
                      <Input placeholder="请输入所在地区" />
                    </Form.Item>
                  </div>
                  <Form.Item name="requirement" label="具体需求">
                    <Input.TextArea rows={4} placeholder="请描述您的具体需求" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>
                      提交询价
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* 相关产品 */}
        <Card title="相关产品" style={{ marginTop: 32 }}>
          <Row gutter={16}>
            {[
              { id: '2', name: '智能换电柜 V2', price: 12000, image: 'https://picsum.photos/300/200?random=5' },
              { id: '3', name: '锂电池 48V', price: 1200, image: 'https://picsum.photos/300/200?random=6' },
              { id: '5', name: '智能管理系统', price: 9800, image: 'https://picsum.photos/300/200?random=7' },
            ].map((item) => (
              <Col span={8} key={item.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.name}
                      src={item.image}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                  }
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  <Card.Meta
                    title={item.name}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#ff4d4f', fontWeight: 600 }}>¥{item.price.toLocaleString()}</span>
                        <Button type="link">查看详情</Button>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
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

export default ProductDetail
