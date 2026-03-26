import { useState } from 'react'
import { Button, Typography, Card, Space, Divider, Image, Tabs } from 'antd'
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Title, Paragraph } = Typography

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const specs = {
    '基本参数': [
      { label: '车型', value: 'DD-T100 新能源观光车' },
      { label: '座位数', value: '11-14 座' },
      { label: '车身尺寸', value: '5200×1600×2000mm' },
      { label: '整车质量', value: '850kg' },
    ],
    '动力系统': [
      { label: '电机功率', value: '5kW AC 电机' },
      { label: '电池类型', value: '磷酸铁锂电池' },
      { label: '电池容量', value: '72V 200Ah' },
      { label: '续航里程', value: '≥800km' },
    ],
    '性能参数': [
      { label: '最高车速', value: '30km/h' },
      { label: '最大爬坡', value: '≥20%' },
      { label: '最小转弯半径', value: '≤5.5m' },
      { label: '制动距离', value: '≤5m (20km/h)' },
    ],
    '充电参数': [
      { label: '充电电压', value: '220V/50Hz' },
      { label: '充电时间', value: '6-8 小时' },
      { label: '快充时间', value: '2 小时 (可选)' },
      { label: '充电方式', value: '车载充电机' },
    ],
  }

  const features = [
    { icon: <ThunderboltOutlined />, title: '超长续航', desc: '800km 续航，满足全天运营需求' },
    { icon: <SafetyOutlined />, title: '智能驾驶辅助', desc: 'L2 级驾驶辅助，主动安全预警' },
    { icon: <GlobalOutlined />, title: '智能网联', desc: '5G 联网，远程监控和调度' },
    { icon: <CheckCircleOutlined />, title: '快速充电', desc: '2 小时快充，运营不间断' },
  ]

  return (
    <div className="product-detail-page">
      {/* Header */}
      <header className="detail-header">
        <div className="header-content">
          <Link to="/products" className="back-btn">
            <ArrowLeftOutlined /> 返回产品列表
          </Link>
          <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>新能源观光车</Title>
        </div>
      </header>

      {/* Hero */}
      <section className="product-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <Title className="product-title">DD-T100 新能源观光车</Title>
              <Paragraph className="product-subtitle">经典系列 · 传承，进化</Paragraph>
              <div className="hero-price">
                <span className="price-label">指导价</span>
                <span className="price-value">¥ 188,000 起</span>
              </div>
              <div className="hero-actions">
                <Button type="primary" size="large" shape="round">预约试驾</Button>
                <Button size="large" shape="round" icon={<DownloadOutlined />}>下载手册</Button>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-placeholder">🚗</div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心特性 */}
      <section className="features-section">
        <div className="container">
          <Title level={2} className="section-title">核心特性</Title>
          <div className="features-grid">
            {features.map((feature, i) => (
              <Card key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.desc}</Paragraph>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 产品详情 Tabs */}
      <section className="details-section">
        <div className="container">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="product-tabs"
            items={[
              {
                key: 'overview',
                label: '产品概述',
                children: (
                  <div className="tab-content">
                    <Title level={3}>产品设计理念</Title>
                    <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                      DD-T100 新能源观光车秉承"传承·进化"的设计理念，在经典造型基础上融入现代科技元素。
                      车身采用流线型设计，风阻系数低至 0.35，有效提升续航里程。内饰采用环保材料，
                      配备智能中控系统，为乘客提供舒适安全的乘坐体验。
                    </Paragraph>
                    <Divider />
                    <Title level={3}>应用场景</Title>
                    <div className="scenarios-grid">
                      <Card className="scenario-card">
                        <div className="scenario-icon">🏞️</div>
                        <Title level={5}>景区接驳</Title>
                        <Paragraph>适用于各类景区、公园的游客接驳服务</Paragraph>
                      </Card>
                      <Card className="scenario-card">
                        <div className="scenario-icon">🏨</div>
                        <Title level={5}>酒店度假村</Title>
                        <Paragraph>高端酒店、度假村的宾客接送服务</Paragraph>
                      </Card>
                      <Card className="scenario-card">
                        <div className="scenario-icon">🏌️</div>
                        <Title level={5}>高尔夫球场</Title>
                        <Paragraph>高尔夫球场的球手和球具运输</Paragraph>
                      </Card>
                      <Card className="scenario-card">
                        <div className="scenario-icon">🏭</div>
                        <Title level={5}>工业园区</Title>
                        <Paragraph>大型园区的内部通勤和接待</Paragraph>
                      </Card>
                    </div>
                  </div>
                ),
              },
              {
                key: 'specs',
                label: '规格参数',
                children: (
                  <div className="tab-content">
                    {Object.entries(specs).map(([category, items]) => (
                      <div key={category} className="specs-category">
                        <Title level={4}>{category}</Title>
                        <div className="specs-grid">
                          {items.map((spec, i) => (
                            <div key={i} className="spec-item">
                              <span className="spec-label">{spec.label}</span>
                              <span className="spec-value">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'gallery',
                label: '产品图片',
                children: (
                  <div className="tab-content">
                    <div className="gallery-grid">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="gallery-item">
                          <div className="image-placeholder">图片{i}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                key: 'download',
                label: '下载中心',
                children: (
                  <div className="tab-content">
                    <div className="download-list">
                      {[
                        { name: '产品手册', type: 'PDF', size: '15.2 MB' },
                        { name: '技术规格书', type: 'PDF', size: '3.8 MB' },
                        { name: '用户操作指南', type: 'PDF', size: '8.5 MB' },
                        { name: '维护保养手册', type: 'PDF', size: '5.2 MB' },
                        { name: '宣传视频', type: 'MP4', size: '256 MB' },
                      ].map((file, i) => (
                        <Card key={i} className="download-card">
                          <Space size="large">
                            <div className="download-icon">📄</div>
                            <div className="download-info">
                              <Title level={5} style={{ margin: 0 }}>{file.name}</Title>
                              <Paragraph type="secondary" style={{ margin: 0 }}>{file.type} · {file.size}</Paragraph>
                            </div>
                            <Button icon={<DownloadOutlined />}>下载</Button>
                          </Space>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <Title level={2} style={{ color: '#FFFFFF', marginBottom: 16 }}>感兴趣吗？</Title>
          <Paragraph style={{ color: '#E0E0E0', fontSize: 18, marginBottom: 32 }}>
            立即预约试驾或联系我们的销售团队获取详细报价
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" shape="round">预约试驾</Button>
            <Button size="large" shape="round">联系销售</Button>
          </Space>
        </div>
      </section>

      <style>{`
        .product-detail-page { background: #F8F9FA; min-height: 100vh; }
        
        .detail-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(5, 5, 5, 0.95);
          backdrop-filter: blur(20px);
          padding: 16px 0;
        }
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .back-btn {
          color: #E0E0E0;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s;
        }
        .back-btn:hover { color: #0066FF; }
        
        .product-hero {
          padding: 120px 0 80px;
          background: linear-gradient(135deg, #050505 0%, #0A0A0A 100%);
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .product-title {
          color: #FFFFFF !important;
          font-size: 56px !important;
          margin-bottom: 16px !important;
        }
        .product-subtitle {
          color: #A0A0A0 !important;
          font-size: 24px !important;
          margin-bottom: 32px !important;
        }
        .hero-price {
          margin-bottom: 32px;
        }
        .price-label {
          display: block;
          color: #8C8C8C;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .price-value {
          font-size: 48px;
          font-weight: bold;
          color: #0066FF;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
        }
        .hero-actions .ant-btn-primary {
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          border: none;
          height: 50px;
          padding: 0 40px;
        }
        .hero-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #1A1A1A 0%, #121212 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
        }
        
        .features-section { padding: 80px 0; background: #FFFFFF; }
        .section-title {
          text-align: center;
          font-size: 42px !important;
          margin-bottom: 64px !important;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .feature-card {
          text-align: center;
          border: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,102,255,0.15);
        }
        .feature-icon {
          font-size: 48px;
          color: #0066FF;
          margin-bottom: 16px;
        }
        
        .details-section { padding: 80px 0; background: #F8F9FA; }
        .product-tabs {
          background: #FFFFFF;
          padding: 32px;
          border-radius: 16px;
        }
        .tab-content { padding: 24px 0; }
        .specs-category { margin-bottom: 40px; }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background: #F8F9FA;
          border-radius: 8px;
        }
        .spec-label { color: #8C8C8C; }
        .spec-value { color: #1A1A1A; font-weight: 500; }
        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .scenario-card { text-align: center; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .scenario-icon { font-size: 48px; margin-bottom: 16px; }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .gallery-item .image-placeholder {
          aspect-ratio: 4/3;
          background: #F0F2F5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8C8C8C;
        }
        .download-list { display: flex; flex-direction: column; gap: 16px; }
        .download-card { border: 1px solid #E0E0E0; }
        .download-icon { font-size: 32px; }
        
        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          text-align: center;
        }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        
        @media (max-width: 1024px) {
          .hero-content { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .specs-grid { grid-template-columns: 1fr; }
          .scenarios-grid { grid-template-columns: repeat(2, 1fr); }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .product-title { font-size: 36px !important; }
          .features-grid { grid-template-columns: 1fr; }
          .hero-actions { flex-direction: column; }
          .scenarios-grid { grid-template-columns: 1fr; }
          .gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

export default ProductDetail
