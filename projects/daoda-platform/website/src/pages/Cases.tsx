/**
 * 成功案例中心 V2 - 中英双语版
 * 基于 Figma 设计实现
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cases.css';

const Cases: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');

  const t = {
    zh: {
      // Hero
      heroTitle: '成功案例库',
      heroDesc: '探索我们如何协助全球各行各业实现数字化转型，并取得可衡量的卓越成效。',
      btnExplore: '探索故事',
      btnDownload: '下载 PDF 报告',
      
      // 筛选
      filterIndustry: '所有行业',
      filterFinance: '金融',
      filterHealth: '医疗健康',
      filterTech: '科技',
      filterRetail: '零售',
      
      filterRegion: '区域',
      filterGlobal: '全球',
      filterNA: '北美',
      filterEU: '欧洲',
      filterAPAC: '亚太地区',
      
      // 精选案例
      featuredTitle: '精选成功案例',
      viewAll: '查看全部',
      
      // 案例
      case1Industry: '科技',
      case1Company: 'TechCorp Systems',
      case1Title: '云端基础架构的规模化扩张策略',
      case1Desc: '重新设计核心架构以支持 300% 的流量增长，同时将延迟降低 45%。',
      case1Metric: '45%',
      case1MetricLabel: '延迟降低',
      viewCase: '查看案例',
      
      case2Industry: '医疗健康',
      case2Company: 'HealthCore Inc',
      case2Title: '人工智能驱动的患者诊断集成',
      case2Desc: '在临床试验中实施机器学习模型，将慢性疾病的早期检测率提高 22%。',
      case2Metric: '22%',
      case2MetricLabel: '检测率提升',
      
      case3Industry: '金融',
      case3Company: 'GlobalBank Prime',
      case3Title: '跨境支付的区块链安全技术',
      case3Desc: '为企业客户使用定制的私有账本系统，将国际交易成本降低 60%。',
      case3Metric: '60%',
      case3MetricLabel: '成本降低',
      
      // 更多案例
      readMore: '阅读更多',
      case4Industry: '零售',
      case4Title: '全渠道业务转型',
      case5Industry: '服务',
      case5Title: '人力资源运营效率优化',
      case6Industry: '工业',
      case6Title: '物联网供应链审计',
      case7Industry: '教育',
      case7Title: '数字校园发布项目',
      
      loadMore: '加载更多成功案例',
      
      // CTA
      ctaTitle: '准备好开启您自己的成功故事了吗？',
      ctaDesc: '与我们的专家团队合作，解决您最复杂的业务挑战，并推动大规模数字化创新。',
      btnConsult: '预约咨询',
      btnContact: '联系销售',
      
      // 页脚
      footerBrand: 'Solutions',
      footerDesc: '数字化转型和战略业务解决方案的行业领导者。赋能全球企业发展。',
      footerCompany: '公司',
      footerAbout: '关于我们',
      footerCareers: '职业机会',
      footerSolutions: '解决方案',
      footerResources: '资源',
      footerContact: '联系我们',
      footerCopyright: '© 2024 Solutions Inc. 保留所有权利。',
      footerPrivacy: '隐私政策',
      footerTerms: '服务条款',
    },
    en: {
      // Hero
      heroTitle: 'Success Stories',
      heroDesc: 'Explore how we help industries worldwide achieve digital transformation with measurable results.',
      btnExplore: 'Explore Stories',
      btnDownload: 'Download PDF Report',
      
      // Filters
      filterIndustry: 'All Industries',
      filterFinance: 'Finance',
      filterHealth: 'Healthcare',
      filterTech: 'Technology',
      filterRetail: 'Retail',
      
      filterRegion: 'Region',
      filterGlobal: 'Global',
      filterNA: 'North America',
      filterEU: 'Europe',
      filterAPAC: 'Asia Pacific',
      
      // Featured
      featuredTitle: 'Featured Success Stories',
      viewAll: 'View All',
      
      // Cases
      case1Industry: 'Technology',
      case1Company: 'TechCorp Systems',
      case1Title: 'Cloud Infrastructure Scale-up Strategy',
      case1Desc: 'Redesigned core architecture to support 300% traffic growth while reducing latency by 45%.',
      case1Metric: '45%',
      case1MetricLabel: 'Latency Reduction',
      viewCase: 'View Case',
      
      case2Industry: 'Healthcare',
      case2Company: 'HealthCore Inc',
      case2Title: 'AI-Powered Patient Diagnostics Integration',
      case2Desc: 'Implemented ML models in clinical trials, improving early detection of chronic diseases by 22%.',
      case2Metric: '22%',
      case2MetricLabel: 'Detection Increase',
      
      case3Industry: 'Finance',
      case3Company: 'GlobalBank Prime',
      case3Title: 'Blockchain Security for Cross-Border Payments',
      case3Desc: 'Custom private ledger system for enterprise clients, reducing international transaction costs by 60%.',
      case3Metric: '60%',
      case3MetricLabel: 'Cost Reduction',
      
      // More Cases
      readMore: 'Read More',
      case4Industry: 'Retail',
      case4Title: 'Omnichannel Business Transformation',
      case5Industry: 'Services',
      case5Title: 'HR Operations Efficiency Optimization',
      case6Industry: 'Industrial',
      case6Title: 'IoT Supply Chain Audit',
      case7Industry: 'Education',
      case7Title: 'Digital Campus Launch Project',
      
      loadMore: 'Load More Success Stories',
      
      // CTA
      ctaTitle: 'Ready to Start Your Own Success Story?',
      ctaDesc: 'Partner with our experts to solve your most complex business challenges and drive digital innovation at scale.',
      btnConsult: 'Schedule Consultation',
      btnContact: 'Contact Sales',
      
      // Footer
      footerBrand: 'Solutions',
      footerDesc: 'Industry leader in digital transformation and strategic business solutions. Empowering global enterprises.',
      footerCompany: 'Company',
      footerAbout: 'About Us',
      footerCareers: 'Careers',
      footerSolutions: 'Solutions',
      footerResources: 'Resources',
      footerContact: 'Contact Us',
      footerCopyright: '© 2024 Solutions Inc. All rights reserved.',
      footerPrivacy: 'Privacy Policy',
      footerTerms: 'Terms of Service',
    },
  };

  const currentText = t[language];

  const featuredCases = [
    {
      id: 1,
      industry: currentText.case1Industry,
      company: currentText.case1Company,
      title: currentText.case1Title,
      desc: currentText.case1Desc,
      metric: currentText.case1Metric,
      metricLabel: currentText.case1MetricLabel,
      imageClass: 'case-img-1',
    },
    {
      id: 2,
      industry: currentText.case2Industry,
      company: currentText.case2Company,
      title: currentText.case2Title,
      desc: currentText.case2Desc,
      metric: currentText.case2Metric,
      metricLabel: currentText.case2MetricLabel,
      imageClass: 'case-img-2',
    },
    {
      id: 3,
      industry: currentText.case3Industry,
      company: currentText.case3Company,
      title: currentText.case3Title,
      desc: currentText.case3Desc,
      metric: currentText.case3Metric,
      metricLabel: currentText.case3MetricLabel,
      imageClass: 'case-img-3',
    },
  ];

  const moreCases = [
    { id: 4, industry: currentText.case4Industry, title: currentText.case4Title },
    { id: 5, industry: currentText.case5Industry, title: currentText.case5Title },
    { id: 6, industry: currentText.case6Industry, title: currentText.case6Title },
    { id: 7, industry: currentText.case7Industry, title: currentText.case7Title },
  ];

  const industries = [
    { key: 'all', label: currentText.filterIndustry },
    { key: 'finance', label: currentText.filterFinance },
    { key: 'health', label: currentText.filterHealth },
    { key: 'tech', label: currentText.filterTech },
    { key: 'retail', label: currentText.filterRetail },
  ];

  const regions = [
    { key: 'all', label: currentText.filterGlobal },
    { key: 'na', label: currentText.filterNA },
    { key: 'eu', label: currentText.filterEU },
    { key: 'apac', label: currentText.filterAPAC },
  ];

  return (
    <div className="cases-page">
      {/* Header */}
      <header className="cases-header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="brand-link">
              <div className="brand-icon"></div>
              <span className="brand-text">{currentText.footerBrand}</span>
            </Link>
            <nav className="main-nav">
              <Link to="/solutions">{currentText.footerSolutions}</Link>
              <Link to="/cases" className="active">{currentText.footerResources}</Link>
              <Link to="/about">{currentText.footerAbout}</Link>
              <Link to="/contact">{currentText.footerContact}</Link>
            </nav>
          </div>
          <div className="header-right">
            <div className="language-switcher">
              <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
            <button className="search-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <Link to="/login" className="login-btn">登录</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1 className="hero-title">{currentText.heroTitle}</h1>
          <p className="hero-desc">{currentText.heroDesc}</p>
          <div className="hero-actions">
            <button className="btn-primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
              {currentText.btnExplore}
            </button>
            <button className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              {currentText.btnDownload}
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <span className="filter-label">{currentText.filterIndustry.replace('所有', '')}</span>
            <div className="filter-tags">
              {industries.map((ind) => (
                <button
                  key={ind.key}
                  className={`filter-tag ${activeIndustry === ind.key ? 'active' : ''}`}
                  onClick={() => setActiveIndustry(ind.key)}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">{currentText.filterRegion}</span>
            <div className="filter-tags">
              {regions.map((reg) => (
                <button
                  key={reg.key}
                  className={`filter-tag ${activeRegion === reg.key ? 'active' : ''}`}
                  onClick={() => setActiveRegion(reg.key)}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cases */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{currentText.featuredTitle}</h2>
            <a href="#" className="view-all-link">
              {currentText.viewAll}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </a>
          </div>
          <div className="featured-grid">
            {featuredCases.map((caseItem) => (
              <div key={caseItem.id} className="case-card">
                <div className={`case-image ${caseItem.imageClass}`}>
                  <span className="case-industry">{caseItem.industry}</span>
                </div>
                <div className="case-content">
                  <div className="case-company">
                    <div className="company-logo"></div>
                    <span className="company-name">{caseItem.company}</span>
                  </div>
                  <h3 className="case-title">{caseItem.title}</h3>
                  <p className="case-desc">{caseItem.desc}</p>
                  <div className="case-footer">
                    <div className="case-metric">
                      <span className="metric-value">{caseItem.metric}</span>
                      <span className="metric-label">{caseItem.metricLabel}</span>
                    </div>
                    <button className="view-case-btn">
                      {currentText.viewCase}
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Cases Grid */}
      <section className="more-section">
        <div className="section-container">
          <div className="more-grid">
            {moreCases.map((caseItem) => (
              <div key={caseItem.id} className="more-card">
                <div className="more-image"></div>
                <span className="more-industry">{caseItem.industry}</span>
                <h4 className="more-title">{caseItem.title}</h4>
                <button className="read-more-btn">
                  {currentText.readMore}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="load-more">
            <button className="load-more-btn">{currentText.loadMore}</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">{currentText.ctaTitle}</h2>
          <p className="cta-desc">{currentText.ctaDesc}</p>
          <div className="cta-actions">
            <button className="btn-primary">
              {currentText.btnConsult}
            </button>
            <button className="btn-secondary">
              {currentText.btnContact}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cases-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-column">
              <div className="footer-brand">
                <div className="brand-icon"></div>
                <span className="brand-name">{currentText.footerBrand}</span>
              </div>
              <p className="footer-desc">{currentText.footerDesc}</p>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">{currentText.footerCompany}</h4>
              <ul className="footer-list">
                <li><a href="#">{currentText.footerAbout}</a></li>
                <li><a href="#">{currentText.footerCareers}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">{currentText.footerSolutions}</h4>
              <ul className="footer-list">
                <li><a href="#">数字化转型</a></li>
                <li><a href="#">云计算</a></li>
                <li><a href="#">AI 解决方案</a></li>
                <li><a href="#">数据分析</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">{currentText.footerContact}</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="您的邮箱" />
                <button type="submit">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">{currentText.footerCopyright}</p>
            <div className="footer-legal">
              <a href="#">{currentText.footerPrivacy}</a>
              <a href="#">{currentText.footerTerms}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cases;