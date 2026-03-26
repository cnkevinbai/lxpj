import { useState, useEffect } from 'react'
import { Button, Typography, Card, Input, Space, Divider, Drawer } from 'antd'
import {
  MenuOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
  DownOutlined,
  RightOutlined,
  WechatOutlined,
  WeiboOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  DashboardOutlined,
  GlobalOutlined,
  LoginOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Link } = Typography

const navLinks = [
  { name: '产品中心', href: '#' },
  { name: '解决方案', href: '/solutions' },
  { name: '技术创新', href: '#' },
  { name: '关于我们', href: '/about' },
  { name: '联系我们', href: '#' },
]

const authLinks = {
  login: '/login',
  register: '/register',
  dashboard: '/portal',
}

const products = [
  { key: 'sightseeing', icon: '🚗', title: '新能源观光车', subtitle: '经典系列 · 传承，进化', features: ['800km 续航', '快速充电', '智能驾驶辅助'] },
  { key: 'patrol', icon: '🚓', title: '电动巡逻车', subtitle: '守护者 · 静默，迅捷', features: ['静音行驶', '快速响应', '全景监控'] },
  { key: 'golf', icon: '⛳', title: '高尔夫球车', subtitle: '奢华款 · 舒适，风尚', features: ['豪华座椅', '智能导航', '长续航'] },
  { key: 'autonomous', icon: '🤖', title: '无人驾驶观光车', subtitle: '未来款 · L4 自动驾驶', features: ['L4 自动驾驶', '智能避障', '远程监控'] },
  { key: 'sharing', icon: '🔄', title: '景区共享漫游车', subtitle: '共享款 · 扫码即走', features: ['智能扫码', '自动计费', 'GPS 定位'] },
]

