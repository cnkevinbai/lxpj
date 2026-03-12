import React from 'react'
import { Card, Row, Col, Button, Space } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

const Solutions: React.FC = () => {
  const solutions = [
    {
      id: '1',
      title: '企业通勤解决方案',
      category: 'enterprise',
      description: '为企业提供高效、环保的通勤解决方案，降低运营成本，提升员工满意度。',
      features: ['车队管理', '路线优化', '成本控制', '数据分析'],
      image: '/solutions/enterprise.jpg',
    },
    {
      id: '2',
      title: '物流配送解决方案',
      category: 'logistics',
      description: '优化物流配送流程，提升配送效率，降低物流成本，实现智能化管理。',
      features: ['智能调度', '路径规划', '实时跟踪', '效率分析'],
      image: '/solutions/logistics.jpg',
    },
    {
      id: '3',
      title: '景区游览解决方案',
      category: 'scenic',
      description: '为景区提供绿色环保的游览车解决方案，提升游客体验，保护景区环境。',
      features: ['景区管理', '游客服务', '环保节能', '智能导览'],
      image: '/solutions/scenic.jpg',
    },
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
          <a href="/products" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>产品</a>
          <a href="/solutions" style={{ color: '#1890ff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="/news" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="/cases" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="/about" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>关于</a>
          <a href="/contact" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>联系</a>
          <Button type="primary" size="small" onClick={() => window.location.href = '/login'}>登录系统</Button>
        </Space>
      </div>

      {/* Hero 区域 */}
      <div style={{ 
        height: '60vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        marginTop: 64
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 64, fontWeight: 700, marginBottom: 24 }}>解决方案</h1>
          <p style={{ fontSize: 24, opacity: 0.8 }}>
            为不同行业提供专业数字化解决方案
          </p>
        </motion.div>
      </div>

      {/* 解决方案列表 */}
      <div style={{ padding: '80px 50px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card 
                hoverable
                style={{ 
                  marginBottom: 40, 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                }}
              >
                <div style={{ flex: 1, padding: '40px' }}>
                  <div style={{ marginBottom: 16 }}>
                    <GlobalOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                  </div>
                  <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
                    {solution.title}
                  </h2>
                  <p style={{ fontSize: 16, color: '#666', marginBottom: 24, lineHeight: 1.8 }}>
                    {solution.description}
                  </p>
                  <div style={{ marginBottom: 32 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>核心功能</h4>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {solution.features.map((feature) => (
                        <div 
                          key={feature}
                          style={{ 
                            padding: '8px 16px', 
                            background: '#f5f5f5', 
                            borderRadius: 20,
                            fontSize: 14
                          }}
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="primary" size="large">
                    了解详情
                  </Button>
                </div>
                <div style={{ 
                  flex: 1, 
                  background: '#f5f5f5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: 400
                }}>
                  <GlobalOutlined style={{ fontSize: 120, color: '#d9d9d9' }} />
                </div>
              </Card>
            </motion.div>
          ))}
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

export default Solutions
