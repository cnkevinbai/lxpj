import React from 'react'
import { Layout, Menu, Button, Space, Dropdown, Avatar } from 'antd'
import type { MenuProps } from 'antd'
import {
  BugOutlined,
  MenuOutlined,
  UserOutlined,
  SearchOutlined,
  FormOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { websiteMenuConfig, userMenuConfig } from '../config/menuConfig'

const { Header, Content, Footer } = Layout

const WebsiteLayout: React.FC = () => {
  const location = useLocation()

  // 获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAuthenticated = !!localStorage.getItem('access_token')

  // 将 MenuItem[] 转换为 antd MenuProps['items']
  const convertToMenuItems = (items?: any[]): MenuProps['items'] => {
    if (!items) return []
    return items.map((item) => ({
      key: item.key,
      label: item.label,
      children: item.children ? convertToMenuItems(item.children) : undefined,
    }))
  }

  // 用户菜单点击处理
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (key === 'profile') {
      window.location.href = '/portal'
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 顶部导航栏 */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          padding: '0 48px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo 区域 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              EV
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#333',
                marginLeft: 8,
              }}
            >
              道达智能
            </span>
          </Link>
        </div>

        {/* 导航菜单（桌面端） */}
        <div style={{ flex: 1 }}>
          {websiteMenuConfig.map((item) => (
            <Link
              key={item.key}
              to={item.key}
              style={{
                color: location.pathname === item.key ? '#667eea' : '#333',
                textDecoration: 'none',
                marginRight: 24,
                fontWeight: location.pathname === item.key ? '600' : '400',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 右侧操作区域 */}
        <Space size={16}>
          {/* 搜索框 */}
          <div
            style={{
              width: 200,
              position: 'relative',
            }}
          >
            <SearchOutlined
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                fontSize: 14,
              }}
            />
            <input
              type="text"
              placeholder="搜索..."
              style={{
                width: '100%',
                padding: '8px 36px 8px 36px',
                borderRadius: 20,
                border: '1px solid #e0e0e0',
                background: '#f5f5f5',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.background = '#fff'
                e.target.style.borderColor = '#667eea'
              }}
              onBlur={(e) => {
                e.target.style.background = '#f5f5f5'
                e.target.style.borderColor = '#e0e0e0'
              }}
            />
          </div>

          {/* 用户菜单 */}
          <Dropdown
            menu={{ items: convertToMenuItems(userMenuConfig), onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: 20,
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#667eea' }} />
              <span style={{ fontSize: 14, color: '#333' }}>
                {isAuthenticated ? (user.realName || user.username || '用户') : '登录'}
              </span>
            </div>
          </Dropdown>

          {/* 主操作按钮 */}
          {!isAuthenticated && (
            <Button
              type="primary"
              href="/login"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              立即登录
            </Button>
          )}
        </Space>
      </Header>

      {/* 主内容区域 */}
      <Content style={{ padding: '48px 24px' }}>
        <Outlet />
      </Content>

      {/* 页脚 */}
      <Footer
        style={{
          background: '#1a1a1a',
          color: 'rgba(255, 255, 255, 0.6)',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            EV
          </div>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>道达智能集团</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            maxWidth: 1200,
            margin: '0 auto 32px',
            gap: 32,
            textAlign: 'left',
          }}
        >
          <div>
            <h4 style={{ color: 'white', marginBottom: 16, fontSize: 16 }}>产品与服务</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="/products" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                  客户关系管理
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/solutions" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                  解决方案
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/service" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                  售后服务
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: 16, fontSize: 16 }}>关于我们</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="/about" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                  公司简介
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                  联系我们
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/dealer" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                  加入我们
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: 16, fontSize: 16 }}>联系与支持</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8, fontSize: 14 }}>
                📞 400-888-8888
              </li>
              <li style={{ marginBottom: 8, fontSize: 14 }}>
                📧 support@daoda-smart.com
              </li>
              <li style={{ marginBottom: 8, fontSize: 14 }}>
                📍 北京市朝阳区智能大厦
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
            fontSize: 14,
          }}
        >
          <p style={{ margin: '8px 0' }}>
            © 2026 道达智能集团 | 本网站系统由 EV Cart CRM 提供支持
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              隐私政策
            </a>
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              服务条款
            </a>
            <a href="/sitemap" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              网站地图
            </a>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default WebsiteLayout
