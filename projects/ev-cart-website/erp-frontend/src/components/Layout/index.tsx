import { useState } from 'react'
import { Layout as AntLayout, Menu, theme } from 'antd'
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  BuildOutlined,
  InsuranceOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = AntLayout

const menuItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/sub1',
    icon: <ShoppingCartOutlined />,
    label: '采购管理',
    children: [
      { key: '/purchase', label: '采购列表' },
      { key: '/purchase/create', label: '新建采购' },
    ],
  },
  {
    key: '/sub2',
    icon: <AppstoreOutlined />,
    label: '库存管理',
    children: [
      { key: '/inventory', label: '库存列表' },
      { key: '/inventory/in', label: '入库管理' },
      { key: '/inventory/out', label: '出库管理' },
    ],
  },
  {
    key: '/sub3',
    icon: <BuildOutlined />,
    label: '生产管理',
    children: [
      { key: '/production/plan', label: '生产计划' },
      { key: '/production/task', label: '生产任务' },
    ],
  },
  {
    key: '/sub4',
    icon: <InsuranceOutlined />,
    label: '财务管理',
    children: [
      { key: '/finance', label: '财务总览' },
      { key: '/finance/receive', label: '收款管理' },
      { key: '/finance/pay', label: '付款管理' },
    ],
  },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (!e.key.startsWith('/sub')) {
      navigate(e.key)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('erp_token')
    navigate('/login')
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 18 : 20,
          fontWeight: 'bold',
        }}>
          {collapsed ? 'ERP' : '道达智能 ERP'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {collapsed ? <MenuUnfoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} style={{ fontSize: 18, cursor: 'pointer' }} /> : <MenuFoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} style={{ fontSize: 18, cursor: 'pointer' }} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserOutlined />
              管理员
            </span>
            <LogoutOutlined 
              onClick={handleLogout} 
              style={{ cursor: 'pointer', fontSize: 18 }}
            />
          </div>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}>
          <RoutesWrapper />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

// 简单的路由内容渲染组件
function RoutesWrapper() {
  // 实际路由由 App.tsx 的 Routes 处理，这里只是占位
  return null
}
