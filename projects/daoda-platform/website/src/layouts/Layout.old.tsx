/**
 * 官网布局组件
 */
import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Dropdown } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import './Layout.css'

const { Header, Content, Footer } = AntLayout

const navItems = [
  { key: '/products', label: <Link to="/products">产品中心</Link> },
  { key: '/solutions', label: <Link to="/solutions">智慧方案</Link> },
  { key: '/services', label: <Link to="/services">全球服务</Link> },
  { key: '/about', label: <Link to="/about">关于道达</Link> },
]

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const langItems = [
    { key: 'zh', label: '中文' },
    { key: 'en', label: 'English' },
  ]

  return (
    <AntLayout className="layout">
      <Header className="header">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">道达智能</span>
            <span className="logo-sub">DAODA INTELLIGENCE</span>
          </Link>
        </div>

        <Menu
          mode="horizontal"
          items={navItems}
          selectedKeys={[location.pathname]}
          className="nav-menu"
        />

        <div className="header-right">
          <Dropdown menu={{ items: langItems }} placement="bottomRight">
            <Button type="text" icon={<GlobalOutlined />}>
              中文
            </Button>
          </Dropdown>
          <Link to="/portal">
            <Button type="primary">登录</Button>
          </Link>
        </div>

        <Button
          className="mobile-menu-btn"
          type="text"
          icon={mobileMenuOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </Header>

      <Content className="content">
        <Outlet />
      </Content>

      <Footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>产品中心</h4>
            <Link to="/products?series=观光车">电动观光车</Link>
            <Link to="/products?series=高尔夫">高尔夫球车</Link>
            <Link to="/products?series=老爷车">经典老爷车</Link>
            <Link to="/products?series=特种">特种车辆</Link>
          </div>
          <div className="footer-section">
            <h4>智慧方案</h4>
            <Link to="/solutions/景区">景区园区</Link>
            <Link to="/solutions/高尔夫">高尔夫球场</Link>
            <Link to="/solutions/地产">地产社区</Link>
            <Link to="/solutions/工业">工业园区</Link>
          </div>
          <div className="footer-section">
            <h4>全球服务</h4>
            <Link to="/services">服务体系</Link>
            <Link to="/services/network">服务网络</Link>
            <Link to="/services/parts">配件中心</Link>
            <Link to="/services/support">技术支持</Link>
          </div>
          <div className="footer-section">
            <h4>关于道达</h4>
            <Link to="/about">公司简介</Link>
            <Link to="/about/culture">企业文化</Link>
            <Link to="/about/honors">荣誉资质</Link>
            <Link to="/contact">联系我们</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 道达智能车辆制造有限公司 版权所有</p>
          <p>蜀ICP备XXXXXXXX号-1</p>
        </div>
      </Footer>
    </AntLayout>
  )
}