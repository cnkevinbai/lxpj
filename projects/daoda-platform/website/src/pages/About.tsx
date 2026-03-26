/**
 * 关于我们页面
 * 统一风格版本
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const t = {
    zh: {
      brand: '道达智能',
      navHome: '首页',
      navAbout: '关于我们',
      navSolutions: '智慧方案',
      navCareers: '招贤纳士',
      
      heroTag: '始于 2010',
      heroTitle1: '关于道达：',
      heroTitle2: '企业门户',
      heroDesc: '全球领先的科技创新企业，道达集团通过突破性的数字解决方案和远见卓识的领导力，驱动可持续增长。',
      
      introTitle: '公司简介',
      introDesc: '在道达，我们的使命是通过弥合当今挑战与未来可能之间的鸿沟，为全球企业赋能。我们利用前沿研究和以人为本的设计，创造一个更加互联、高效和可持续的世界。',
      introMarkets: '全球市场',
      introTalents: '专业人才',
      
      timelineTitle: '发展历程',
      year2010: '成立于北京',
      year2010Desc: '作为专注于云计算架构的研究型初创企业诞生。',
      year2015: '全球扩张',
      year2015Desc: '在伦敦、纽约和新加坡设立办事处。',
      year2020: '挂牌上市',
      year2020Desc: '在全球证券交易所成功亮相，实现创纪录增长。',
      year2024: '创新领军者',
      year2024Desc: '引领下一代人工智能驱动的可持续基础设施。',
      
      cultureTitle: '企业文化与价值观',
      cultureVision: '核心愿景',
      cultureVisionDesc: '成为数字化转型中最值得信赖的催化剂，确立诚信与创新的新标准。',
      cultureInnovation: '创新为先',
      cultureInnovationDesc: '我们每天都在挑战现状，营造一种培养和发展大胆想法的文化。',
      cultureResponsibility: '社会责任',
      cultureResponsibilityDesc: '致力于道德增长和社会责任，确保我们的影响对所有利益相关者都是积极的。',
      
      honorsTitle: '荣誉与资质',
      honor1: 'ISO 27001 信息安全认证',
      honor2: '2023 年度创新大奖',
      honor3: '绿色科技卓越勋章',
      honor4: '诚信企业荣誉标签',
      
      headquartersTitle: '全球总部',
      address: '创新广场 A座',
      city: '中国 北京市 海淀区',
      phone: '+86 (10) 8888 0000',
      email: 'contact@daoda-corp.com',
      getDirections: '获取路线指引',
      
      footerCopyright: '© 2024 道达企业集团。保留所有权利。',
      footerPrivacy: '隐私政策',
      footerCompliance: '合规说明',
    },
    en: {
      brand: 'DAODA Smart',
      navHome: 'Home',
      navAbout: 'About',
      navSolutions: 'Solutions',
      navCareers: 'Careers',
      
      heroTag: 'Since 2010',
      heroTitle1: 'About DAODA:',
      heroTitle2: 'Enterprise Portal',
      heroDesc: 'A global leader in technology innovation, DAODA Group drives sustainable growth through breakthrough digital solutions and visionary leadership.',
      
      introTitle: 'Company Overview',
      introDesc: 'At DAODA, our mission is to empower global enterprises by bridging today\'s challenges with tomorrow\'s possibilities. Through cutting-edge research and human-centered design, we create a more connected, efficient, and sustainable world.',
      introMarkets: 'Global Markets',
      introTalents: 'Professionals',
      
      timelineTitle: 'Our Journey',
      year2010: 'Founded in Beijing',
      year2010Desc: 'Born as a research-focused startup specializing in cloud architecture.',
      year2015: 'Global Expansion',
      year2015Desc: 'Established offices in London, New York, and Singapore.',
      year2020: 'Public Listing',
      year2020Desc: 'Successful IPO with record-breaking growth.',
      year2024: 'Innovation Leader',
      year2024Desc: 'Leading next-generation AI-driven sustainable infrastructure.',
      
      cultureTitle: 'Culture & Values',
      cultureVision: 'Core Vision',
      cultureVisionDesc: 'To be the most trusted catalyst in digital transformation.',
      cultureInnovation: 'Innovation First',
      cultureInnovationDesc: 'We challenge the status quo daily, fostering bold ideas.',
      cultureResponsibility: 'Social Responsibility',
      cultureResponsibilityDesc: 'Committed to ethical growth and social responsibility.',
      
      honorsTitle: 'Honors & Certifications',
      honor1: 'ISO 27001 Information Security',
      honor2: '2023 Innovation Award',
      honor3: 'Green Tech Excellence Medal',
      honor4: 'Integrity Enterprise Label',
      
      headquartersTitle: 'Global Headquarters',
      address: 'Innovation Plaza, Tower A',
      city: 'Haidian District, Beijing, China',
      phone: '+86 (10) 8888 0000',
      email: 'contact@daoda-corp.com',
      getDirections: 'Get Directions',
      
      footerCopyright: '© 2024 DAODA Enterprise Group. All rights reserved.',
      footerPrivacy: 'Privacy Policy',
      footerCompliance: 'Compliance',
    },
  };

  const currentText = t[language];

  return (
    <div className="about-page daoda-page">
      {/* Header */}
      <header className="about-header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="brand-link">
              <div className="brand-icon"></div>
              <span className="brand-text">{currentText.brand}</span>
            </Link>
            <nav className="main-nav">
              <Link to="/">{currentText.navHome}</Link>
              <Link to="/about" className="active">{currentText.navAbout}</Link>
              <Link to="/solutions">{currentText.navSolutions}</Link>
              <Link to="/careers">{currentText.navCareers}</Link>
            </nav>
          </div>
          <div className="header-right">
            <div className="daoda-lang-switch">
              <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="about-hero">
        <span className="hero-tag">{currentText.heroTag}</span>
        <h1 className="hero-title">
          <span>{currentText.heroTitle1}</span>
          <span>{currentText.heroTitle2}</span>
        </h1>
        <p className="hero-desc">{currentText.heroDesc}</p>
      </section>

      {/* 公司简介 */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">{currentText.introTitle}</h2>
          <p className="intro-desc">{currentText.introDesc}</p>
          <div className="intro-stats">
            <div className="stat-box">
              <span className="stat-number">150+</span>
              <span className="stat-label">{currentText.introMarkets}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">1.2万</span>
              <span className="stat-label">{currentText.introTalents}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="about-section alt">
        <div className="about-container">
          <h2 className="section-title">{currentText.timelineTitle}</h2>
          <div className="timeline-grid">
            <div className="timeline-item daoda-card">
              <span className="timeline-year">2010</span>
              <h3>{currentText.year2010}</h3>
              <p>{currentText.year2010Desc}</p>
            </div>
            <div className="timeline-item daoda-card">
              <span className="timeline-year">2015</span>
              <h3>{currentText.year2015}</h3>
              <p>{currentText.year2015Desc}</p>
            </div>
            <div className="timeline-item daoda-card">
              <span className="timeline-year">2020</span>
              <h3>{currentText.year2020}</h3>
              <p>{currentText.year2020Desc}</p>
            </div>
            <div className="timeline-item daoda-card">
              <span className="timeline-year">2024</span>
              <h3>{currentText.year2024}</h3>
              <p>{currentText.year2024Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 企业文化 */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">{currentText.cultureTitle}</h2>
          <div className="culture-grid">
            <div className="culture-card daoda-card">
              <h3>{currentText.cultureVision}</h3>
              <p>{currentText.cultureVisionDesc}</p>
            </div>
            <div className="culture-card daoda-card">
              <h3>{currentText.cultureInnovation}</h3>
              <p>{currentText.cultureInnovationDesc}</p>
            </div>
            <div className="culture-card daoda-card">
              <h3>{currentText.cultureResponsibility}</h3>
              <p>{currentText.cultureResponsibilityDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 荣誉资质 */}
      <section className="about-section alt">
        <div className="about-container">
          <h2 className="section-title">{currentText.honorsTitle}</h2>
          <div className="honors-grid">
            <div className="honor-item daoda-card">{currentText.honor1}</div>
            <div className="honor-item daoda-card">{currentText.honor2}</div>
            <div className="honor-item daoda-card">{currentText.honor3}</div>
            <div className="honor-item daoda-card">{currentText.honor4}</div>
          </div>
        </div>
      </section>

      {/* 全球总部 */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">{currentText.headquartersTitle}</h2>
          <div className="hq-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <span>{currentText.address}</span>
                <span className="contact-detail">{currentText.city}</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <span>{currentText.phone}</span>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <span>{currentText.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="about-footer">
        <p>{currentText.footerCopyright}</p>
        <div className="footer-links">
          <a href="#">{currentText.footerPrivacy}</a>
          <a href="#">{currentText.footerCompliance}</a>
        </div>
      </footer>
    </div>
  );
};

export default About;