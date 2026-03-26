/**
 * 行业智慧方案页面
 * 统一风格版本
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Solutions.css';

const Solutions: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const t = {
    zh: {
      brand: '道达智能',
      navSolutions: '解决方案',
      navArchitecture: '技术架构',
      navCompare: '方案对比',
      
      heroTag: '企业级出行生态系统',
      heroTitle1: '为每一个行业定制',
      heroTitle2: '行业智慧方案',
      heroDesc: '量身定制的电动车解决方案，旨在优化运营效率、降低碳排放并提升跨行业的服务体验。',
      btnExplore: '探索解决方案',
      btnDemo: '查看演示',
      
      sectionScenarios: '行业场景',
      scenario1Name: '景区园区',
      scenario1Desc: '宁静、环保的接驳车，适用于风景名胜区和国家公园。',
      scenario2Name: '高尔夫球场',
      scenario2Desc: '配备GPS集成和电池管理系统的高端球车车队。',
      scenario3Name: '地产社区',
      scenario3Desc: '为封闭式社区和高端地产提供的短途通勤解决方案。',
      scenario4Name: '工业园区',
      scenario4Desc: '坚固耐用的实用车辆，适用于物流、巡逻和重型作业。',
      scenario5Name: '校园景区',
      scenario5Desc: '为师生提供的高效校园"最后一公里"交通方案。',
      scenario6Name: '主题乐园',
      scenario6Desc: '高容量载客接驳车及VIP贵宾接待交通方案。',
      
      sectionArchitecture: '方案技术架构',
      archIoT: 'IoT 物联网遥测骨干',
      archCloud: '云端车队管理平台',
      archCharging: '智能网格充电系统',
      archEdge: '边缘节点',
      archData: '数据结构',
      archAnalytics: '智能分析',
      
      sectionCompare: '版本方案对比',
      coreFeatures: '核心功能',
      planStarter: '基础版',
      planProfessional: '专业版',
      planEnterprise: '企业版',
      featureCapacity: '车队容量',
      capacityStarter: '多达 10 辆',
      capacityPro: '多达 50 辆',
      capacityEnterprise: '不限数量',
      featureTracking: '实时追踪',
      featureMaintenance: '维护预警',
      featureBranding: '自定义品牌定制',
      featureAPI: 'API 访问权限',
      
      ctaTitle: '准备好升级您的车队了吗？',
      ctaDesc: '获取定制化的咨询服务，了解我们的行业解决方案如何助力您的业务转型与效率提升。',
      btnContact: '联系我们',
      btnSchedule: '预约演示',
      
      footerBrand: 'MobilityHub',
      footerDesc: '智能出行解决方案领导者。',
      footerCopyright: '© 2024 MobilityHub. 保留所有权利。',
    },
    en: {
      brand: 'DAODA Smart',
      navSolutions: 'Solutions',
      navArchitecture: 'Architecture',
      navCompare: 'Compare',
      
      heroTag: 'Enterprise Mobility Ecosystem',
      heroTitle1: 'Tailored Solutions',
      heroTitle2: 'for Every Industry',
      heroDesc: 'Customized EV solutions designed to optimize operations, reduce emissions, and enhance service experiences across industries.',
      btnExplore: 'Explore Solutions',
      btnDemo: 'View Demo',
      
      sectionScenarios: 'Industry Scenarios',
      scenario1Name: 'Scenic Parks',
      scenario1Desc: 'Quiet, eco-friendly shuttles for scenic areas and national parks.',
      scenario2Name: 'Golf Courses',
      scenario2Desc: 'Premium cart fleets with GPS integration and battery management.',
      scenario3Name: 'Real Estate',
      scenario3Desc: 'Short-distance mobility for gated communities and premium properties.',
      scenario4Name: 'Industrial Parks',
      scenario4Desc: 'Rugged utility vehicles for logistics, patrol, and heavy-duty operations.',
      scenario5Name: 'Campus',
      scenario5Desc: 'Efficient last-mile transportation for students and faculty.',
      scenario6Name: 'Theme Parks',
      scenario6Desc: 'High-capacity shuttles and VIP guest transport solutions.',
      
      sectionArchitecture: 'Solution Architecture',
      archIoT: 'IoT Telemetry Backbone',
      archCloud: 'Cloud Fleet Platform',
      archCharging: 'Smart Grid Charging',
      archEdge: 'Edge Nodes',
      archData: 'Data Fabric',
      archAnalytics: 'Smart Analytics',
      
      sectionCompare: 'Plan Comparison',
      coreFeatures: 'Core Features',
      planStarter: 'Starter',
      planProfessional: 'Professional',
      planEnterprise: 'Enterprise',
      featureCapacity: 'Fleet Capacity',
      capacityStarter: 'Up to 10',
      capacityPro: 'Up to 50',
      capacityEnterprise: 'Unlimited',
      featureTracking: 'Real-time Tracking',
      featureMaintenance: 'Maintenance Alerts',
      featureBranding: 'Custom Branding',
      featureAPI: 'API Access',
      
      ctaTitle: 'Ready to Upgrade Your Fleet?',
      ctaDesc: 'Get customized consulting to learn how our solutions can transform your operations.',
      btnContact: 'Contact Us',
      btnSchedule: 'Schedule Demo',
      
      footerBrand: 'MobilityHub',
      footerDesc: 'Leading smart mobility solutions.',
      footerCopyright: '© 2024 MobilityHub. All rights reserved.',
    },
  };

  const currentText = t[language];

  const scenarios = [
    { name: currentText.scenario1Name, desc: currentText.scenario1Desc, icon: '🏞️' },
    { name: currentText.scenario2Name, desc: currentText.scenario2Desc, icon: '⛳' },
    { name: currentText.scenario3Name, desc: currentText.scenario3Desc, icon: '🏠' },
    { name: currentText.scenario4Name, desc: currentText.scenario4Desc, icon: '🏭' },
    { name: currentText.scenario5Name, desc: currentText.scenario5Desc, icon: '🎓' },
    { name: currentText.scenario6Name, desc: currentText.scenario6Desc, icon: '🎡' },
  ];

  return (
    <div className="solutions-page daoda-page">
      {/* Header */}
      <header className="solutions-header">
        <div className="header-inner">
          <div className="header-left">
            <Link to="/" className="brand-link">
              <div className="daoda-brand-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span className="brand-text">{currentText.brand}</span>
            </Link>
            <nav className="main-nav">
              <Link to="/solutions" className="active">{currentText.navSolutions}</Link>
              <Link to="/solutions/architecture">{currentText.navArchitecture}</Link>
              <Link to="/solutions/compare">{currentText.navCompare}</Link>
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
      <section className="solutions-hero">
        <div className="hero-content">
          <span className="hero-tag">{currentText.heroTag}</span>
          <h1 className="hero-title">
            <span>{currentText.heroTitle1}</span>
            <span className="gradient-text">{currentText.heroTitle2}</span>
          </h1>
          <p className="hero-desc">{currentText.heroDesc}</p>
          <div className="hero-actions">
            <button className="daoda-btn-primary">
              {currentText.btnExplore}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
            <button className="daoda-btn-secondary">{currentText.btnDemo}</button>
          </div>
        </div>
      </section>

      {/* 行业场景 */}
      <section className="solutions-section">
        <div className="solutions-container">
          <h2 className="section-title">{currentText.sectionScenarios}</h2>
          <div className="scenarios-grid">
            {scenarios.map((s, i) => (
              <div key={i} className="scenario-card daoda-card">
                <div className="scenario-icon">{s.icon}</div>
                <h3 className="scenario-name">{s.name}</h3>
                <p className="scenario-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="solutions-section alt">
        <div className="solutions-container">
          <h2 className="cta-title">{currentText.ctaTitle}</h2>
          <p className="cta-desc">{currentText.ctaDesc}</p>
          <div className="cta-actions">
            <button className="daoda-btn-primary">{currentText.btnContact}</button>
            <button className="daoda-btn-secondary">{currentText.btnSchedule}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="solutions-footer">
        <div className="footer-brand">
          <div className="daoda-brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span>{currentText.footerBrand}</span>
        </div>
        <p>{currentText.footerDesc}</p>
        <p className="copyright">{currentText.footerCopyright}</p>
      </footer>
    </div>
  );
};

export default Solutions;