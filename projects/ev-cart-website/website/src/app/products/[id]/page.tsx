import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Descriptions, Table, Tag, message, Breadcrumb } from 'antd'
import { HomeOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'

const ProductDetail: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProductDetail()
  }, [params.id])

  const loadProductDetail = async () => {
    try {
      const response = await fetch(`/api/v1/website/products/${params.id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      message.error('加载产品详情失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        加载中...
      </div>
    )
  }

  const featureColumns = [
    { title: '功能模块', dataIndex: 'module', width: 200 },
    { title: '功能描述', dataIndex: 'description', width: 400 },
    { title: '支持程度', dataIndex: 'support', width: 150, render: (s: string) => (
      <Tag color={s === '完全支持' ? 'success' : s === '部分支持' ? 'warning' : 'default'}>{s}</Tag>
    )},
  ]

  const pricingPlans = [
    { name: '基础版', price: '9,800', features: ['基础功能', '5 用户许可', '标准支持'], recommended: false },
    { name: '专业版', price: '19,800', features: ['全部功能', '20 用户许可', '优先支持', '定制开发'], recommended: true },
    { name: '企业版', price: '面议', features: ['全部功能', '无限用户', '专属支持', '深度定制', '源码交付'], recommended: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        padding: '20px 50px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 700 }}>四川道达智能</h1>
        <Space size="large">
          <a href="/" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>首页</a>
          <a href="/products" style={{ color: '#1890ff', fontSize: 14, textDecoration: 'none' }}>产品</a>
          <a href="/solutions" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="/news" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="/cases" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="/about" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>关于</a>
          <a href="/contact" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>联系</a>
          <Button type="primary" size="small" onClick={() => window.location.href = '/login'}>登录系统</Button>
        </Space>
      </div>

      {/* 面包屑 */}
      <div style={{ padding: '100px 50px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
              <span>首页</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">
              <ShoppingCartOutlined />
              <span>产品中心</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{product.productName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* 产品详情 */}
      <div style={{ padding: '0 50px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 产品主图 + 基本信息 */}
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 48 }}>
                <div style={{ flex: 1, height: 400, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCartOutlined style={{ fontSize: 120, color: '#d9d9d9' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Tag color={product.category === 'crm' ? 'blue' : product.category === 'erp' ? 'purple' : 'green'} style={{ marginBottom: 16 }}>
                    {product.category === 'crm' ? 'CRM 系统' : product.category === 'erp' ? 'ERP 系统' : '财务管理'}
                  </Tag>
                  <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>{product.productName}</h1>
                  <p style={{ fontSize: 16, color: '#666', marginBottom: 24, lineHeight: 1.8 }}>{product.description}</p>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#ff4d4f', marginBottom: 32 }}>
                    ¥{(product.unitPrice || 0).toLocaleString()} 起
                  </div>
                  <Space size="large">
                    <Button type="primary" size="large" onClick={() => window.location.href = '/contact'}>
                      立即咨询
                    </Button>
                    <Button size="large" onClick={() => window.location.href = '/login'}>
                      免费试用
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>

            {/* 产品详情 */}
            <Card title="产品详情" style={{ marginBottom: 24 }}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="产品编码">{product.productCode}</Descriptions.Item>
                <Descriptions.Item label="产品类别">{product.category}</Descriptions.Item>
                <Descriptions.Item label="部署方式">云端部署 / 本地部署</Descriptions.Item>
                <Descriptions.Item label="用户许可">按需配置</Descriptions.Item>
                <Descriptions.Item label="技术支持">7×24 小时</Descriptions.Item>
                <Descriptions.Item label="更新周期">每月更新</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 功能模块 */}
            <Card title="功能模块" style={{ marginBottom: 24 }}>
              <Table 
                columns={featureColumns} 
                dataSource={product.features || []} 
                rowKey="id"
                pagination={false}
              />
            </Card>

            {/* 价格方案 */}
            <Card title="价格方案" style={{ marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {pricingPlans.map((plan, index) => (
                  <Card 
                    key={plan.name}
                    hoverable
                    style={{ 
                      textAlign: 'center',
                      border: plan.recommended ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      position: 'relative'
                    }}
                  >
                    {plan.recommended && (
                      <Tag color="blue" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                        推荐
                      </Tag>
                    )}
                    <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{plan.name}</h3>
                    <div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff', marginBottom: 24 }}>
                      ¥{plan.price}
                    </div>
                    <ul style={{ textAlign: 'left', marginBottom: 32, paddingLeft: 20 }}>
                      {plan.features.map((feature) => (
                        <li key={feature} style={{ marginBottom: 8, color: '#666' }}>{feature}</li>
                      ))}
                    </ul>
                    <Button type={plan.recommended ? 'primary' : 'default'} size="large" block>
                      选择方案
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            {/* 操作按钮 */}
            <Card>
              <Space size="large" style={{ justifyContent: 'center' }}>
                <Button icon={<ArrowLeftOutlined />} size="large" onClick={() => router.back()}>
                  返回产品列表
                </Button>
                <Button type="primary" size="large" onClick={() => window.location.href = '/contact'}>
                  联系咨询
                </Button>
                <Button size="large" onClick={() => window.location.href = '/login'}>
                  免费试用
                </Button>
              </Space>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '80px 50px', background: '#000', color: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 60, marginBottom: 60 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>产品</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>CRM 系统</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>ERP 系统</p>
              <p style={{ fontSize: 14, color: '#999' }}>财务管理</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>公司</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>关于我们</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>联系方式</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>支持</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>技术支持</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>文档中心</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>联系</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>info@ddzn.com</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>400-888-8888</p>
              <p style={{ fontSize: 14, color: '#999' }}>四川省眉山市</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#666' }}>
              © 2026 四川道达智能车辆制造有限公司。All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
