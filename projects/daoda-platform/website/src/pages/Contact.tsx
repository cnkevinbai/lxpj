/**
 * 联系我们页面
 * 统一风格版本 - 不使用Ant Design
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact: React.FC = () => {
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
      
      heroTag: '联系我们',
      heroTitle: '期待与您合作',
      heroDesc: '欢迎随时联系我们，我们将竭诚为您服务',
      
      formTitle: '留言咨询',
      formName: '姓名',
      formNamePlaceholder: '您的姓名',
      formCompany: '公司',
      formCompanyPlaceholder: '公司名称',
      formPhone: '电话',
      formPhonePlaceholder: '联系电话',
      formEmail: '邮箱',
      formEmailPlaceholder: '电子邮箱',
      formType: '咨询类型',
      formTypePlaceholder: '请选择',
      formMessage: '留言',
      formMessagePlaceholder: '请描述您的需求',
      submitBtn: '提交留言',
      
      contactTitle: '联系方式',
      phoneTitle: '服务热线',
      emailTitle: '电子邮箱',
      addressTitle: '公司地址',
      
      hoursTitle: '工作时间',
      hoursInfo1: '周一至周五：9:00 - 18:00',
      hoursInfo2: '周六：9:00 - 12:00',
      hoursInfo3: '周日及节假日休息',
      
      footerDesc: '自 2012 年起深耕智能出行解决方案。加入我们，共同重新定义出行的未来。',
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
      
      heroTag: 'Contact Us',
      heroTitle: 'Looking Forward to Your Cooperation',
      heroDesc: 'Welcome to contact us at any time, we will serve you with sincerity',
      
      formTitle: 'Leave A Message',
      formName: 'Name',
      formNamePlaceholder: 'Your Name',
      formCompany: 'Company',
      formCompanyPlaceholder: 'Company Name',
      formPhone: 'Phone',
      formPhonePlaceholder: 'Contact Number',
      formEmail: 'Email',
      formEmailPlaceholder: 'Email Address',
      formType: 'Inquiry Type',
      formTypePlaceholder: 'Select Type',
      formMessage: 'Message',
      formMessagePlaceholder: 'Please describe your requirements',
      submitBtn: 'Submit Message',
      
      contactTitle: 'Contact Info',
      phoneTitle: 'Service Hotline',
      emailTitle: 'Email Address',
      addressTitle: 'Company Address',
      
      hoursTitle: 'Working Hours',
      hoursInfo1: 'Monday to Friday: 9:00 - 18:00',
      hoursInfo2: 'Saturday: 9:00 - 12:00',
      hoursInfo3: 'Sunday and holidays off',
      
      footerDesc: 'Specializing in smart mobility solutions since 2012. Join us in redefining the future.',
      footerCopyright: '© 2024 DAODA Smart Technology. All rights reserved.',
    },
  };

  const currentText = t[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  const contactTypes = [
    { value: 'product', label: currentText.formTypePlaceholder },
    { value: 'solution', label: '解决方案' },
    { value: 'dealer', label: '经销商合作' },
    { value: 'service', label: '售后服务' },
    { value: 'other', label: '其他' },
  ];

  return (
    <div className="contact-page daoda-page">
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
              <Link to="/services">{currentText.navGlobal}</Link>
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
          <div className="daoda-hero-image daoda-hero-contact"></div>
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

      {/* Main Content */}
      <section className="daoda-contact-content">
        <div className="daoda-section-container">
          <div className="daoda-contact-grid">
            {/* Contact Form */}
            <div className="daoda-contact-form daoda-glass-panel">
              <h2 className="daoda-section-title">{currentText.formTitle}</h2>
              <form onSubmit={handleSubmit} className="daoda-contact-form-inner">
                <div className="daoda-form-row">
                  <div className="daoda-form-group">
                    <label>{currentText.formName}</label>
                    <input
                      type="text"
                      name="name"
                      placeholder={currentText.formNamePlaceholder}
                      required
                    />
                  </div>
                  <div className="daoda-form-group">
                    <label>{currentText.formCompany}</label>
                    <input
                      type="text"
                      name="company"
                      placeholder={currentText.formCompanyPlaceholder}
                    />
                  </div>
                </div>
                
                <div className="daoda-form-row">
                  <div className="daoda-form-group">
                    <label>{currentText.formPhone}</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={currentText.formPhonePlaceholder}
                      required
                    />
                  </div>
                  <div className="daoda-form-group">
                    <label>{currentText.formEmail}</label>
                    <input
                      type="email"
                      name="email"
                      placeholder={currentText.formEmailPlaceholder}
                    />
                  </div>
                </div>
                
                <div className="daoda-form-group">
                  <label>{currentText.formType}</label>
                  <div className="daoda-select-wrapper">
                    <select name="type" defaultValue="">
                      {contactTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <span className="daoda-select-arrow">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </span>
                  </div>
                </div>
                
                <div className="daoda-form-group">
                  <label>{currentText.formMessage}</label>
                  <textarea
                    name="message"
                    placeholder={currentText.formMessagePlaceholder}
                    rows={5}
                    required
                  />
                </div>
                
                <button type="submit" className="daoda-btn-primary daoda-btn-block">
                  {currentText.submitBtn}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="daoda-contact-info">
              {/* Contact Details */}
              <div className="daoda-contact-details daoda-glass-panel">
                <h2 className="daoda-section-title">{currentText.contactTitle}</h2>
                <div className="daoda-contact-list">
                  <div className="daoda-contact-item">
                    <div className="daoda-contact-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <div className="daoda-contact-text">
                      <h4>{currentText.phoneTitle}</h4>
                      <p>400-888-8888</p>
                    </div>
                  </div>
                  
                  <div className="daoda-contact-item">
                    <div className="daoda-contact-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div className="daoda-contact-text">
                      <h4>{currentText.emailTitle}</h4>
                      <p>contact@daoda.com</p>
                    </div>
                  </div>
                  
                  <div className="daoda-contact-item">
                    <div className="daoda-contact-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div className="daoda-contact-text">
                      <h4>{currentText.addressTitle}</h4>
                      <p>四川省眉山市东坡区</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="daoda-working-hours daoda-glass-panel">
                <h2 className="daoda-section-title">{currentText.hoursTitle}</h2>
                <div className="daoda-hours-list">
                  <div className="daoda-hours-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>{currentText.hoursInfo1}</span>
                  </div>
                  <div className="daoda-hours-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>{currentText.hoursInfo2}</span>
                  </div>
                  <div className="daoda-hours-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>{currentText.hoursInfo3}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="daoda-map-section">
        <div className="daoda-section-container">
          <div className="daoda-map-container">
            <div className="daoda-map-bg">
              <div className="daoda-map-overlay"></div>
            </div>
            <div className="daoda-map-marker">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="daoda-footer">
        <div className="daoda-footer-container">
          <div className="daoda-footer-brand">
            <div className="daoda-brand-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span>{currentText.brand}</span>
          </div>
          <p className="daoda-footer-desc">{currentText.footerDesc}</p>
          <div className="daoda-footer-bottom">
            <p>{currentText.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
