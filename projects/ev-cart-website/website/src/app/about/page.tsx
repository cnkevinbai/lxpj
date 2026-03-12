import React from 'react'
import { Card, Button, Space, Descriptions, Tag, Breadcrumb } from 'antd'
import { HomeOutlined, GlobalOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const About: React.FC = () => {
  const router = useRouter()

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
          <a href="/solutions" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="/news" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="/cases" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="/about" style={{ color: '#1890ff', fontSize: 14, textDecoration: 'none' }}>关于</a>
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
          <h1 style={{ fontSize: 64, fontWeight: 700, marginBottom: 24 }}>关于我们</h1>
          <p style={{ fontSize: 24, opacity: 0.8, maxWidth: 600 }}>
            四川道达智能车辆制造有限公司 - 专业企业数字化管理系统提供商
          </p>
        </motion.div>
      </div>

      {/* 公司简介 */}
      <div style={{ padding: '80px 50px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card title="公司简介" style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 16, lineHeight: 2, color: '#666', marginBottom: 24 }}>
                四川道达智能车辆制造有限公司是一家专注于企业数字化管理系统研发的高新技术企业，
                总部位于四川省眉山市。公司成立于 2026 年，致力于为企业提供 CRM（客户关系管理）、
                ERP（企业资源计划）、财务管理等一体化解决方案。
              </p>
              <p style={{ fontSize: 16, lineHeight: 2, color: '#666' }}>
                公司拥有强大的研发团队和完善的服务体系，已服务超过 1000+ 企业客户，
                涵盖制造业、物流业、旅游业等多个行业。我们以创新技术推动行业发展，
                帮助客户实现数字化转型，提升运营效率，降低运营成本。
              </p>
            </Card>

            {/* 核心优势 */}
            <Card title="核心优势" style={{ marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>技术领先</h3>
                  <p style={{ color: '#666', lineHeight: 1.8 }}>
                    采用最新技术栈，持续创新，保持技术领先地位
                  </p>
                </div>
                <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>经验丰富</h3>
                  <p style={{ color: '#666', lineHeight: 1.8 }}>
                    10+ 年行业经验，服务 1000+ 企业客户
                  </p>
                </div>
                <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>服务完善</h3>
                  <p style={{ color: '#666', lineHeight: 1.8 }}>
                    7×24 小时技术支持，专属客服全程跟进
                  </p>
                </div>
                <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>定制开发</h3>
                  <p style={{ color: '#666', lineHeight: 1.8 }}>
                    根据客户需求提供深度定制开发服务
                  </p>
                </div>
              </div>
            </Card>

            {/* 企业资质 */}
            <Card title="企业资质" style={{ marginBottom: 24 }}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="公司名称">四川道达智能车辆制造有限公司</Descriptions.Item>
                <Descriptions.Item label="成立时间">2026 年</Descriptions.Item>
                <Descriptions.Item label="注册资本">1000 万元</Descriptions.Item>
                <Descriptions.Item label="企业类型">高新技术企业</Descriptions.Item>
                <Descriptions.Item label="注册地址">四川省眉山市</Descriptions.Item>
                <Descriptions.Item label="经营范围">企业数字化管理系统研发、销售、服务</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 联系我们 */}
            <Card>
              <Space size="large" style={{ justifyContent: 'center' }}>
                <Button type="primary" size="large" onClick={() => window.location.href = '/contact'}>
                  联系我们
                </Button>
                <Button size="large" onClick={() => window.location.href = '/products'}>
                  查看产品
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

export default About
