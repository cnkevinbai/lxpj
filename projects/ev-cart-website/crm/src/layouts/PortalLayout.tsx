import React, { useState, useEffect } from 'react'
import { Layout, Menu, theme, Avatar, Dropdown, Space, Badge, Drawer, Button, Typography } from 'antd'
import type { MenuProps } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ShopOutlined,
  DollarOutlined,
  BarChartOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  BugOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { portalMenuConfig, portalApplications, userMenuConfig } from '../config/menuConfig'

const { Header, Sider, Content } = Layout
const { Text, Paragraph } = Typography

const PortalLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()

  // 获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAuthenticated = !!localStorage.getItem('access_token')

  // 响应式侧边栏处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/portal')) {
      navigate(key)
      if (window.innerWidth < 768) {
        setMobileMenuOpen(false)
      }
    }
  }

  // 用户菜单点击
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      navigate('/login')
    } else if (key === 'profile') {
      navigate('/portal')
    }
  }

  // 将 MenuItem[] 转换为 antd MenuProps['items']
  const convertToMenuItems = (items?: any[]): MenuProps['items'] => {
    if (!items) return []
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? convertToMenuItems(item.children) : undefined,
    }))
  }

  // 应用卡片点击
  const handleAppClick = (path: string) => {
    navigate(path)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 移动端菜单抽屉 */}
      <Drawer
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
        style={{
          padding: '16px',
        }}
        bodyStyle={{
          padding: '16px 0',
        }}
        headerStyle={{
          display: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            padding: '0 16px',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            EV
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#333',
            }}
          >
            应用门户
          </span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={convertToMenuItems(portalMenuConfig)}
          onClick={handleMenuClick}
          style={{
            border: 'none',
          }}
        />
      </Drawer>

      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        breakpoint="lg"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: '16px',
            borderRadius: 8,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/portal')}
        >
          {collapsed ? (
            <span style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>⚡</span>
          ) : (
            <span
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                letterSpacing: '2px',
              }}
            >
              E V C A R T
            </span>
          )}
        </div>

        {/* 系统导航 */}
        <div style={{ padding: '16px 0' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={convertToMenuItems(portalMenuConfig)}
            onClick={handleMenuClick}
            style={{
              border: 'none',
            }}
          />
        </div>

        {/* 快捷入口 */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 0',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              padding: '0 16px 16px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            快捷入口
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: '/portal',
                icon: <DashboardOutlined />,
                label: '首页仪表盘',
              },
              {
                key: '/portal/approval/my',
                icon: <AppstoreOutlined />,
                label: '我的待办',
              },
              {
                key: '/portal/messages',
                icon: <MailOutlined />,
                label: '消息中心',
              },
            ]}
            onClick={handleMenuClick}
            style={{
              border: 'none',
            }}
          />
        </div>
      </Sider>

      {/* 主布局 */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'all 0.2s',
          minHeight: '100vh',
        }}
      >
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            height: 64,
          }}
        >
          <Space size={16}>
            {/* 移动端菜单按钮 */}
            <Button
              type="text"
              icon={
                collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18, color: '#666' }} /> : <MenuFoldOutlined style={{ fontSize: 18, color: '#666' }} />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: window.innerWidth >= 768 ? 'none' : 'flex',
              }}
            />
            {/* 移动端抽屉按钮 */}
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 18, color: '#666' }} />}
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: window.innerWidth >= 768 ? 'none' : 'flex',
              }}
            />

            {/* 搜索框 */}
            <input
              type="text"
              placeholder="搜索应用、功能..."
              style={{
                width: 240,
                display: window.innerWidth >= 768 ? 'block' : 'none',
                padding: '8px 12px',
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
          </Space>

          <Space size={24}>
            {/* 消息通知 */}
            <Badge count={8} size="small" overflowCount={99}>
              <BellOutlined
                style={{
                  fontSize: 18,
                  cursor: 'pointer',
                  color: '#666',
                  transition: 'all 0.3s',
                }}
                onClick={() => navigate('/portal/messages')}
              />
            </Badge>

            {/* 用户信息 */}
            <Dropdown
              menu={{ items: convertToMenuItems(userMenuConfig), onClick: handleUserMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space
                style={{
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 8,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: '#667eea',
                  }}
                  icon={<UserOutlined />}
                />
                {!collapsed && (
                  <Text ellipsis={{ tooltip: user.realName || user.username || '用户' }}>
                    {user.realName || user.username || '用户'}
                  </Text>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>

        {/* 页脚 */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px',
            color: '#999',
            fontSize: 14,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <p style={{ margin: '8px 0' }}>
            © 2026 道达智能集团 | 企业应用门户 v1.0
          </p>
          <p
            style={{
              fontSize: 12,
              marginTop: 8,
              color: '#ccc',
            }}
          >
            技术支持：IT 部门 | 联系电话：400-888-8888
          </p>
        </div>
      </Layout>
    </Layout>
  )
}

export default PortalLayout
