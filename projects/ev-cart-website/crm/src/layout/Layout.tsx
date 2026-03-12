import React, { useState } from 'react'
import { Layout, Menu, theme, Avatar, Dropdown, Space, Badge, Drawer } from 'antd'
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
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()

  // 获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // 菜单配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/customers',
      icon: <TeamOutlined />,
      label: '客户管理',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
    },
    {
      key: '/products',
      icon: <AppstoreOutlined />,
      label: '产品管理',
    },
    {
      key: '/dealers',
      icon: <ShopOutlined />,
      label: '经销商',
      children: [
        { key: '/dealers', label: '经销商列表' },
        { key: '/dealers/analytics', label: '数据分析' },
      ],
    },
    {
      key: '/jobs',
      icon: <TeamOutlined />,
      label: '招聘管理',
      children: [
        { key: '/jobs', label: '职位管理' },
        { key: '/resumes', label: '简历管理' },
        { key: '/interviews', label: '面试安排' },
      ],
    },
    {
      key: '/inventory',
      icon: <AppstoreOutlined />,
      label: '库存管理',
    },
    {
      key: '/finance',
      icon: <DollarOutlined />,
      label: '财务管理',
    },
    {
      key: '/erp',
      icon: <BarChartOutlined />,
      label: 'ERP 系统',
      children: [
        { key: '/erp', label: '采购/生产/外贸' },
      ],
    },
    {
      key: '/after-sales',
      icon: <ShopOutlined />,
      label: '售后服务',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '报表中心',
    },
    {
      key: '/messages',
      icon: <MailOutlined />,
      label: '消息中心',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        navigate('/login')
      },
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: '16px',
          borderRadius: 8,
        }}>
          {collapsed ? (
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>EV</span>
          ) : (
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>EV Cart CRM</span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      {/* 主布局 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Space>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer' },
            })}
          </Space>

          <Space size="large">
            {/* 消息通知 */}
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>

            {/* 用户信息 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                {!collapsed && <span>{user.realName || user.username || '用户'}</span>}
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
        <div style={{
          textAlign: 'center',
          padding: '24px',
          color: '#999',
          fontSize: 14,
        }}>
          EV Cart CRM 企业客户关系管理系统 ©2026 Created by 渔晓白
        </div>
      </Layout>
    </Layout>
  )
}

export default MainLayout
