import React from 'react'
import { Button, Space } from 'antd'
import { ShoppingCartOutlined, GlobalOutlined, BarChartOutlined, TeamOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

const Home: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 导航栏 - 大疆风格（极简/半透明） */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
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
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 700 }}>四川道达智能</h1>
        <Space size="large">
          <a href="#products" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>产品</a>
          <a href="#solutions" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="#news" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="#cases" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="#about" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>关于</a>
          <a href="#contact" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>联系</a>
          <Button type="primary" size="small" style={{ borderRadius: 20 }}>客户登录</Button>
        </Space>
      </motion.div>

      {/* Hero 区域 - 大疆风格（全屏/极简/黑色渐变） */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ 
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ 
            fontSize: 72, 
            fontWeight: 700, 
            marginBottom: 24,
            letterSpacing: '-2px'
          }}
        >
          四川道达智能
        </motion.h2>
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ 
            fontSize: 24, 
            marginBottom: 64, 
            opacity: 0.7,
            fontWeight: 300,
            maxWidth: 700
          }}
        >
          专业电动车制造企业 · 数字化管理系统
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              style={{ 
                height: 56, 
                padding: '0 64px', 
                fontSize: 18,
                borderRadius: 28,
                background: '#fff',
                color: '#000',
                border: 'none',
                fontWeight: 600
              }}
            >
              探索产品
            </Button>
            <Button 
              size="large" 
              style={{ 
                height: 56, 
                padding: '0 64px', 
                fontSize: 18,
                borderRadius: 28,
                background: 'transparent',
                color: '#fff',
                border: '2px solid #fff',
                fontWeight: 600
              }}
            >
              联系我们
            </Button>
          </Space>
        </motion.div>
      </motion.div>

      {/* 产品展示 - 大疆风格（大留白/简洁） */}
      <div id="products" style={{ padding: '160px 50px', background: '#fff' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            textAlign: 'center', 
            fontSize: 48, 
            fontWeight: 700,
            marginBottom: 120,
            color: '#000'
          }}
        >
          产品系列
        </motion.h2>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 80 }}>
            {/* CRM 系统 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center' }}
            >
              <ShoppingCartOutlined style={{ fontSize: 100, color: '#000', marginBottom: 40 }} />
              <h3 style={{ fontSize: 36, fontWeight: 600, marginBottom: 20, color: '#000' }}>CRM 系统</h3>
              <p style={{ fontSize: 16, color: '#666', marginBottom: 32, lineHeight: 1.8 }}>
                客户管理 · 订单管理 · 经销商管理
              </p>
              <a href="#" style={{ fontSize: 16, color: '#000', textDecoration: 'none', fontWeight: 500 }}>
                了解更多 →
              </a>
            </motion.div>

            {/* ERP 系统 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ textAlign: 'center' }}
            >
              <GlobalOutlined style={{ fontSize: 100, color: '#000', marginBottom: 40 }} />
              <h3 style={{ fontSize: 36, fontWeight: 600, marginBottom: 20, color: '#000' }}>ERP 系统</h3>
              <p style={{ fontSize: 16, color: '#666', marginBottom: 32, lineHeight: 1.8 }}>
                采购管理 · 生产管理 · 库存管理
              </p>
              <a href="#" style={{ fontSize: 16, color: '#000', textDecoration: 'none', fontWeight: 500 }}>
                了解更多 →
              </a>
            </motion.div>

            {/* 财务管理 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center' }}
            >
              <BarChartOutlined style={{ fontSize: 100, color: '#000', marginBottom: 40 }} />
              <h3 style={{ fontSize: 36, fontWeight: 600, marginBottom: 20, color: '#000' }}>财务管理</h3>
              <p style={{ fontSize: 16, color: '#666', marginBottom: 32, lineHeight: 1.8 }}>
                应收应付 · 发票管理 · 成本核算
              </p>
              <a href="#" style={{ fontSize: 16, color: '#000', textDecoration: 'none', fontWeight: 500 }}>
                了解更多 →
              </a>
            </motion.div>

            {/* 售后服务 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ textAlign: 'center' }}
            >
              <TeamOutlined style={{ fontSize: 100, color: '#000', marginBottom: 40 }} />
              <h3 style={{ fontSize: 36, fontWeight: 600, marginBottom: 20, color: '#000' }}>售后服务</h3>
              <p style={{ fontSize: 16, color: '#666', marginBottom: 32, lineHeight: 1.8 }}>
                服务请求 · 工单管理 · 客户反馈
              </p>
              <a href="#" style={{ fontSize: 16, color: '#000', textDecoration: 'none', fontWeight: 500 }}>
                了解更多 →
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 品牌理念 - 大疆风格（大留白/简洁文字） */}
      <div id="about" style={{ padding: '200px 50px', background: '#f5f5f5', textAlign: 'center' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: 48, fontWeight: 700, marginBottom: 40, color: '#000' }}
        >
          用科技定义未来
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: 20, color: '#666', maxWidth: 800, margin: '0 auto', lineHeight: 2 }}
        >
          四川道达智能车辆制造有限公司专注于电动车制造与企业数字化管理系统研发，
          以创新技术推动行业发展，为客户提供卓越的产品与服务。
        </motion.p>
      </div>

      {/* 页脚 - 大疆风格（极简黑白） */}
      <div id="contact" style={{ padding: '80px 50px', background: '#000', color: '#fff' }}>
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

export default Home
