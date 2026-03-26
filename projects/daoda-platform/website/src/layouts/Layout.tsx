/**
 * 官网布局组件 - 重新定义导航栏
 */
import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Dropdown, Space } from 'antd'
import {
  GlobalOutlined,
  PhoneOutlined,
  AppstoreOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ReadOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import './Layout.css'

const { Header, Content, Footer } = AntLayout

// 导航菜单项 - 重新定义
const navItems = [
  { 
    key: '/products', 
    label: <Link to="/products">产品中心</Link>,
    icon: <AppstoreOutlined />
  },
  { 
    key: '/solutions', 
    label: <Link to="/solutions">解决方案</Link>,
    icon: <BulbOutlined />
  },
  {
    key: '/cases',
    label: <Link to="/cases">成功案例</Link>,
    icon: <TrophyOutlined />
  },
  {
    key: '/news',
    label: <Link to="/news">新闻动态</Link>,
    icon: <ReadOutlined />
  },
  { 
    key: '/services', 
    label: <Link to="/services">服务支持</Link>,
    icon: <CustomerServiceOutlined />
  },
  { 
    key: '/about', 
    label: <Link to="/about">关于道达</Link>,
    icon: <TeamOutlined />
  },
]

// 语言切换选项
const langItems = [
  { key: 'zh', label: '🇨🇳 中文' },
  { key: 'en', label: '🇺🇸 English' },
]

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <AntLayout className="layout">
      {/* 顶部导航 */}
      <Header className="header">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <span className="logo-text">道达智能</span>
            <span className="logo-sub">DAODA</span>
          </Link>
        </div>

        {/* 主导航菜单 */}
        <Menu
          mode="horizontal"
          items={navItems}
          selectedKeys={[location.pathname]}
          className="nav-menu"
          style={{ flex: 1, justifyContent: 'center' }}
        />

        {/* 右侧操作区 */}
        <div className="header-right">
          <Space size="middle">
            {/* 语言切换 */}
            <Dropdown menu={{ items: langItems }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />}>
                中文
              </Button>
            </Dropdown>
            
            {/* 联系我们 */}
            <Link to="/contact">
              <Button type="text" icon={<PhoneOutlined />}>
                联系我们
              </Button>
            </Link>
            
            {/* 登录入口 */}
            <Link to="/portal">
              <Button type="primary">业务系统</Button>
            </Link>
          </Space>
        </div>
      </Header>

      {/* 内容区域 */}
      <Content className="content">
        <Outlet />
      </Content>

      {/* 页脚 */}
      <Footer className="footer">
        <div className="footer-content">
          {/* Logo & 简介 */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-text">道达智能</span>
              <span className="logo-sub">DAODA INTELLIGENCE</span>
            </div>
            <p className="footer-desc">
              全球领先的电动观光车解决方案提供商<br/>
              以智能科技重新定义出行体验
            </p>
          </div>

          {/* 产品中心 */}
          <div className="footer-section">
            <h4>产品中心</h4>
            <Link to="/products?category=sightseeing">电动观光车</Link>
            <Link to="/products?category=golf">高尔夫球车</Link>
            <Link to="/products?category=vintage">经典老爷车</Link>
            <Link to="/products?category=utility">特种车辆</Link>
          </div>

          {/* 解决方案 */}
          <div className="footer-section">
            <h4>解决方案</h4>
            <Link to="/solutions/scenic">景区园区</Link>
            <Link to="/solutions/golf">高尔夫球场</Link>
            <Link to="/solutions/property">地产社区</Link>
            <Link to="/solutions/industrial">工业园区</Link>
          </div>

          {/* 服务支持 */}
          <div className="footer-section">
            <h4>服务支持</h4>
            <Link to="/services">服务体系</Link>
            <Link to="/services/network">服务网络</Link>
            <Link to="/services/parts">配件中心</Link>
            <Link to="/contact">技术支持</Link>
          </div>

          {/* 关于道达 */}
          <div className="footer-section">
            <h4>关于道达</h4>
            <Link to="/about">公司简介</Link>
            <Link to="/about/culture">企业文化</Link>
            <Link to="/cases">成功案例</Link>
            <Link to="/news">新闻动态</Link>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="footer-bottom">
          <p>© 2026 道达智能车辆制造有限公司 版权所有</p>
          <p>蜀ICP备XXXXXXXX号-1</p>
        </div>
      </Footer>
    </AntLayout>
  )
}