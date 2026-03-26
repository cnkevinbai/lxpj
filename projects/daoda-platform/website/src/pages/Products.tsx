/**
 * 产品中心页面 - 重构版本
 * 现代化产品展示布局
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const t = {
    zh: {
      brand: '道达智能',
      navHome: '首页',
      navProducts: '产品中心',
      
      heroTitle: '产品矩阵',
      heroDesc: '探索道达智能全系列电动出行解决方案',
      
      categoryAll: '全部产品',
      categorySightseeing: '观光车系列',
      categoryGolf: '高尔夫系列',
      categoryVintage: '经典系列',
      categoryUtility: '特种车辆',
      
      filterTitle: '筛选',
      resultsCount: '共 8 款产品',
      
      product1Name: 'Tour S1 城市通勤车',
      product1Tag: '城市首选',
      product1Price: '¥17,800',
      product1Desc: '专为每日高效城市通勤设计的完美城市伙伴，轻量化设计与强劲续航的完美结合。',
      product1Specs: ['65km 续航', '25km/h', '4h 快充', '18kg'],
      
      product2Name: 'Tour Pro 长续航版',
      product2Tag: '热销',
      product2Price: '¥24,800',
      product2Desc: '升级版城市通勤车，更大电池容量，适合长途通勤需求。',
      product2Specs: ['120km 续航', '35km/h', '6h 快充', '22kg'],
      
      product3Name: 'Golf X4 四座球车',
      product3Tag: '高端',
      product3Price: '¥64,500',
      product3Desc: '专为豪华度假村和高尔夫球场设计的高端四座电动车。',
      product3Specs: ['4 座位', '80km 续航', '25% 爬坡', '智能中控'],
      
      product4Name: 'Golf X2 双座球车',
      product4Tag: '经典',
      product4Price: '¥42,800',
      product4Desc: '经典双座设计，适合标准高尔夫球场使用。',
      product4Specs: ['2 座位', '60km 续航', '20% 爬坡', 'GPS 定位'],
      
      product5Name: 'Vintage V8 复古观光车',
      product5Tag: '旗舰',
      product5Price: '¥110,000',
      product5Desc: '经典美学与现代电力技术的结合，8-10人载重，为风景名胜而生。',
      product5Specs: ['8-10 座', '高扭矩电机', '真皮座椅', '液压制动'],
      
      product6Name: 'Vintage V6 经典款',
      product6Tag: '热销',
      product6Price: '¥78,000',
      product6Desc: '复古造型，4-6人座，适合景区短途观光。',
      product6Specs: ['4-6 座', '静音电机', '复古造型', '防震座椅'],
      
      product7Name: 'Patrol P1 巡逻车',
      product7Tag: '专业',
      product7Price: '¥46,800',
      product7Desc: '坚固耐用的电动巡逻车，专为安保巡逻和园区监控设计。',
      product7Specs: ['警报系统', '警示灯组', '全地形胎', '快速启动'],
      
      product8Name: 'Cargo L1 载货车',
      product8Tag: '工业',
      product8Price: '¥52,000',
      product8Desc: '大载重电动货运车，适合工厂、仓库物流运输。',
      product8Specs: ['500kg 载重', '加固车架', '大容量', '长续航'],
      
      viewDetails: '查看详情',
      inquire: '询价',
      footerCopyright: '© 2024 道达智能科技(深圳)有限公司。保留所有权利。',
      footerPrivacy: '隐私政策',
      footerTerms: '服务条款',
      footerProducts: '产品中心',
    },
    en: {
      brand: 'DAODA Smart',
      navHome: 'Home',
      navProducts: 'Products',
      
      heroTitle: 'Product Matrix',
      heroDesc: 'Explore DAODA Smart full range of electric mobility solutions',
      
      categoryAll: 'All Products',
      categorySightseeing: 'Sightseeing',
      categoryGolf: 'Golf Carts',
      categoryVintage: 'Vintage',
      categoryUtility: 'Utility',
      
      filterTitle: 'Filter',
      resultsCount: '8 Products',
      
      product1Name: 'Tour S1 City Commuter',
      product1Tag: 'City Choice',
      product1Price: '¥17,800',
      product1Desc: 'Perfect urban companion for daily commuting with lightweight design and strong range.',
      product1Specs: ['65km Range', '25km/h', '4h Charge', '18kg'],
      
      product2Name: 'Tour Pro Extended',
      product2Tag: 'Best Seller',
      product2Price: '¥24,800',
      product2Desc: 'Upgraded city commuter with larger battery for long-distance needs.',
      product2Specs: ['120km Range', '35km/h', '6h Charge', '22kg'],
      
      product3Name: 'Golf X4 Four-Seater',
      product3Tag: 'Premium',
      product3Price: '¥64,500',
      product3Desc: 'Premium four-seater for luxury resorts and golf courses.',
      product3Specs: ['4 Seats', '80km Range', '25% Grade', 'Smart Console'],
      
      product4Name: 'Golf X2 Two-Seater',
      product4Tag: 'Classic',
      product4Price: '¥42,800',
      product4Desc: 'Classic two-seater design for standard golf courses.',
      product4Specs: ['2 Seats', '60km Range', '20% Grade', 'GPS'],
      
      product5Name: 'Vintage V8 Retro Touring',
      product5Tag: 'Flagship',
      product5Price: '¥110,000',
      product5Desc: 'Classic aesthetics meet modern electric technology, 8-10 passengers.',
      product5Specs: ['8-10 Seats', 'High Torque', 'Leather Seats', 'Hydraulic'],
      
      product6Name: 'Vintage V6 Classic',
      product6Tag: 'Best Seller',
      product6Price: '¥78,000',
      product6Desc: 'Retro styling, 4-6 seats, perfect for scenic area tours.',
      product6Specs: ['4-6 Seats', 'Quiet Motor', 'Retro Style', 'Shock Absorber'],
      
      product7Name: 'Patrol P1 Security',
      product7Tag: 'Professional',
      product7Price: '¥46,800',
      product7Desc: 'Rugged electric patrol vehicle for security and campus monitoring.',
      product7Specs: ['Alarm System', 'Warning Lights', 'All-Terrain', 'Quick Start'],
      
      product8Name: 'Cargo L1 Utility',
      product8Tag: 'Industrial',
      product8Price: '¥52,000',
      product8Desc: 'Heavy-duty electric cargo vehicle for factory and warehouse logistics.',
      product8Specs: ['500kg Load', 'Reinforced', 'Large Capacity', 'Long Range'],
      
      viewDetails: 'View Details',
      inquire: 'Inquire',
      footerCopyright: '© 2024 DAODA Smart Technology. All rights reserved.',
      footerPrivacy: 'Privacy Policy',
      footerTerms: 'Terms of Service',
      footerProducts: 'Products',
    },
  };

  const currentText = t[language];

  const products = [
    { id: 1, name: currentText.product1Name, tag: currentText.product1Tag, price: currentText.product1Price, desc: currentText.product1Desc, specs: currentText.product1Specs, category: 'sightseeing', image: 1 },
    { id: 2, name: currentText.product2Name, tag: currentText.product2Tag, price: currentText.product2Price, desc: currentText.product2Desc, specs: currentText.product2Specs, category: 'sightseeing', image: 2 },
    { id: 3, name: currentText.product3Name, tag: currentText.product3Tag, price: currentText.product3Price, desc: currentText.product3Desc, specs: currentText.product3Specs, category: 'golf', image: 3 },
    { id: 4, name: currentText.product4Name, tag: currentText.product4Tag, price: currentText.product4Price, desc: currentText.product4Desc, specs: currentText.product4Specs, category: 'golf', image: 4 },
    { id: 5, name: currentText.product5Name, tag: currentText.product5Tag, price: currentText.product5Price, desc: currentText.product5Desc, specs: currentText.product5Specs, category: 'vintage', image: 5 },
    { id: 6, name: currentText.product6Name, tag: currentText.product6Tag, price: currentText.product6Price, desc: currentText.product6Desc, specs: currentText.product6Specs, category: 'vintage', image: 6 },
    { id: 7, name: currentText.product7Name, tag: currentText.product7Tag, price: currentText.product7Price, desc: currentText.product7Desc, specs: currentText.product7Specs, category: 'utility', image: 7 },
    { id: 8, name: currentText.product8Name, tag: currentText.product8Tag, price: currentText.product8Price, desc: currentText.product8Desc, specs: currentText.product8Specs, category: 'utility', image: 8 },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const categories = [
    { key: 'all', label: currentText.categoryAll },
    { key: 'sightseeing', label: currentText.categorySightseeing },
    { key: 'golf', label: currentText.categoryGolf },
    { key: 'vintage', label: currentText.categoryVintage },
    { key: 'utility', label: currentText.categoryUtility },
  ];

  return (
    <div className="products-page daoda-page">
      {/* Header */}
      <header className="products-header">
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
              <Link to="/">{currentText.navHome}</Link>
              <Link to="/products" className="active">{currentText.navProducts}</Link>
              <Link to="/solutions">解决方案</Link>
              <Link to="/about">关于我们</Link>
            </nav>
          </div>
          <div className="header-right">
            <div className="daoda-lang-switch">
              <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
            <Link to="/login" className="daoda-login-btn">登录</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="products-hero">
        <div className="hero-content">
          <h1 className="hero-title">{currentText.heroTitle}</h1>
          <p className="hero-desc">{currentText.heroDesc}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="products-main">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">{currentText.filterTitle}</h3>
            <div className="category-list">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  className={`category-btn ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                  <span className="count">({cat.key === 'all' ? products.length : products.filter(p => p.category === cat.key).length})</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="products-content">
          {/* Toolbar */}
          <div className="products-toolbar">
            <span className="results-count">{currentText.resultsCount}</span>
            <div className="view-modes">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="4"/>
                  <rect x="3" y="10" width="18" height="4"/>
                  <rect x="3" y="16" width="18" height="4"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className={`products-grid ${viewMode}`}>
            {filteredProducts.map(product => (
              <article key={product.id} className="product-card daoda-card">
                <div className="product-image">
                  <div className={`product-img product-img-${product.image}`}>
                    <span className="product-tag">{product.tag}</span>
                  </div>
                </div>
                <div className="product-body">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">{product.price}</div>
                  <p className="product-desc">{product.desc}</p>
                  <div className="product-specs">
                    {product.specs.map((spec, i) => (
                      <span key={i} className="spec-tag">{spec}</span>
                    ))}
                  </div>
                  <div className="product-actions">
                    <Link to={`/products/${product.id}`} className="daoda-btn-primary">
                      {currentText.viewDetails}
                    </Link>
                    <button className="daoda-btn-secondary">{currentText.inquire}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;