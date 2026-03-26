/**
 * 产品详情页面 - 重构版本
 * 统一风格：深色主题、daoda-前缀、自定义组件
 */
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ProductDetail.css'

// 模拟产品数据
const productData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'DD-6 电动观光车',
    nameEn: 'DD-6 Electric Sightseeing Vehicle',
    series: '观光车',
    seriesEn: 'Sightseeing',
    price: '¥58,000起',
    priceEn: 'From ¥58,000',
    description: '经典款电动观光车，适用于景区、园区、度假村等场景',
    descriptionEn: 'Classic electric sightseeing vehicle for scenic areas, parks, and resorts',
    specs: {
      '车身尺寸': '3200×1200×1800mm',
      '车身尺寸En': '3200×1200×1800mm',
      '额定乘员': '6人',
      '额定乘员En': '6 passengers',
      '最高车速': '25km/h',
      '最高车速En': '25km/h',
      '续航里程': '80-100km',
      '续航里程En': '80-100km',
      '电池类型': '锂电池',
      '电池类型En': 'Lithium Battery',
      '充电时间': '6-8小时',
      '充电时间En': '6-8 hours',
    },
    features: [
      '静音环保，零排放',
      '智能调速系统',
      '舒适座椅设计',
      'LED 灯光系统',
      '可选配音响系统',
    ],
    featuresEn: [
      'Quiet and eco-friendly, zero emissions',
      'Intelligent speed control system',
      'Comfortable seat design',
      'LED lighting system',
      'Optional audio system',
    ],
    images: [
      'https://via.placeholder.com/400x300?text=Product+View+1',
      'https://via.placeholder.com/400x300?text=Product+View+2',
      'https://via.placeholder.com/400x300?text=Product+View+3',
    ],
    documents: [
      { name: '产品说明书', nameEn: 'Product Manual', size: '2.5MB' },
      { name: '技术参数表', nameEn: 'Technical Specifications', size: '1.2MB' },
      { name: '安装指南', nameEn: 'Installation Guide', size: '1.8MB' },
    ],
  },
  '2': {
    id: '2',
    name: 'Tour Pro 长续航版',
    nameEn: 'Tour Pro Extended Range',
    series: '城市通勤',
    seriesEn: 'City Commuter',
    price: '¥78,000起',
    priceEn: 'From ¥78,000',
    description: '升级版长续航电动观光车，适合中长途观光线路',
    descriptionEn: 'Upgraded extended range electric sightseeing vehicle for medium-to-long distance tours',
    specs: {
      '车身尺寸': '3500×1250×1900mm',
      '车身尺寸En': '3500×1250×1900mm',
      '额定乘员': '8人',
      '额定乘员En': '8 passengers',
      '最高车速': '30km/h',
      '最高车速En': '30km/h',
      '续航里程': '120-150km',
      '续航里程En': '120-150km',
      '电池类型': '磷酸铁锂电池',
      '电池类型En': 'Lithium Iron Phosphate',
      '充电时间': '4-6小时',
      '充电时间En': '4-6 hours',
    },
    features: [
      '超长续航能力',
      '快速充电技术',
      '增强型悬架系统',
      '全景玻璃车顶',
      '多功能仪表盘',
    ],
    featuresEn: [
      'Ultra-long range capability',
      'Fast charging technology',
      'Enhanced suspension system',
      'Panoramic glass roof',
      'Multi-functional dashboard',
    ],
    images: [
      'https://via.placeholder.com/400x300?text=Tour+Pro+1',
      'https://via.placeholder.com/400x300?text=Tour+Pro+2',
    ],
    documents: [
      { name: '产品说明书', nameEn: 'Product Manual', size: '3.2MB' },
      { name: '技术参数表', nameEn: 'Technical Specifications', size: '1.5MB' },
    ],
  },
}

