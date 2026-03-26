/**
 * 新闻详情页面 - 重构版本
 * 统一风格：深色主题、daoda-前缀、自定义组件
 */
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './NewsDetail.css'

// 新闻分类定义
interface NewsCategory {
  key: string
  label: string
  labelEn: string
  color: string
}

const newsCategories: NewsCategory[] = [
  { key: 'company', label: '公司新闻', labelEn: 'Company News', color: 'blue' },
  { key: 'industry', label: '行业动态', labelEn: 'Industry News', color: 'green' },
  { key: 'event', label: '活动信息', labelEn: 'Event Info', color: 'orange' },
]

const getCategoryInfo = (key: string) => {
  return newsCategories.find(c => c.key === key) || newsCategories[0]
}

// 模拟新闻详情数据
const mockNewsDetail: Record<string, any> = {
  '1': {
    id: '1',
    title: '道达智能亮相2026国际旅游展览会',
    titleEn: 'DAODA Smart at 2026 International Tourism Exhibition',
    summary: '道达智能携最新款电动观光车系列亮相2026国际旅游展览会，展示智慧出行解决方案。',
    summaryEn: 'DAODA Smart showcased its latest electric sightseeing vehicle series at the 2026 International Tourism Exhibition.',
    cover: 'https://via.placeholder.com/800x400?text=News+Detail',
    category: 'company',
    publishAt: '2026-03-20',
    publishAtEn: 'Mar 20, 2026',
    views: 1234,
    tags: ['展会', '新品发布'],
    tagsEn: ['Exhibition', 'New Product Launch'],
    author: '道达智能公关部',
    authorEn: 'DAODA Smart PR Department',
    content: `
      <p>2026年3月20日，道达智能携最新款电动观光车系列亮相2026国际旅游展览会，向全球游客展示智慧出行解决方案。</p>
      
      <h3>展会亮点</h3>
      <p>本次展会，道达智能展出了三款明星产品：</p>
      <ul>
        <li>Vintage V8 复古观光车：经典美学与现代科技的完美融合</li>
        <li>Tour Pro 长续航版：专为长途通勤设计的高性能电动车</li>
        <li>Golf X4 四座球车：豪华度假村首选高端球车</li>
      </ul>
      
      <h3>智慧出行解决方案</h3>
      <p>除了硬件展示，道达智能还重点介绍了智慧出行解决方案，包括：</p>
      <ul>
        <li>智能调度系统：AI优化车辆调度，提升运营效率</li>
        <li>远程监控平台：实时监控车辆状态，预测维护需求</li>
        <li>乘客服务APP：提供预约、导航、支付一体化服务</li>
      </ul>
      
      <h3>客户反馈</h3>
      <p>展会期间，众多景区运营商对道达智能的产品表现出浓厚兴趣，现场签约意向客户超过50家。</p>
    `,
    contentEn: `
      <p>On March 20, 2026, DAODA Smart showcased its latest electric sightseeing vehicle series at the 2026 International Tourism Exhibition.</p>
      
      <h3>Exhibition Highlights</h3>
      <p>DAODA Smart displayed three flagship products at the exhibition:</p>
      <ul>
        <li>Vintage V8 Retro Touring: Perfect fusion of classic aesthetics and modern technology</li>
        <li>Tour Pro Extended Range: High-performance电动车 for long-distance commuting</li>
        <li>Golf X4 Four-Seater: Premium choice for luxury resorts and golf courses</li>
      </ul>
      
      <h3>Smart Mobility Solution</h3>
      <p>Beyond hardware, DAODA Smart showcased smart mobility solutions including:</p>
      <ul>
        <li>AI-powered scheduling system for optimal vehicle dispatch</li>
        <li>Remote monitoring platform for real-time fleet management</li>
        <li>Passenger service APP for integrated booking, navigation, and payment</li>
      </ul>
      
      <h3>Customer Feedback</h3>
      <p>Many scenic area operators showed strong interest, with over 50 signing意向 clients.</p>
    `,
  },
  '2': {
    id: '2',
    title: '新能源观光车行业发展趋势报告发布',
    titleEn: '2026 Trends Report for Electric Sightseeing Vehicles Released',
    summary: '中国旅游车船协会发布《2026新能源观光车行业发展趋势报告》，道达智能作为标杆企业入选案例。',
    summaryEn: 'China Tourism Vehicles Association released the 2026 Trends Report, featuring DAODA Smart as a benchmark case.',
    cover: 'https://via.placeholder.com/800x400?text=Industry+Report',
    category: 'industry',
    publishAt: '2026-03-18',
    publishAtEn: 'Mar 18, 2026',
    views: 892,
    tags: ['行业报告', '新能源'],
    tagsEn: ['Industry Report', 'New Energy'],
    author: '行业分析师',
    authorEn: 'Industry Analyst',
    content: `
      <p>中国旅游车船协会正式发布《2026新能源观光车行业发展趋势报告》，道达智能作为行业标杆企业入选成功案例。</p>
      
      <h3>报告要点</h3>
      <p>报告指出，新能源观光车市场将保持高速增长：</p>
      <ul>
        <li>2026年市场规模预计突破100亿元</li>
        <li>电动观光车渗透率将达到80%以上</li>
        <li>智能化、网联化成为主要发展方向</li>
      </ul>
      
      <h3>道达智能案例</h3>
      <p>报告以道达智能为案例，详细分析了企业在以下方面的成功经验：</p>
      <ul>
        <li>产品创新：持续研发投入，产品线覆盖多个细分市场</li>
        <li>服务升级：建立完善的售后服务体系</li>
        <li>数字化转型：打造智慧运营平台</li>
      </ul>
    `,
    contentEn: `
      <p>China Tourism Vehicles Association released the 2026 Trends Report, featuring DAODA Smart as a benchmark case.</p>
      
      <h3>Key Highlights</h3>
      <p>The report predicts continued high growth for the electric sightseeing vehicle market:</p>
      <ul>
        <li>Market size to exceed 10 billion yuan in 2026</li>
        <li>Electric penetration rate to exceed 80%</li>
        <li>Intelligent and connected vehicles as main development direction</li>
      </ul>
      
      <h3>DAODA Smart Case Study</h3>
      <p>The report analyzes DAODA Smart's success in:</p>
      <ul>
        <li>Product innovation with continuous R&D investment</li>
        <li>Service upgrades with comprehensive after-sales system</li>
        <li>Digital transformation with smart operations platform</li>
      </ul>
    `,
  },
}