const technologies = [
  { key: 'battery', icon: '🔋', title: '远，不止', value: '800', unit: 'km', desc: '超长续航', gradient: 'linear-gradient(135deg, #E6F0FF 0%, #FFFFFF 100%)' },
  { key: 'autonomous', icon: '🤖', title: '智，无界', value: '4', prefix: 'L', desc: '自动驾驶', gradient: 'linear-gradient(135deg, #E6F0FF 0%, #FFFFFF 100%)' },
  { key: 'connected', icon: '🌐', title: '瞬，互联', value: '5', desc: '智能网联', gradient: 'linear-gradient(135deg, #E6F0FF 0%, #FFFFFF 100%)' },
  { key: 'charging', icon: '⚡', title: '快，极速', value: '2', unit: 'h', desc: '快速充电', gradient: 'linear-gradient(135deg, #E6F0FF 0%, #FFFFFF 100%)' },
]

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="home-page">
      {/* Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="header-logo">
            <Title level={2} style={{ margin: 0, color: '#FFFFFF', fontSize: '24px' }}>道达智能</Title>
          </div>
          <nav className="header-nav">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">{link.name}</a>
            ))}
          </nav>
          <div className="header-actions">
            <Link to="/portal">
              <Button type="link" className="action-btn" icon={<DashboardOutlined />}>数字化平台</Button>
            </Link>
            <Button type="link" className="action-btn" icon={<GlobalOutlined />}>EN</Button>
            <Link to="/login">
              <Button type="primary" className="login-btn" icon={<LoginOutlined />}>登录</Button>
            </Link>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <MenuOutlined style={{ fontSize: 24, color: '#FFFFFF' }} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer placement="left" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen} width={300} className="mobile-drawer"
        styles={{ body: { padding: 0 }, header: { padding: '20px 24px', background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.1)' } }}
        title={<Title level={3} style={{ color: '#FFFFFF', margin: 0 }}>道达智能</Title>}>
        <div className="mobile-nav">
          {navLinks.map((link) => (<a key={link.name} href={link.href} className="mobile-nav-link">{link.name}</a>))}
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />
          <Button type="primary" block size="large" icon={<LoginOutlined />} style={{ marginTop: 16 }}>登录</Button>
        </div>
      </Drawer>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <Title className="hero-title">境·界全开</Title>
            <Paragraph className="hero-subtitle">L4 级自动驾驶观光车，定义未来出行</Paragraph>
            <div className="hero-cta">
              <Button type="primary" size="large" shape="round" icon={<ArrowRightOutlined />}>探索未来出行</Button>
              <Button size="large" shape="round" icon={<PlayCircleOutlined />}>观看影片</Button>
            </div>
          </div>
        </div>
        <div className="slide-indicators">
          {[0, 1, 2, 3, 4].map((index) => (
            <button key={index} className={`indicator ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
        <div className="scroll-indicator"><DownOutlined className="bounce" /></div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="container">
          <Title level={2} className="section-title">全系列产品</Title>
          <Paragraph className="section-subtitle">探索道达智能出行解决方案</Paragraph>
          <div className="products-grid">
            {products.map((product) => (
              <Card key={product.key} className="product-card" hoverable>
                <div className="product-icon">{product.icon}</div>
                <Title level={4} className="product-title">{product.title}</Title>
                <Paragraph className="product-subtitle">{product.subtitle}</Paragraph>
                <div className="product-features">
                  {product.features.map((feature, i) => (
                    <div key={i} className="feature-item">
                      <span className="feature-dot" />
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button type="primary" shape="round" icon={<ArrowRightOutlined />} className="learn-more-btn">了解详情</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="technology-section">
        <div className="container">
          <Title level={2} className="section-title">技术，无界</Title>
          <Paragraph className="section-subtitle">创新科技，驱动未来出行</Paragraph>
          <div className="tech-grid">
            {technologies.map((tech) => (
              <Card key={tech.key} className="tech-card">
                <div className="tech-icon" style={{ background: tech.gradient, fontSize: '40px' }}>{tech.icon}</div>
                <Title level={3} className="tech-title">{tech.title}</Title>
                <div className="tech-statistic">
                  {tech.prefix && <span className="tech-prefix">{tech.prefix}</span>}
                  <span className="tech-value">{tech.value}</span>
                  {tech.unit && <span className="tech-unit">{tech.unit}</span>}
                </div>
                <Paragraph className="tech-desc">{tech.desc}</Paragraph>
                <div className="energy-line" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-subscribe">
            <div className="footer-brand">
              <Title level={2} style={{ color: '#FFFFFF', marginBottom: 8 }}>道达智能</Title>
              <Paragraph style={{ color: '#A0A0A0', fontSize: 14 }}>DAODA INTELLIGENT</Paragraph>
            </div>
            <div className="subscribe-section">
              <Title level={5} style={{ color: '#FFFFFF', marginBottom: 8 }}>订阅我们</Title>
              <Paragraph style={{ color: '#A0A0A0', marginBottom: 16 }}>获取最新资讯和产品动态</Paragraph>
              <div className="subscribe-form">
                <Input placeholder="输入邮箱地址" style={{ width: 280, background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }} />
                <Button type="primary" icon={<RightOutlined />} style={{ marginLeft: 12, background: '#0066FF', border: 'none' }}>订阅</Button>
              </div>
            </div>
          </div>
          <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '48px 0' }} />
          <div className="footer-links">
            {['产品中心', '解决方案', '服务支持', '关于道达'].map((col, i) => (
              <div key={i} className="footer-column">
                <Title level={5} style={{ color: '#FFFFFF', marginBottom: 20 }}>{col}</Title>
                <ul className="footer-list">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <li key={item}><Link href="#" style={{ color: '#A0A0A0' }}>链接{item}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '48px 0' }} />
          <div className="footer-bottom">
            <div className="social-links">
              <Space size="large">
                <a href="#" className="social-icon"><WechatOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
                <a href="#" className="social-icon"><WeiboOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
                <a href="#" className="social-icon"><LinkedinOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
                <a href="#" className="social-icon"><YoutubeOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
              </Space>
            </div>
            <div className="copyright">
              <Paragraph style={{ color: '#606060', marginBottom: 8 }}>© 2026 四川道达智能车辆制造有限公司。All rights reserved.</Paragraph>
              <div className="footer-legal">
                <Link href="#" style={{ color: '#606060', marginRight: 16 }}>隐私政策</Link>
                <Link href="#" style={{ color: '#606060', marginRight: 16 }}>使用条款</Link>
                <Link href="#" style={{ color: '#606060', marginRight: 16 }}>网站地图</Link>
              </div>
            </div>
            <div className="language-switch">
              <Space size="middle">
                <a style={{ color: '#0066FF', cursor: 'pointer' }}>中文</a>
                <span style={{ color: '#606060' }}>|</span>
                <a style={{ color: '#606060', cursor: 'pointer' }}>English</a>
              </Space>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .site-header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: all 0.3s ease; background: transparent; }
        .site-header.scrolled { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(20px); box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1); }
        .site-header.scrolled .header-logo h2 { color: #1A1A1A !important; }
        .site-header.scrolled .nav-link { color: #404040; }
        .site-header.scrolled .nav-link:hover { color: #0066FF; }
        .site-header.scrolled .action-btn { color: #404040; }
        .site-header.scrolled .mobile-menu-btn { color: #1A1A1A !important; }
        .header-content { max-width: 1400px; margin: 0 auto; padding: 0 24px; height: 80px; display: flex; align-items: center; justify-content: space-between; transition: height 0.3s ease; }
        .site-header.scrolled .header-content { height: 64px; }
        .header-logo { flex-shrink: 0; }
        .header-nav { display: flex; gap: 40px; }
        .nav-link { color: #E0E0E0; text-decoration: none; font-size: 16px; transition: color 0.3s ease; position: relative; }
        .nav-link:hover { color: #0066FF; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #0066FF, #00D4FF); transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .header-actions { display: flex; gap: 16px; align-items: center; }
        .action-btn { color: #E0E0E0; font-size: 14px; }
        .action-btn:hover { color: #0066FF; }
        .login-btn { background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%); border: none; height: 40px; padding: 0 24px; }
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
        .mobile-nav { display: flex; flex-direction: column; gap: 8px; }
        .mobile-nav-link { display: flex; align-items: center; padding: 16px 24px; color: #E0E0E0; text-decoration: none; font-size: 16px; transition: all 0.3s ease; border-radius: 8px; }
        .mobile-nav-link:hover { background: rgba(0, 102, 255, 0.1); color: #0066FF; }
        .mobile-drawer .ant-drawer-content { background: #0A0A0A; }
        @media (max-width: 1024px) { .header-nav, .header-actions { display: none; } .mobile-menu-btn { display: block; } }

        .hero-section { height: 100vh; background: linear-gradient(135deg, #050505 0%, #0A0A0A 100%); display: flex; align-items: center; justify-content: center; position: relative; }
        .hero-content { text-align: center; color: #FFFFFF; }
        .hero-title { font-size: 64px !important; font-weight: bold !important; margin-bottom: 24px !important; background: linear-gradient(90deg, #8C8C8C 0%, #FFFFFF 50%, #0066FF 100%); background-size: 200% auto; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: text-reveal 3s ease-out; }
        .hero-subtitle { font-size: 20px !important; color: #E0E0E0 !important; margin-bottom: 48px !important; }
        .hero-cta { display: flex; gap: 24px; justify-content: center; }
        .hero-cta .ant-btn-primary { background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%); border: none; height: 54px; padding: 0 40px; font-size: 18px; }
        .slide-indicators { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; }
        .indicator { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.5); background: transparent; cursor: pointer; transition: all 0.3s ease; }
        .indicator.active { background: #0066FF; border-color: #0066FF; }
        .scroll-indicator { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: #FFFFFF; font-size: 24px; }
        .bounce { animation: bounce 1.5s ease-in-out infinite; }
        
        .products-section { padding: 160px 24px; background: linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%); }
        .technology-section { padding: 160px 24px; background: linear-gradient(180deg, #FFFFFF 0%, #F0F2F5 100%); }
        .container { max-width: 1400px; margin: 0 auto; }
        .section-title { font-size: 48px !important; color: #1A1A1A !important; text-align: center; margin-bottom: 16px !important; }
        .section-subtitle { font-size: 20px !important; color: #606060 !important; text-align: center; margin-bottom: 64px !important; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }
        .product-card { background: #FFFFFF; border: 1px solid #E0E0E0 !important; border-radius: 16px !important; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
        .product-card:hover { transform: translateY(-12px) scale(1.02); border-color: #0066FF !important; box-shadow: 0 12px 40px rgba(0, 102, 255, 0.15); }
        .product-icon { font-size: 80px; margin-bottom: 24px; }
        .product-title { color: #1A1A1A !important; margin-bottom: 8px !important; }
        .product-subtitle { color: #8C8C8C !important; margin-bottom: 20px !important; }
        .product-features { text-align: left; margin-bottom: 24px; }
        .feature-item { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .feature-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%); flex-shrink: 0; }
        .feature-text { color: #404040; font-size: 14px; }
        .learn-more-btn { width: 100%; height: 44px; background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%); border: none; }
        .tech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
        .tech-card { background: #FFFFFF; border: 1px solid #E0E0E0 !important; border-radius: 16px !important; padding: 40px 32px !important; text-align: center; position: relative; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
        .tech-card:hover { transform: translateY(-8px); border-color: #0066FF !important; box-shadow: 0 12px 40px rgba(0, 102, 255, 0.15); }
        .tech-icon { width: 80px; height: 80px; margin: 0 auto 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .tech-title { color: #1A1A1A !important; font-size: 20px !important; margin-bottom: 16px !important; }
        .tech-statistic { display: flex; align-items: baseline; justify-content: center; gap: 4px; margin-bottom: 16px; }
        .tech-prefix { font-size: 24px; color: #8C8C8C; }
        .tech-value { font-size: 64px; font-weight: 700; color: #0066FF; }
        .tech-unit { font-size: 20px; color: #8C8C8C; }
        .tech-desc { color: #606060 !important; font-size: 14px !important; margin: 0 !important; }
        .energy-line { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent 0%, rgba(0, 102, 255, 0.5) 50%, transparent 100%); animation: energy-flow 3s ease-in-out infinite; }
        
        .site-footer { background: #050505; padding: 80px 24px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .footer-content { max-width: 1400px; margin: 0 auto; }
        .footer-subscribe { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
        .subscribe-form { display: flex; gap: 12px; }
        .footer-links { display: grid; grid-template-columns: repeat(4, 1fr); gap: 48px; }
        .footer-list { list-style: none; padding: 0; margin: 0; }
        .footer-list li { margin-bottom: 12px; }
        .footer-list a:hover { color: #0066FF !important; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
        .social-icon:hover { color: #0066FF !important; }
        .footer-legal { display: flex; gap: 16px; }
        
        @keyframes text-reveal { 0% { background-position: -100% 0; } 100% { background-position: 200% 0; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes energy-flow { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
        
        @media (max-width: 1024px) { .footer-links { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .hero-title { font-size: 36px !important; } .hero-subtitle { font-size: 16px !important; } .hero-cta { flex-direction: column; gap: 16px; } .products-section, .technology-section { padding: 80px 24px; } .section-title { font-size: 28px !important; } .section-subtitle { font-size: 16px !important; } .products-grid, .tech-grid { grid-template-columns: 1fr; } .footer-subscribe { flex-direction: column; gap: 32px; } .footer-links { grid-template-columns: 1fr; } .subscribe-form { flex-direction: column; } .footer-bottom { flex-direction: column; align-items: flex-start; } .tech-value { font-size: 48px !important; } }
      `}</style>
    </div>
  )
}

export default Home
