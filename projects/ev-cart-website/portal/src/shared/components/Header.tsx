import { useState, useEffect } from 'react'
import { Button, Typography, Card, Input, Space, Divider, Drawer } from 'antd'
import {
  MenuOutlined,
  CloseOutlined,
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
  { name: '产品中心', href: '/products' },
  { name: '解决方案', href: '/solutions' },
  { name: '技术创新', href: '/technology' },
  { name: '关于我们', href: '/about' },
  { name: '联系我们', href: '/contact' },
]

const Header = ({ isScrolled }: { isScrolled: boolean }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="header-logo">
            <Title level={2} style={{ margin: 0, color: '#FFFFFF', fontSize: '24px' }}>
              道达智能
            </Title>
          </div>

          {/* PC 导航 */}
          <nav className="header-nav">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
          </nav>

          {/* 右侧功能按钮 */}
          <div className="header-actions">
            <Button type="link" className="action-btn" icon={<DashboardOutlined />}>
              数字化平台
            </Button>
            <Button type="link" className="action-btn" icon={<GlobalOutlined />}>
              EN
            </Button>
            <Button type="primary" className="login-btn" icon={<LoginOutlined />}>
              登录
            </Button>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <MenuOutlined style={{ fontSize: 24, color: '#FFFFFF' }} />
          </button>
        </div>
      </header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
        className="mobile-drawer"
        styles={{
          body: { padding: 0 },
          header: { padding: '20px 24px', background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.1)' },
        }}
        title={
          <Title level={3} style={{ color: '#FFFFFF', margin: 0 }}>
            道达智能
          </Title>
        }
      >
        <div className="mobile-nav">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="mobile-nav-link">
              {link.name}
            </a>
          ))}
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />
          <a href="/portal" className="mobile-nav-link">
            <DashboardOutlined style={{ marginRight: 12 }} />
            数字化平台
          </a>
          <Button type="primary" block size="large" icon={<LoginOutlined />} style={{ marginTop: 16 }}>
            登录
          </Button>
        </div>
      </Drawer>

      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          background: transparent;
        }

        .site-header.scrolled {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .site-header.scrolled .header-logo h2 {
          color: #1A1A1A !important;
        }

        .site-header.scrolled .nav-link {
          color: #404040;
        }

        .site-header.scrolled .nav-link:hover {
          color: #0066FF;
        }

        .site-header.scrolled .action-btn {
          color: #404040;
        }

        .site-header.scrolled .mobile-menu-btn {
          color: #1A1A1A !important;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: height 0.3s ease;
        }

        .site-header.scrolled .header-content {
          height: 64px;
        }

        .header-logo {
          flex-shrink: 0;
        }

        .header-nav {
          display: flex;
          gap: 40px;
        }

        .nav-link {
          color: #E0E0E0;
          text-decoration: none;
          font-size: 16px;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #0066FF;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0066FF, #00D4FF);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .action-btn {
          color: #E0E0E0;
          font-size: 14px;
        }

        .action-btn:hover {
          color: #0066FF;
        }

        .login-btn {
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          border: none;
          height: 40px;
          padding: 0 24px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          color: #E0E0E0;
          text-decoration: none;
          font-size: 16px;
          transition: all 0.3s ease;
          border-radius: 8px;
        }

        .mobile-nav-link:hover {
          background: rgba(0, 102, 255, 0.1);
          color: #0066FF;
        }

        .mobile-drawer .ant-drawer-content {
          background: #0A0A0A;
        }

        @media (max-width: 1024px) {
          .header-nav, .header-actions {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
    </>
  )
}

export default Header