// 相关新闻
const relatedNews = [
  { id: '3', title: '道达智能与黄山风景区签署战略合作协议', titleEn: 'DAODA Smart signs战略合作 with Huangshan Scenic Area', date: '2026-03-15', dateEn: 'Mar 15, 2026' },
  { id: '4', title: '2026道达智能春季新品发布会圆满举办', titleEn: '2026 DAODA Smart Spring新品 Launch Successful', date: '2026-03-10', dateEn: 'Mar 10, 2026' },
  { id: '5', title: '道达智能获得国家级绿色工厂认证', titleEn: 'DAODA Smart receives国家级 Green Factory Certification', date: '2026-03-05', dateEn: 'Mar 5, 2026' },
]

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<any>(null)
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      const data = mockNewsDetail[id || '']
      setNews(data || null)
      setLoading(false)
    }, 500)
  }, [id])

  const currentText = {
    reading: language === 'zh' ? '阅读' : 'Read',
    share: language === 'zh' ? '分享' : 'Share',
    relatedNews: language === 'zh' ? '相关新闻' : 'Related News',
    viewAllNews: language === 'zh' ? '查看所有新闻' : 'View All News',
    back: language === 'zh' ? '返回' : 'Back',
    author: language === 'zh' ? '作者' : 'Author',
    tags: language === 'zh' ? '标签' : 'Tags',
    publishDate: language === 'zh' ? '发布日期' : 'Publish Date',
    views: language === 'zh' ? '阅读量' : 'Views',
  }

  if (loading) {
    return (
      <div className="daoda-news-detail loading-state">
        <div className="daoda-spin"></div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="daoda-news-detail not-found">
        <h3 className="daoda-error-title">新闻不存在</h3>
        <Link to="/news" className="daoda-btn-primary">
          {currentText.viewAllNews}
        </Link>
      </div>
    )
  }

  const categoryInfo = getCategoryInfo(news.category)

  const getLocalizedString = (zh: string, en: string) => {
    return language === 'zh' ? zh : en
  }

  const getCategoryLocalizedString = (cat: string) => {
    const info = getCategoryInfo(cat)
    return language === 'zh' ? info.label : info.labelEn
  }

  return (
    <div className="daoda-news-detail-page">
      {/* Header */}
      <header className="daoda-news-detail-header">
        <div className="daoda-news-detail-header-inner">
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
              <Link to="/">{language === 'zh' ? '首页' : 'Home'}</Link>
              <Link to="/products">{language === 'zh' ? '产品中心' : 'Products'}</Link>
              <Link to="/news" className="active">{language === 'zh' ? '新闻动态' : 'News'}</Link>
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

      {/* Navigation */}
      <div className="daoda-breadcrumb">
        <div className="daoda-container">
          <Link to="/">{language === 'zh' ? '首页' : 'Home'}</Link>
          <span className="daoda-breadcrumb-separator">/</span>
          <Link to="/news">{language === 'zh' ? '新闻动态' : 'News'}</Link>
          <span className="daoda-breadcrumb-separator">/</span>
          <span className="daoda-breadcrumb-current">{getLocalizedString(news.title, news.titleEn)}</span>
        </div>
      </div>

      {/* Article Header */}
      <article className="daoda-article-header">
        <div className="daoda-container">
          {/* Return Button */}
          <div className="daoda-return-btn">
            <button 
              className="daoda-btn-secondary"
              onClick={() => navigate(-1)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              {currentText.back}
            </button>
          </div>

          {/* Article Meta */}
          <header className="daoda-article-meta">
            <div className="daoda-meta-top">
              <span className={`daoda-tag daoda-tag-${categoryInfo.color}`}>
                {getCategoryLocalizedString(news.category)}
              </span>
              
              <div className="daoda-meta-info">
                <div className="daoda-meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>{getLocalizedString(news.publishAt, news.publishAtEn)}</span>
                </div>
                <div className="daoda-meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <span>{news.views} {currentText.reading}</span>
                </div>
                {news.author && (
                  <div className="daoda-meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>{getLocalizedString(news.author, news.authorEn)}</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Article Title */}
          <h1 className="daoda-article-title">
            {getLocalizedString(news.title, news.titleEn)}
          </h1>
        </div>
      </article>

      {/* Cover Image */}
      <div className="daoda-article-cover">
        <div className="daoda-cover-placeholder">
          <span>{getLocalizedString(news.title, news.titleEn)}</span>
        </div>
      </div>

      {/* Article Content */}
      <article className="daoda-article-content">
        <div className="daoda-container">
          <div 
            className="daoda-article-body"
            dangerouslySetInnerHTML={{ __html: language === 'zh' ? news.content : news.contentEn }}
          />
        </div>
      </article>

      {/* Tags */}
      <div className="daoda-article-tags">
        <div className="daoda-container">
          <h3>{currentText.tags}</h3>
          <div className="daoda-tags-list">
            {news.tags.map((tag: string, index: number) => (
              <span key={index} className="daoda-tag daoda-tag-default">
                {getLocalizedString(tag, tag)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related News */}
      <div className="daoda-related-news">
        <div className="daoda-container">
          <h2 className="daoda-section-title">{currentText.relatedNews}</h2>
          <div className="daoda-related-grid">
            {relatedNews.map(item => (
              <Link 
                key={item.id} 
                to={`/news/${item.id}`}
                className="daoda-related-card"
              >
                <div className="daoda-related-card-content">
                  <h3 className="daoda-related-title">
                    {getLocalizedString(item.title, item.titleEn)}
                  </h3>
                  <span className="daoda-related-date">
                    {getLocalizedString(item.date, item.dateEn)}
                  </span>
                </div>
                <div className="daoda-related-arrow">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </Link>
            ))}
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
                <li><a href="tel:400-888-8888">400-888-8888</a></li>
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

export default NewsDetail
