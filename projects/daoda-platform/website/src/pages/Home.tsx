/**
 * 道达智能官网首页
 * 基于 Tailwind CSS 设计重构
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const t = {
    zh: {
      brand: '道达智能',
      brandEn: 'DAODA',
      navProducts: '产品中心',
      navSolutions: '智慧方案',
      navCases: '成功案例',
      navNews: '新闻动态',
      navGlobal: '全球服务',
      navAbout: '关于道达',
      searchPlaceholder: '搜索系统...',
      login: '登录',
      
      heroTag: '下一代移动出行',
      heroTitle1: '以智能科技',
      heroTitle2: '重新定义出行体验',
      heroDesc: '道达智能 — 全球领先的电动观光车解决方案提供商，致力于通过科技创新为全球客户提供智慧出行方案。',
      btnExplore: '探索产品',
      btnVideo: '观看 2025 愿景',
      
      statsYears: '年深耕经验',
      statsPartners: '全球合作伙伴',
      statsCountries: '国家覆盖',
      statsDevices: '设备在线运行',
      
      productsTag: '产品矩阵',
      productsTitle: '道达产品家族',
      viewCatalog: '查看完整目录',
      product1Title: '电动观光车',
      product1Desc: '专为景区、园区设计的智慧旅游出行方案，全景视野与AI导航。',
      product2Title: '高尔夫球车',
      product2Desc: '高端球场的卓越性能表现，配备智能车队管理系统。',
      product3Title: '经典老爷车',
      product3Desc: '复古美学与现代电力传动工程的完美融合，重塑经典。',
      product4Title: '特种车辆',
      product4Desc: '为工业、救援及特殊任务定制的专业机动解决方案。',
      
      digitalTag: '数字化生态',
      digitalTitle: '智慧运营赋能',
      digitalDesc: '除了卓越硬件，我们还提供驱动车队效率和客户满意度的智能化管理平台。',
      crmTitle: '智能 CRM',
      crmDesc: '深度客户洞察与旅程映射，专为酒店及旅游行业定制设计。',
      erpTitle: '企业 ERP',
      erpDesc: '整合车队维护、库存及运营物流的一站式资源计划系统。',
      serviceTitle: '智慧售后',
      serviceDesc: '预测性维护提醒与实时远程诊断，确保设备运行时间最大化。',
      enterSystem: '进入业务系统',
      
      globalTag: '全球网络',
      globalTitle: '连接未来的全球化版图',
      globalDesc: '服务网点遍布全球 50 多个国家，根据不同地区的机动性需求提供本地化支持与智慧出行方案。',
      europeTitle: '欧洲总部',
      europeLoc: '德国柏林 - 战略创新实验室',
      asiaTitle: '亚太枢纽',
      asiaLoc: '中国深圳 - 卓越制造中心',
      americaTitle: '北美分部',
      americaLoc: '美国硅谷 - 软件研发中心',
      globalService: '全球互联服务',
      
      footerDesc: '自 2012 年起深耕智能出行解决方案。加入我们，共同重新定义出行的未来。',
      footerProducts: '产品中心',
      footerP1: '电动观光车系列',
      footerP2: '智能高尔夫球车',
      footerP3: '经典老爷车系列',
      footerP4: '工业及特种车辆',
      footerSolutions: '智慧方案',
      footerS1: '智慧城市机动',
      footerS2: '景区及园区管理',
      footerS3: '数字化运营平台',
      footerS4: '核心动力电池技术',
      footerNewsletter: '资讯订阅',
      footerNewsletterDesc: '获取最新的科技创新与行业动态。',
      footerEmailPlaceholder: '您的邮箱',
      footerCopyright: '© 2024 道达智能科技(深圳)有限公司。保留所有权利。',
      footerPrivacy: '隐私政策',
      footerTerms: '服务条款',
      footerCookies: 'Cookie 设置',
    },
    en: {
      brand: 'DAODA',
      brandEn: 'Smart',
      navProducts: 'Products',
      navSolutions: 'Solutions',
      navCases: 'Cases',
      navNews: 'News',
      navGlobal: 'Global',
      navAbout: 'About',
      searchPlaceholder: 'Search...',
      login: 'Login',
      
      heroTag: 'Next Generation Mobility',
      heroTitle1: 'Redefining Travel',
      heroTitle2: 'With Smart Technology',
      heroDesc: 'DAODA Smart — Global leader in electric sightseeing vehicle solutions, dedicated to providing smart mobility solutions through technological innovation.',
      btnExplore: 'Explore Products',
      btnVideo: 'Watch 2025 Vision',
      
      statsYears: 'Years Experience',
      statsPartners: 'Global Partners',
      statsCountries: 'Countries',
      statsDevices: 'Devices Online',
      
      productsTag: 'Product Matrix',
      productsTitle: 'DAODA Product Family',
      viewCatalog: 'View Full Catalog',
      product1Title: 'Electric Sightseeing',
      product1Desc: 'Smart tourism mobility for scenic areas with panoramic views and AI navigation.',
      product2Title: 'Golf Carts',
      product2Desc: 'Premium performance for elite courses with intelligent fleet management.',
      product3Title: 'Vintage Classics',
      product3Desc: 'Retro aesthetics meet modern electric engineering, redefining classics.',
      product4Title: 'Special Vehicles',
      product4Desc: 'Customized mobility solutions for industrial, rescue and special missions.',
      
      digitalTag: 'Digital Ecosystem',
      digitalTitle: 'Smart Operations',
      digitalDesc: 'Beyond exceptional hardware, we provide intelligent platforms that drive efficiency.',
      crmTitle: 'Smart CRM',
      crmDesc: 'Deep customer insights and journey mapping for hospitality and tourism.',
      erpTitle: 'Enterprise ERP',
      erpDesc: 'Integrated fleet maintenance, inventory and operations management.',
      serviceTitle: 'Smart Service',
      serviceDesc: 'Predictive maintenance and real-time diagnostics for maximum uptime.',
      enterSystem: 'Enter Business System',
      
      globalTag: 'Global Network',
      globalTitle: 'Connecting the Future',
      globalDesc: 'Service networks in 50+ countries, providing localized support worldwide.',
      europeTitle: 'Europe HQ',
      europeLoc: 'Berlin - Innovation Lab',
      asiaTitle: 'Asia Pacific Hub',
      asiaLoc: 'Shenzhen - Manufacturing Center',
      americaTitle: 'North America',
      americaLoc: 'Silicon Valley - R&D Center',
      globalService: 'Global Connected Service',
      
      footerDesc: 'Specializing in smart mobility solutions since 2012. Join us in redefining the future.',
      footerProducts: 'Products',
      footerP1: 'Electric Sightseeing',
      footerP2: 'Smart Golf Carts',
      footerP3: 'Vintage Classics',
      footerP4: 'Industrial Vehicles',
      footerSolutions: 'Solutions',
      footerS1: 'Smart City Mobility',
      footerS2: 'Park Management',
      footerS3: 'Digital Platform',
      footerS4: 'Battery Technology',
      footerNewsletter: 'Newsletter',
      footerNewsletterDesc: 'Get the latest tech news and industry updates.',
      footerEmailPlaceholder: 'Your Email',
      footerCopyright: '© 2024 DAODA Smart Technology. All rights reserved.',
      footerPrivacy: 'Privacy Policy',
      footerTerms: 'Terms of Service',
      footerCookies: 'Cookie Settings',
    },
  };

  const currentText = t[language];

  return (
    <div className="daoda-home">
      {/* Header */}
      <header className="daoda-header">
        <div className="daoda-header-inner">
          <div className="daoda-header-left">
            <Link to="/" className="daoda-brand">
              <div className="daoda-brand-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span className="daoda-brand-text">
                {currentText.brand} <span className="daoda-brand-highlight">{currentText.brandEn}</span>
              </span>
            </Link>
            <nav className="daoda-nav">
              <Link to="/products">{currentText.navProducts}</Link>
              <Link to="/solutions">{currentText.navSolutions}</Link>
              <Link to="/cases">成功案例</Link>
              <Link to="/news">新闻动态</Link>
              <Link to="/services">{currentText.navGlobal}</Link>
              <Link to="/about">{currentText.navAbout}</Link>
            </nav>
          </div>
          <div className="daoda-header-right">
            <div className="daoda-search">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input type="text" placeholder={currentText.searchPlaceholder} />
            </div>
            <div className="daoda-lang-switch">
              <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
            <Link to="/login" className="daoda-login-btn">{currentText.login}</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="daoda-hero">
        <div className="daoda-hero-bg">
          <div className="daoda-hero-gradient"></div>
          <div className="daoda-hero-image"></div>
        </div>
        <div className="daoda-hero-content">
          <div className="daoda-hero-badge">
            <span className="daoda-pulse-dot"></span>
            {currentText.heroTag}
          </div>
          <h1 className="daoda-hero-title">
            {currentText.heroTitle1}<br/>
            <span className="daoda-gradient-text">{currentText.heroTitle2}</span>
          </h1>
          <p className="daoda-hero-desc">{currentText.heroDesc}</p>
          <div className="daoda-hero-actions">
            <button className="daoda-btn-primary">
              {currentText.btnExplore}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
            <button className="daoda-btn-secondary">
              {currentText.btnVideo}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="daoda-stats">
        <div className="daoda-stats-grid">
          <div className="daoda-stat-card daoda-glass-panel">
            <svg className="daoda-stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            <div className="daoda-stat-number">12+</div>
            <div className="daoda-stat-label">{currentText.statsYears}</div>
          </div>
          <div className="daoda-stat-card daoda-glass-panel">
            <svg className="daoda-stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <div className="daoda-stat-number">500+</div>
            <div className="daoda-stat-label">{currentText.statsPartners}</div>
          </div>
          <div className="daoda-stat-card daoda-glass-panel">
            <svg className="daoda-stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
            </svg>
            <div className="daoda-stat-number">50+</div>
            <div className="daoda-stat-label">{currentText.statsCountries}</div>
          </div>
          <div className="daoda-stat-card daoda-glass-panel">
            <svg className="daoda-stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <div className="daoda-stat-number">10000+</div>
            <div className="daoda-stat-label">{currentText.statsDevices}</div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="daoda-products">
        <div className="daoda-section-container">
          <div className="daoda-section-header">
            <div>
              <span className="daoda-section-tag">{currentText.productsTag}</span>
              <h2 className="daoda-section-title">{currentText.productsTitle}</h2>
            </div>
            <Link to="/products" className="daoda-view-link">
              {currentText.viewCatalog}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </Link>
          </div>
          <div className="daoda-products-grid">
            <div className="daoda-product-card">
              <div className="daoda-product-image daoda-product-1">
                <div className="daoda-product-overlay"></div>
              </div>
              <h3 className="daoda-product-title">{currentText.product1Title}</h3>
              <p className="daoda-product-desc">{currentText.product1Desc}</p>
            </div>
            <div className="daoda-product-card">
              <div className="daoda-product-image daoda-product-2">
                <div className="daoda-product-overlay"></div>
              </div>
              <h3 className="daoda-product-title">{currentText.product2Title}</h3>
              <p className="daoda-product-desc">{currentText.product2Desc}</p>
            </div>
            <div className="daoda-product-card">
              <div className="daoda-product-image daoda-product-3">
                <div className="daoda-product-overlay"></div>
              </div>
              <h3 className="daoda-product-title">{currentText.product3Title}</h3>
              <p className="daoda-product-desc">{currentText.product3Desc}</p>
            </div>
            <div className="daoda-product-card">
              <div className="daoda-product-image daoda-product-4">
                <div className="daoda-product-overlay"></div>
              </div>
              <h3 className="daoda-product-title">{currentText.product4Title}</h3>
              <p className="daoda-product-desc">{currentText.product4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Section */}
      <section className="daoda-digital">
        <div className="daoda-section-container">
          <div className="daoda-section-header daoda-center">
            <span className="daoda-section-tag">{currentText.digitalTag}</span>
            <h2 className="daoda-section-title">{currentText.digitalTitle}</h2>
            <p className="daoda-section-desc">{currentText.digitalDesc}</p>
          </div>
          <div className="daoda-digital-grid">
            <div className="daoda-digital-card">
              <div className="daoda-digital-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
                </svg>
              </div>
              <h3 className="daoda-digital-title">{currentText.crmTitle}</h3>
              <p className="daoda-digital-desc">{currentText.crmDesc}</p>
            </div>
            <div className="daoda-digital-card">
              <div className="daoda-digital-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
                </svg>
              </div>
              <h3 className="daoda-digital-title">{currentText.erpTitle}</h3>
              <p className="daoda-digital-desc">{currentText.erpDesc}</p>
            </div>
            <div className="daoda-digital-card">
              <div className="daoda-digital-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="daoda-digital-title">{currentText.serviceTitle}</h3>
              <p className="daoda-digital-desc">{currentText.serviceDesc}</p>
            </div>
          </div>
          <div className="daoda-digital-cta">
            <Link to="/portal/crm" className="daoda-enter-link">
              {currentText.enterSystem}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Section */}
      <section className="daoda-global">
        <div className="daoda-section-container">
          <div className="daoda-global-content">
            <div>
              <span className="daoda-section-tag">{currentText.globalTag}</span>
              <h2 className="daoda-global-title">{currentText.globalTitle}</h2>
              <p className="daoda-global-desc">{currentText.globalDesc}</p>
              <div className="daoda-locations-list">
                <div className="daoda-location-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div>
                    <h4>{currentText.europeTitle}</h4>
                    <p>{currentText.europeLoc}</p>
                  </div>
                </div>
                <div className="daoda-location-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div>
                    <h4>{currentText.asiaTitle}</h4>
                    <p>{currentText.asiaLoc}</p>
                  </div>
                </div>
                <div className="daoda-location-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div>
                    <h4>{currentText.americaTitle}</h4>
                    <p>{currentText.americaLoc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="daoda-global-map">
              <div className="daoda-map-bg"></div>
              <div className="daoda-global-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
                </svg>
                {currentText.globalService}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <span>{currentText.brand}</span>
              </Link>
              <p className="daoda-footer-desc">{currentText.footerDesc}</p>
              <div className="daoda-social-links">
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
            <div className="daoda-footer-col">
              <h5>{currentText.footerProducts}</h5>
              <ul>
                <li><Link to="/products">{currentText.footerP1}</Link></li>
                <li><Link to="/products">{currentText.footerP2}</Link></li>
                <li><Link to="/products">{currentText.footerP3}</Link></li>
                <li><Link to="/products">{currentText.footerP4}</Link></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>{currentText.footerSolutions}</h5>
              <ul>
                <li><a href="#">{currentText.footerS1}</a></li>
                <li><a href="#">{currentText.footerS2}</a></li>
                <li><a href="#">{currentText.footerS3}</a></li>
                <li><a href="#">{currentText.footerS4}</a></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>{currentText.footerNewsletter}</h5>
              <p>{currentText.footerNewsletterDesc}</p>
              <div className="daoda-newsletter-form">
                <input type="email" placeholder={currentText.footerEmailPlaceholder} />
                <button type="submit">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="daoda-footer-bottom">
            <p>{currentText.footerCopyright}</p>
            <div className="daoda-footer-legal">
              <a href="#">{currentText.footerPrivacy}</a>
              <a href="#">{currentText.footerTerms}</a>
              <a href="#">{currentText.footerCookies}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;