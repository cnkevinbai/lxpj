import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, theme } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  InboxOutlined,
  OpportunityOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SolutionOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/customers', icon: <TeamOutlined />, label: '客户管理' },
  { key: '/leads', icon: <InboxOutlined />, label: '线索管理' },
  { key: '/opportunities', icon: <OpportunityOutlined />, label: '商机管理' },
  { key: '/orders', icon: <ShoppingCartOutlined />, label: '订单管理' },
  { key: '/products', icon: <ShopOutlined />, label: '产品管理' },
  { key: '/dealers', icon: <SolutionOutlined />, label: '经销商' },
  { key: '/jobs', icon: <SolutionOutlined />, label: '招聘管理' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
]

const CRMLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token: { colorBgContainer } } = theme.useToken()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="h-16 flex items-center justify-center">
          <h1 className={`font-bold text-xl ${collapsed ? 'hidden' : 'block'}`}>
            EV Cart CRM
          </h1>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="px-4" style={{ background: colorBgContainer }}>
          <div className="flex justify-between items-center h-full">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              size="large"
            />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span className="hidden md:inline">{user.username || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-4 p-6" style={{ background: colorBgContainer }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default CRMLayout
