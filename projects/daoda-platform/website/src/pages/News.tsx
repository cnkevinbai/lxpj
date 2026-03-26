/**
 * 新闻中心页面
 * 统一风格版本 - 不使用Ant Design
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const News: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [category, setCategory] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const pageSize = 6;

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
      
      heroTitle: '新闻动态',
      heroDesc: '了解道达智能最新资讯与行业洞察',
      
      filterAll: '全部',
      filterCompany: '公司新闻',
      filterIndustry: '行业动态',
      filterEvent: '活动信息',
      
      searchPlaceholder: '搜索新闻...',
      resultsCount: '共 {{count}} 条新闻',
      
      news1Title: '道达智能亮相2026国际旅游展览会',
      news1Summary: '道达智能携最新款电动观光车系列亮相2026国际旅游展览会，展示智慧出行解决方案。',
      news1Category: 'company',
      news1Date: '2026-03-20',
      news1Views: 1234,
      news1Tags: ['展会', '新品发布'],
      news1Image: 1,
      
      news2Title: '新能源观光车行业发展趋势报告发布',
      news2Summary: '中国旅游车船协会发布《2026新能源观光车行业发展趋势报告》，道达智能作为标杆企业入选案例。',
      news2Category: 'industry',
      news2Date: '2026-03-18',
      news2Views: 892,
      news2Tags: ['行业报告', '新能源'],
      news2Image: 2,
      
      news3Title: '道达智能与黄山风景区签署战略合作协议',
      news3Summary: '道达智能与黄山风景区签署战略合作协议，将为其提供100辆电动观光车及智慧运营系统。',
      news3Category: 'company',
      news3Date: '2026-03-15',
      news3Views: 2156,
      news3Tags: ['合作', '景区'],
      news3Image: 3,
      
      news4Title: '2026道达智能春季新品发布会圆满举办',
      news4Summary: '道达智能春季新品发布会在深圳成功举办，发布3款新品电动观光车和高尔夫球车。',
      news4Category: 'event',
      news4Date: '2026-03-10',
      news4Views: 1567,
      news4Tags: ['发布会', '新品'],
      news4Image: 4,
      
      news5Title: '道达智能获得国家级绿色工厂认证',
      news5Summary: '道达智能生产基地获得国家级绿色工厂认证，标志着公司在绿色制造领域的领先地位。',
      news5Category: 'company',
      news5Date: '2026-03-05',
      news5Views: 1823,
      news5Tags: ['荣誉', '绿色制造'],
      news5Image: 5,
      
      news6Title: '智慧景区解决方案白皮书发布',
      news6Summary: '道达智能发布《智慧景区出行解决方案白皮书》，为景区数字化转型提供参考指南。',
      news6Category: 'industry',
      news6Date: '2026-03-01',
      news6Views: 745,
      news6Tags: ['白皮书', '智慧景区'],
      news6Image: 6,
      
      news7Title: '道达智能与泰国皇家.Collapsed',
      news7Summary: '道达智能与泰国皇家大学签署合作备忘录，共同开展新能源 vehicle 研究项目。',
      news7Category: 'industry',
      news7Date: '2026-02-28',
      news7Views: 532,
      news7Tags: ['国际合作', '科研'],
      news7Image: 7,
      
      news8Title: '道达智能亮相上海国际车展',
      news8Summary: '道达智能携最新概念车亮相上海国际车展，吸引众多媒体和观众关注。',
      news8Category: 'event',
      news8Date: '2026-02-25',
      news8Views: 2890,
      news8Tags: ['车展', '概念车'],
      news8Image: 8,
      
      news9Title: '道达智能 TensorFlow',
      news9Summary: '公司自主研发的智能调度系统获国家专利认证，彰显技术创新实力。',
      news9Category: 'company',
      news9Date: '2026-02-20',
      news9Views: 1124,
      news9Tags: ['专利', '智能化'],
      news9Image: 9,
      
      btnReadMore: '阅读更多',
      emptyText: '暂无相关新闻',
      prevPage: '上一页',
      nextPage: '下一页',
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
      
      heroTitle: 'News & Insights',
      heroDesc: 'Stay updated with DAODA Smart latest news and industry insights',
      
      filterAll: 'All',
      filterCompany: 'Company News',
      filterIndustry: 'Industry News',
      filterEvent: 'Events',
      
      searchPlaceholder: 'Search news...',
      resultsCount: '{{count}} Results',
      
      news1Title: 'DAODA Smart at 2026 International Tourism Exhibition',
      news1Summary: 'DAODA Smart showcases latest electric sightseeing vehicles at the exhibition.',
      news1Category: 'company',
      news1Date: '2026-03-20',
      news1Views: 1234,
      news1Tags: ['Exhibition', 'New Product'],
      news1Image: 1,
      
      news2Title: 'New Energy Sightseeing Vehicle Industry Report Released',
      news2Summary: 'China Tourist Vehicle Association releases 2026 industry trend report.',
      news2Category: 'industry',
      news2Date: '2026-03-18',
      news2Views: 892,
      news2Tags: ['Industry Report', 'New Energy'],
      news2Image: 2,
      
      news3Title: 'DAODA Smart Signs Cooperation with Huangshan Scenic Area',
      news3Summary: 'Signs cooperation for 100 electric sightseeing vehicles and smart operation system.',
      news3Category: 'company',
      news3Date: '2026-03-15',
      news3Views: 2156,
      news3Tags: ['Cooperation', 'Scenic Area'],
      news3Image: 3,
      
      news4Title: 'DAODA Smart 2026 Spring New Product Launch Successful',
      news4Summary: 'Spring new product launch in Shenzhen successfully released 3 new models.',
      news4Category: 'event',
      news4Date: '2026-03-10',
      news4Views: 1567,
      news4Tags: ['Launch', 'New Product'],
      news4Image: 4,
      
      news5Title: 'DAODA Smart Awarded National Green Factory Certification',
      news5Summary: 'Achieves national green factory certification, demonstrating leadership in green manufacturing.',
      news5Category: 'company',
      news5Date: '2026-03-05',
      news5Views: 1823,
      news5Tags: ['Honor', 'Green Manufacturing'],
      news5Image: 5,
      
      news6Title: 'Smart Scenic Area Solution White Paper Released',
      news6Summary: 'Releases white paper providing reference guide for scenic area digital transformation.',
      news6Category: 'industry',
      news6Date: '2026-03-01',
      news6Views: 745,
      news6Tags: ['White Paper', 'Smart Scenic Area'],
      news6Image: 6,
      
      news7Title: 'DAODA Smart Signs MOU with Royal University of Thailand',
      news7Summary: 'Signs MOU for joint research project on new energy vehicle technology.',
      news7Category: 'industry',
      news7Date: '2026-02-28',
      news7Views: 532,
      news7Tags: ['International', 'Research'],
      news7Image: 7,
      
      news8Title: 'DAODA Smart at Shanghai International Auto Show',
      news8Summary: 'Showcases latest concept vehicle at Shanghai Auto Show, attracting media attention.',
      news8Category: 'event',
      news8Date: '2026-02-25',
      news8Views: 2890,
      news8Tags: ['Auto Show', 'Concept'],
      news8Image: 8,
      
      news9Title: 'DAODA Smart Smart Dispatch System Awarded Patent',
      news9Summary: 'Self-developed intelligent dispatch system wins national patent certification.',
      news9Category: 'company',
      news9Date: '2026-02-20',
      news9Views: 1124,
      news9Tags: ['Patent', 'Intelligence'],
      news9Image: 9,
      
      btnReadMore: 'Read More',
      emptyText: 'No相关新闻 found',
      prevPage: 'Previous',
      nextPage: 'Next',
    },
  };

  const currentText = t[language];

  const categories = [
    { value: 'all', label: currentText.filterAll },
    { value: 'company', label: currentText.filterCompany },
    { value: 'industry', label: currentText.filterIndustry },
    { value: 'event', label: currentText.filterEvent },
  ];

  const newsList = [
    {
      id: '1',
      title: currentText.news1Title,
      summary: currentText.news1Summary,
      image: currentText.news1Image,
      category: currentText.news1Category,
      date: currentText.news1Date,
      views: currentText.news1Views,
      tags: currentText.news1Tags,
    },
    {
      id: '2',
      title: currentText.news2Title,
      summary: currentText.news2Summary,
      image: currentText.news2Image,
      category: currentText.news2Category,
      date: currentText.news2Date,
      views: currentText.news2Views,
      tags: currentText.news2Tags,
    },
    {
      id: '3',
      title: currentText.news3Title,
      summary: currentText.news3Summary,
      image: currentText.news3Image,
      category: currentText.news3Category,
      date: currentText.news3Date,
      views: currentText.news3Views,
      tags: currentText.news3Tags,
    },
    {
      id: '4',
      title: currentText.news4Title,
      summary: currentText.news4Summary,
      image: currentText.news4Image,
      category: currentText.news4Category,
      date: currentText.news4Date,
      views: currentText.news4Views,
      tags: currentText.news4Tags,
    },
    {
      id: '5',
      title: currentText.news5Title,
      summary: currentText.news5Summary,
      image: currentText.news5Image,
      category: currentText.news5Category,
      date: currentText.news5Date,
      views: currentText.news5Views,
      tags: currentText.news5Tags,
    },
    {
      id: '6',
      title: currentText.news6Title,
      summary: currentText.news6Summary,
      image: currentText.news6Image,
      category: currentText.news6Category,
      date: currentText.news6Date,
      views: currentText.news6Views,
      tags: currentText.news6Tags,
    },
    {
      id: '7',
      title: currentText.news7Title,
      summary: currentText.news7Summary,
      image: currentText.news7Image,
      category: currentText.news7Category,
      date: currentText.news7Date,
      views: currentText.news7Views,
      tags: currentText.news7Tags,
    },
    {
      id: '8',
      title: currentText.news8Title,
      summary: currentText.news8Summary,
      image: currentText.news8Image,
      category: currentText.news8Category,
      date: currentText.news8Date,
      views: currentText.news8Views,
      tags: currentText.news8Tags,
    },
    {
      id: '9',
      title: currentText.news9Title,
      summary: currentText.news9Summary,
      image: currentText.news9Image,
      category: currentText.news9Category,
      date: currentText.news9Date,
      views: currentText.news9Views,
      tags: currentText.news9Tags,
    },
  ];

  const filteredNews = newsList.filter(n => {
    if (category !== 'all' && n.category !== category) return false;
    if (keyword && !n.title.toLowerCase().includes(keyword.toLowerCase()) && 
        !n.summary.toLowerCase().includes(keyword.toLowerCase())) return false;
    return true;
  });

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredNews.length / pageSize);

  const getCategoryName = (cat: string) => {
    const names: Record<string, string> = {
      company: currentText.filterCompany,
      industry: currentText.filterIndustry,
      event: currentText.filterEvent,
    };
    return names[cat] || cat;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [category, keyword]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, [currentPage, category, keyword]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="news-page daoda-page">
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
              <Link to="/news" className="active">{currentText.navNews}</Link>
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
          <div className="daoda-hero-image daoda-hero-news"></div>
        </div>
        <div className="daoda-hero-content">
          <div className="daoda-hero-badge">
            <span className="daoda-pulse-dot"></span>
            {currentText.heroTitle}
          </div>
          <h1 className="daoda-hero-title">{currentText.heroTitle}</h1>
          <p className="daoda-hero-desc">{currentText.heroDesc}</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="daoda-news-filter">
        <div className="daoda-section-container">
          <div className="daoda-filter-content">
            <div className="daoda-category-select">
              <select value={category} onChange={handleCategoryChange}>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <span className="daoda-select-arrow">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </span>
            </div>
            <div className="daoda-search-box">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder={currentText.searchPlaceholder}
                value={keyword}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="daoda-results-count">
            {currentText.resultsCount.replace('{{count}}', filteredNews.length.toString())}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="daoda-news-grid-section">
        <div className="daoda-section-container">
          <div className="daoda-news-grid">
            {loading ? (
              <div className="daoda-loading">
                <div className="daoda-spinner"></div>
              </div>
            ) : paginatedNews.length > 0 ? (
              <>
                {paginatedNews.map(item => (
                  <article key={item.id} className="daoda-news-card daoda-glass-panel">
                    <div className="daoda-news-image">
                      <div className={`daoda-news-img daoda-news-img-${item.image}`}>
                        <span className="daoda-category-tag">{getCategoryName(item.category)}</span>
                      </div>
                    </div>
                    <div className="daoda-news-content">
                      <div className="daoda-news-meta">
                        <span className="daoda-date">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                          </svg>
                          {item.date}
                        </span>
                        <span className="daoda-views">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                          {item.views}
                        </span>
                      </div>
                      <h3 className="daoda-news-title">{item.title}</h3>
                      <p className="daoda-news-summary">{item.summary}</p>
                      <div className="daoda-news-tags">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="daoda-tag">{tag}</span>
                        ))}
                      </div>
                      <Link to={`/news/${item.id}`} className="daoda-read-more">
                        {currentText.btnReadMore}
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </>
            ) : (
              <div className="daoda-empty">
                <div className="daoda-empty-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.12 9.12-1.41-1.41L13.19 4H14V3zm-5 5L3.59 16.59 5 18h6V8zm12 8v-7h-2v7h2z"/>
                  </svg>
                </div>
                <p>{currentText.emptyText}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredNews.length > 0 && (
            <div className="daoda-pagination">
              <button
                className="daoda-btn-secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                {currentText.prevPage}
              </button>
              
              <div className="daoda-pagination-info">
                {currentPage} / {totalPages}
              </div>
              
              <button
                className="daoda-btn-secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {currentText.nextPage}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="daoda-news-cta">
        <div className="daoda-section-container">
          <div className="daoda-cta-content">
            <h2>Stay Updated with Industry News</h2>
            <p>Subscribe to our newsletter to receive the latest news and insights directly to your inbox.</p>
            <form className="daoda-cta-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="daoda-btn-primary">
                Subscribe Now
              </button>
            </form>
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
              <p className="daoda-footer-desc">Global leader in electric mobility solutions.</p>
            </div>
            <div className="daoda-footer-col">
              <h5>Products</h5>
              <ul>
                <li><Link to="/products">Electric Sightseeing</Link></li>
                <li><Link to="/products">Golf Carts</Link></li>
                <li><Link to="/products">Vintage Classics</Link></li>
                <li><Link to="/products">Special Vehicles</Link></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>Solutions</h5>
              <ul>
                <li><a href="#">Smart City Mobility</a></li>
                <li><a href="#">Park Management</a></li>
                <li><a href="#">Digital Platform</a></li>
                <li><a href="#">Core Battery</a></li>
              </ul>
            </div>
            <div className="daoda-footer-col">
              <h5>Connect</h5>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/services">Global Service</Link></li>
                <li><Link to="/news">News</Link></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="daoda-footer-bottom">
            <p>© 2024 DAODA Smart Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default News;
