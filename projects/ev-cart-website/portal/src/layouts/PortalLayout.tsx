import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Badge, Button } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ToolOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const PortalLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      key: '/portal',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: '/portal/crm',
      icon: <TeamOutlined />,
      label: 'CRM',
      children: [
        { key: '/portal/crm/customers', label: '客户管理' },
        { key: '/portal/crm/opportunities', label: '商机管理' },
        { key: '/portal/crm/orders', label: '订单管理' },
      ],
    },
    {
      key: '/portal/erp',
      icon: <AppstoreOutlined />,
      label: 'ERP',
      children: [
        { key: '/portal/erp/production', label: '生产管理' },
        { key: '/portal/erp/purchase', label: '采购管理' },
        { key: '/portal/erp/inventory', label: '库存管理' },
      ],
    },
    {
      key: '/portal/finance',
      icon: <DollarOutlined />,
      label: '财务',
      children: [
        { key: '/portal/finance/receivables', label: '应收管理' },
        { key: '/portal/finance/payables', label: '应付管理' },
        { key: '/portal/finance/expenses', label: '费用报销' },
      ],
    },
    {
      key: '/portal/aftersales',
      icon: <ToolOutlined />,
      label: '售后',
    },
    {
      key: '/portal/hr',
      icon: <UserOutlined />,
      label: '人力',
    },
    {
      key: '/portal/message',
      icon: <MessageOutlined />,
      label: '消息',
    },
    {
      key: '/portal/workflow',
      icon: <DashboardOutlined />,
      label: '审批',
    },
    {
      key: '/portal/admin',
      icon: <SettingOutlined />,
      label: '系统管理',
    },
  ]

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '个人设置',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: () => {
          localStorage.removeItem('token')
          navigate('/login')
        },
      },
    ],
  }

  return (
    <Layout className="portal-layout">
      <Header className="portal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
            道达智能 - 业务管理系统
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          </Badge>
          
          <Dropdown menu={userMenu} placement="bottomRight" arrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>管理员</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Sider
        className={`portal-sider ${collapsed ? 'collapsed' : ''}`}
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={200}
        theme="light"
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Content className="portal-content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default PortalLayout