const ProductDetail: React.FC = () => {
  const { id } = useParams()
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [activeTab, setActiveTab] = useState('specs')

  const product = productData[id || '1'] || productData['1']

  const currentText = {
    breadcrumbHome: language === 'zh' ? '首页' : 'Home',
    breadcrumbProducts: language === 'zh' ? '产品中心' : 'Products',
    inquire: language === 'zh' ? '询价' : 'Inquire',
    consult: language === 'zh' ? '咨询' : 'Consult',
    specifications: language === 'zh' ? '详细参数' : 'Specifications',
    documents: language === 'zh' ? '技术文档' : 'Documents',
    features: language === 'zh' ? '产品特点' : 'Features',
    phoneNumber: language === 'zh' ? '400-888-8888' : '+86-755-88888888',
  }

  const getLocalizedString = (zh: string, en: string) => {
    return language === 'zh' ? zh : en
  }

  const getCategoryLocalizedString = (cat: string) => {
    if (cat === '观光车') return language === 'zh' ? '观光车系列' : 'Sightseeing Series'
    if (cat === '城市通勤') return language === 'zh' ? '城市通勤系列' : 'City Commuter Series'
    return cat
  }

  return (
    <div className="daoda-product-detail-page">
      {/* Header */}
      <header className="daoda-product-detail-header">
        <div className="daoda-product-detail-header-inner">
          <div className="daoda-header-left">
            <Link to="/" className="daoda-brand-link">
              <div className="daoda-brand-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span className="daoda-brand-text">道达智能</span>
            </Link>
            <nav className="daoda-main-nav">
              <Link to="/">{currentText.breadcrumbHome}</Link>
              <Link to="/products">{currentText.breadcrumbProducts}</Link>
              <Link to="/about">{language === 'zh' ? '关于道达' : 'About'}</Link>
            </nav>
          </div>
          <div className="daoda-header-right">
            <div className="daoda-lang-switch">
              <button 
                className={language === 'zh' ? 'active' : ''} 
                onClick={() => setLanguage('zh')}
              >
                中文
              </button>
              <button 
                className={language === 'en' ? 'active' : ''} 
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
            <Link to="/login" className="daoda-login-btn">
              {language === 'zh' ? '登录' : 'Login'}
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="daoda-breadcrumb">
        <div className="daoda-container">
          <Link to="/">{currentText.breadcrumbHome}</Link>
          <span className="daoda-breadcrumb-separator">/</span>
          <Link to="/products">{currentText.breadcrumbProducts}</Link>
          <span className="daoda-breadcrumb-separator">/</span>
          <span className="daoda-breadcrumb-current">{getLocalizedString(product.name, product.nameEn)}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="daoda-product-detail">
        <div className="daoda-container">
          <div className="daoda-product-detail-grid">
            {/* Image Gallery */}
            <div className="daoda-image-gallery">
              <div className="daoda-main-image">
                <span>{getLocalizedString(product.name, product.nameEn)}</span>
              </div>
              <div className="daoda-thumb-grid">
                {product.images.map((img: string, index: number) => (
                  <div 
                    key={index} 
                    className="daoda-thumb-item"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="daoda-product-info">
              <div className="daoda-product-meta">
                <span className="daoda-series-tag">
                  {getCategoryLocalizedString(product.series)}
                </span>
              </div>

              <h1 className="daoda-product-title">
                {getLocalizedString(product.name, product.nameEn)}
              </h1>

              <div className="daoda-product-price">
                {getLocalizedString(product.price, product.priceEn)}
              </div>

              <p className="daoda-product-description">
                {getLocalizedString(product.description, product.descriptionEn)}
              </p>

              {/* Features */}
              <div className="daoda-features">
                <h3>{currentText.features}</h3>
                <ul>
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      {getLocalizedString(feature, feature)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="daoda-actions">
                <button className="daoda-btn-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  {currentText.inquire}
                </button>
                <button className="daoda-btn-secondary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2c.35.97.59 2 .68 3.19l-3.19.68zM14.6 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                  </svg>
                  {currentText.consult}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="daoda-tabs-section">
            <div className="daoda-tabs-bar">
              <button 
                className={`daoda-tab ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                {currentText.specifications}
              </button>
              <button 
                className={`daoda-tab ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                {currentText.documents}
              </button>
            </div>

            <div className="daoda-tabs-content">
              {activeTab === 'specs' && (
                <div className="daoda-specifications">
                  <div className="daoda-specs-grid">
                    {Object.entries(product.specs).map((entry: [string, any], idx: number) => {
                      const [key, value] = entry
                      if (!value || typeof value !== 'string' || key.endsWith('En')) return null
                      const enKey = key + 'En'
                      const label = getLocalizedString(key, enKey in product.specs ? product.specs[enKey] : key)
                      return (
                        <div key={idx} className="daoda-spec-item">
                          <span className="daoda-spec-label">{label}</span>
                          <span className="daoda-spec-value">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="daoda-documents">
                  <div className="daoda-doc-grid">
                    {product.documents.map((doc: { name: string; nameEn: string; size: string }, index: number) => (
                      <a key={index} href="#" className="daoda-doc-item">
                        <div className="daoda-doc-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-9V3.5L18.5 9H13z"/>
                          </svg>
                        </div>
                        <div className="daoda-doc-info">
                          <h4>{getLocalizedString(doc.name, doc.nameEn)}</h4>
                          <span className="daoda-doc-size">{doc.size}</span>
                        </div>
                        <button type="button" className="daoda-doc-btn">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                          </svg>
                        </button>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="daoda-footer">
        <div className="daoda-footer-container">
          <div className="daoda-footer-grid">
            <div>
              <Link to="/" className="daoda-footer-brand">
                <div className="daoda-brand-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <span>道达智能</span>
              </Link>
              <p className="daoda-footer-desc">
                {language === 'zh' 
                  ? '自 2012 年起深耕智能出行解决方案。加入我们，共同重新定义出行的未来。' 
                  : 'Specializing in smart mobility solutions since 2012. Join us in redefining the future.'}
              </p>
            </div>
            <div className="daoda-footer-col">
              <h5>{language === 'zh' ? '产品中心' : 'Products'}</h5>
              <ul>
                <li><Link to="/products">{language === 'zh' ? '电动观光车系列' : 'Electric Sightseeing'}</Link></li>
                <li><Link to="/products">{language === 'zh' ? '智能高尔夫球车' : 'Smart Golf Carts'}</Link></li>
                <li><Link to="/products">{language === 'zh' ? '经典老爷车系列' : 'Vintage Classics'}</Link></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>{language === 'zh' ? '智慧方案' : 'Solutions'}</h5>
              <ul>
                <li><a href="#">{language === 'zh' ? '智慧城市机动' : 'Smart City Mobility'}</a></li>
                <li><a href="#">{language === 'zh' ? '景区及园区管理' : 'Park Management'}</a></li>
                <li><a href="#">{language === 'zh' ? '数字化运营平台' : 'Digital Platform'}</a></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>{language === 'zh' ? '联系道达' : 'Contact'}</h5>
              <ul>
                <li><a href="mailto:contact@daoda.com">contact@daoda.com</a></li>
                <li><a href="tel:400-888-8888">{currentText.phoneNumber}</a></li>
              </ul>
            </div>
          </div>
          <div className="daoda-footer-bottom">
            <p>
              © 2024 道达智能科技(深圳)有限公司。保留所有权利。
              {' | '}
              <a href="#">{language === 'zh' ? '隐私政策' : 'Privacy Policy'}</a>
              {' | '}
              <a href="#">{language === 'zh' ? '服务条款' : 'Terms of Service'}</a>
            </p>
            <div className="daoda-footer-social">
              <a href="#" className="daoda-social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
              </a>
              <a href="#" className="daoda-social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductDetail
