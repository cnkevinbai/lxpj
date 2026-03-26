/**
 * 全球服务页面
 * 统一风格版本 - 不使用Ant Design
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const t = {
    zh: {
      brand: '道达智能',
      brandEn: 'DAODA',
      navHome: '首页',
      navProducts: '产品中心',
      navCases: '成功案例',
      navNews: '新闻动态',
      navGlobal: '全球服务',
      navAbout: '关于道达',
      
      heroTag: '全球服务体系',
      heroTitle: '全方位服务体系',
      heroDesc: '贯穿客户全生命周期的专业服务支持，助力客户成功',
      
      servicePackTitle: '服务体系',
      servicePack1: '售前服务',
      servicePack1Desc: '专业咨询团队为您提供全方位的需求分析和技术支持',
      servicePack2: '售中服务',
      servicePack2Desc: '全流程跟踪服务，确保项目按时保质交付',
      servicePack3: '售后服务',
      servicePack3Desc: '7×24小时技术支持，持续保障系统稳定运行',
      
      servicePre1: '需求咨询',
      servicePre2: '方案设计',
      servicePre3: '产品选型',
      servicePre4: '商务洽谈',
      
      serviceDuring1: '订单跟踪',
      serviceDuring2: '生产监造',
      serviceDuring3: '物流配送',
      serviceDuring4: '安装调试',
      
      serviceAfter1: '技术培训',
      serviceAfter2: '维修保养',
      serviceAfter3: '配件供应',
      serviceAfter4: '远程支持',
      
      processTitle: '服务流程',
      processStep1: '需求沟通',
      processStep1Desc: '了解客户实际需求，进行初步需求分析',
      processStep2: '方案制定',
      processStep2Desc: '提供定制化的解决方案',
      processStep3: '合同签订',
      processStep3Desc: '明确双方权责，签订服务合同',
      processStep4: '生产交付',
      processStep4Desc: '按时保质完成产品生产与交付',
      processStep5: '安装调试',
      processStep5Desc: '现场安装与技术培训',
      processStep6: '售后支持',
      processStep6Desc: '持续的技术支持与服务保障',
      
      faqTitle: '常见问题',
      faq1: '车辆质保期是多久？',
      faq1Desc: '整车质保 1 年，核心部件质保 2 年',
      faq2: '如何获取配件？',
      faq2Desc: '可通过官网配件中心在线订购，或联系当地服务中心',
      faq3: '是否提供培训？',
      faq3Desc: '提供免费操作培训和技术培训',
      faq4: '响应时间多长？',
      faq4Desc: '2小时内响应，24小时内到达现场（视距离而定）',
      
      contactTitle: '联系我们',
      contactPhone: '服务热线',
      contactEmail: '电子邮箱',
      contactAddress: '公司地址',
      
      footerDesc: '自 2012 年起深耕智能出行解决方案。加入我们，共同重新定义出行的未来。',
      footerProducts: '产品中心',
      footerSolutions: '智慧方案',
      footerCopyright: '© 2024 道达智能科技(深圳)有限公司。保留所有权利。',
    },
    en: {
      brand: 'DAODA',
      brandEn: 'Smart',
      navHome: 'Home',
      navProducts: 'Products',
      navCases: 'Cases',
      navNews: 'News',
      navGlobal: 'Global',
      navAbout: 'About',
      
      heroTag: 'Global Service System',
      heroTitle: 'Comprehensive Service System',
      heroDesc: 'Professional service support throughout the customer lifecycle, empowering customer success',
      
      servicePackTitle: 'Service Packages',
      servicePack1: 'Pre-sales',
      servicePack1Desc: 'Professional consultation team providing comprehensive需求 analysis and technical support',
      servicePack2: 'During sales',
      servicePack2Desc: 'Full-process tracking service ensuring on-time and quality delivery',
      servicePack3: 'After-sales',
      servicePack3Desc: '7×24-hour technical support ensuring continuous system stability',
      
      servicePre1: 'Consultation',
      servicePre2: 'Solution Design',
      servicePre3: 'Product Selection',
      servicePre4: 'Business Negotiation',
      
      serviceDuring1: 'Order Tracking',
      serviceDuring2: 'Production Supervision',
      serviceDuring3: 'Logistics Delivery',
      serviceDuring4: 'Installation & Debugging',
      
      serviceAfter1: 'Technical Training',
      serviceAfter2: 'Maintenance',
      serviceAfter3: 'Parts Supply',
      serviceAfter4: 'Remote Support',
      
      processTitle: 'Service Process',
      processStep1: 'Requirement Communication',
      processStep1Desc: 'Understanding customer needs and conducting initial analysis',
      processStep2: 'Solution Development',
      processStep2Desc: 'Providing customized solutions',
      processStep3: 'Contract Signing',
      processStep3Desc: 'Clarifying responsibilities and signing contract',
      processStep4: 'Production & Delivery',
      processStep4Desc: 'On-time and quality product delivery',
      processStep5: 'Installation & Commissioning',
      processStep5Desc: 'On-site installation and technical training',
      processStep6: 'After-sales Support',
      processStep6Desc: 'Continuous technical support and service guarantee',
      
      faqTitle: 'Frequently Asked Questions',
      faq1: 'What is the vehicle warranty period?',
      faq1Desc: 'Whole vehicle Warranty 1 year, core components 2 years',
      faq2: 'How to get spare parts?',
      faq2Desc: 'Online order through official spare parts center or contact local service center',
      faq3: 'Do you provide training?',
      faq3Desc: 'Free operation training and technical training provided',
      faq4: 'What is the response time?',
      faq4Desc: '2 hours response, 24 hours on-site (distance dependent)',
      
      contactTitle: 'Contact Us',
      contactPhone: 'Service Hotline',
      contactEmail: 'Email Address',
      contactAddress: 'Company Address',
      
      footerDesc: 'Specializing in smart mobility solutions since 2012. Join us in redefining the future.',
      footerProducts: 'Products',
      footerSolutions: 'Solutions',
      footerCopyright: '© 2024 DAODA Smart Technology. All rights reserved.',
    },
  };

  const currentText = t[language];

  const faqs = [
    { title: currentText.faq1, content: currentText.faq1Desc },
    { title: currentText.faq2, content: currentText.faq2Desc },
    { title: currentText.faq3, content: currentText.faq3Desc },
    { title: currentText.faq4, content: currentText.faq4Desc },
  ];

  return (
    <div className="services-page daoda-page">
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
              <Link to="/">{currentText.navHome}</Link>
              <Link to="/products">{currentText.navProducts}</Link>
              <Link to="/cases">{currentText.navCases}</Link>
              <Link to="/news">{currentText.navNews}</Link>
              <Link to="/services" className="active">{currentText.navGlobal}</Link>
              <Link to="/about">{currentText.navAbout}</Link>
            </nav>
          </div>
          <div className="daoda-header-right">
            <div className="daoda-lang-switch">
              <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
            <Link to="/login" className="daoda-login-btn">登录</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="daoda-hero">
        <div className="daoda-hero-bg">
          <div className="daoda-hero-gradient"></div>
          <div className="daoda-hero-image daoda-hero-services"></div>
        </div>
        <div className="daoda-hero-content">
          <div className="daoda-hero-badge">
            <span className="daoda-pulse-dot"></span>
            {currentText.heroTag}
          </div>
          <h1 className="daoda-hero-title">{currentText.heroTitle}</h1>
          <p className="daoda-hero-desc">{currentText.heroDesc}</p>
        </div>
      </section>

      {/* Service Packages */}
      <section className="daoda-services">
        <div className="daoda-section-container">
          <div className="daoda-section-header daoda-center">
            <span className="daoda-section-tag">{currentText.servicePackTitle}</span>
            <h2 className="daoda-section-title">Complete Service Coverage</h2>
          </div>
          
          <div className="daoda-services-grid">
            <div className="daoda-service-card daoda-glass-panel">
              <div className="daoda-service-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 10l2 2 6-6 6 6 2-2V9H7v1z"/>
                </svg>
              </div>
              <h3>{currentText.servicePack1}</h3>
              <p>{currentText.servicePack1Desc}</p>
              <ul className="daoda-service-list">
                <li>{currentText.servicePre1}</li>
                <li>{currentText.servicePre2}</li>
                <li>{currentText.servicePre3}</li>
                <li>{currentText.servicePre4}</li>
              </ul>
            </div>
            
            <div className="daoda-service-card daoda-glass-panel">
              <div className="daoda-service-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3>{currentText.servicePack2}</h3>
              <p>{currentText.servicePack2Desc}</p>
              <ul className="daoda-service-list">
                <li>{currentText.serviceDuring1}</li>
                <li>{currentText.serviceDuring2}</li>
                <li>{currentText.serviceDuring3}</li>
                <li>{currentText.serviceDuring4}</li>
              </ul>
            </div>
            
            <div className="daoda-service-card daoda-glass-panel">
              <div className="daoda-service-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H5v-4h5v4zm0-6H5V9h5v2zm6 10h-5v-4h5v4zm0-6h-5V9h5v2z"/>
                </svg>
              </div>
              <h3>{currentText.servicePack3}</h3>
              <p>{currentText.servicePack3Desc}</p>
              <ul className="daoda-service-list">
                <li>{currentText.serviceAfter1}</li>
                <li>{currentText.serviceAfter2}</li>
                <li>{currentText.serviceAfter3}</li>
                <li>{currentText.serviceAfter4}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="daoda-process">
        <div className="daoda-section-container">
          <div className="daoda-section-header daoda-center">
            <span className="daoda-section-tag">{currentText.processTitle}</span>
            <h2 className="daoda-section-title">Service Process Timeline</h2>
          </div>
          
          <div className="daoda-timeline">
            <div className="daoda-timeline-item">
              <div className="daoda-timeline-dot"></div>
              <div className="daoda-timeline-content daoda-glass-panel">
                <h4>{currentText.processStep1}</h4>
                <p>{currentText.processStep1Desc}</p>
              </div>
            </div>
            <div className="daoda-timeline-item">
              <div className="daoda-timeline-dot"></div>
              <div className="daoda-timeline-content daoda-glass-panel">
                <h4>{currentText.processStep2}</h4>
                <p>{currentText.processStep2Desc}</p>
              </div>
            </div>
            <div className="daoda-timeline-item">
              <div className="daoda-timeline-dot"></div>
              <div className="daoda-timeline-content daoda-glass-panel">
                <h4>{currentText.processStep3}</h4>
                <p>{currentText.processStep3Desc}</p>
              </div>
            </div>
            <div className="daoda-timeline-item">
              <div className="daoda-timeline-dot"></div>
              <div className="daoda-timeline-content daoda-glass-panel">
                <h4>{currentText.processStep4}</h4>
                <p>{currentText.processStep4Desc}</p>
              </div>
            </div>
            <div className="daoda-timeline-item">
              <div className="daoda-timeline-dot"></div>
              <div className="daoda-timeline-content daoda-glass-panel">
                <h4>{currentText.processStep5}</h4>
                <p>{currentText.processStep5Desc}</p>
              </div>
            </div>
            <div className="daoda-timeline-item">
              <div className="daoda-timeline-dot"></div>
              <div className="daoda-timeline-content daoda-glass-panel">
                <h4>{currentText.processStep6}</h4>
                <p>{currentText.processStep6Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="daoda-faq">
        <div className="daoda-section-container">
          <div className="daoda-section-header daoda-center">
            <span className="daoda-section-tag">{currentText.faqTitle}</span>
            <h2 className="daoda-section-title">Frequently Asked Questions</h2>
          </div>
          
          <div className="daoda-faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="daoda-faq-item daoda-glass-panel">
                <h4>{faq.title}</h4>
                <p>{faq.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="daoda-contact-info">
        <div className="daoda-section-container">
          <div className="daoda-section-header daoda-center">
            <span className="daoda-section-tag">{currentText.contactTitle}</span>
            <h2 className="daoda-section-title">Get In Touch</h2>
          </div>
          
          <div className="daoda-contact-grid">
            <div className="daoda-contact-card daoda-glass-panel">
              <div className="daoda-contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <h4>{currentText.contactPhone}</h4>
              <p>400-888-8888</p>
            </div>
            
            <div className="daoda-contact-card daoda-glass-panel">
              <div className="daoda-contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h4>{currentText.contactEmail}</h4>
              <p>service@daoda.com</p>
            </div>
            
            <div className="daoda-contact-card daoda-glass-panel">
              <div className="daoda-contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h4>{currentText.contactAddress}</h4>
              <p>四川省眉山市</p>
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
            </div>
            <div className="daoda-footer-col">
              <h5>{currentText.footerProducts}</h5>
              <ul>
                <li><Link to="/products">电动观光车系列</Link></li>
                <li><Link to="/products">智能高尔夫球车</Link></li>
                <li><Link to="/products">经典老爷车系列</Link></li>
                <li><Link to="/products">工业及特种车辆</Link></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>{currentText.footerSolutions}</h5>
              <ul>
                <li><a href="#">智慧城市机动</a></li>
                <li><a href="#">景区及园区管理</a></li>
                <li><a href="#">数字化运营平台</a></li>
                <li><a href="#">核心动力电池技术</a></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>全球服务</h5>
              <ul>
                <li><Link to="/services">全球网络</Link></li>
                <li><Link to="/services">服务体系</Link></li>
                <li><Link to="/services">服务流程</Link></li>
                <li><Link to="/services">联系我们</Link></li>
              </ul>
            </div>
          </div>
          <div className="daoda-footer-bottom">
            <p>{currentText.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
