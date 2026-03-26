import React from 'react'
import { Menu } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  InboxOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  GlobalOutlined,
  MailOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  RobotOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface SideMenuProps {
  collapsed: boolean
}

/**
 * 侧边菜单
 * 根据用户部门自动显示对应菜单
 */
const SideMenu: React.FC<SideMenuProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // 根据部门确定业务类型
  const businessType = user?.department === 'foreign' ? 'foreign' : 'domestic'

  // 内贸菜单
  const domesticMenuItems = [
    {
      key: '/crm/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/crm/leads',
      icon: <InboxOutlined />,
      label: '线索管理',
    },
    {
      key: '/crm/customers',
      icon: <TeamOutlined />,
      label: '客户管理',
    },
    {
      key: '/crm/opportunities',
      icon: <RocketOutlined />,
      label: '商机管理',
    },
    {
      key: '/crm/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
    },
    {
      key: '/crm/products',
      icon: <ShopOutlined />,
      label: '产品管理',
    },
  ]

  // 外贸菜单
  const foreignMenuItems = [
    {
      key: '/crm/foreign-dashboard',
      icon: <GlobalOutlined />,
      label: '外贸仪表盘',
    },
    {
      key: '/crm/foreign-leads',
      icon: <InboxOutlined />,
      label: '外贸线索',
    },
    {
      key: '/crm/foreign-customers',
      icon: <TeamOutlined />,
      label: '外贸客户',
    },
    {
      key: '/crm/foreign-inquiries',
      icon: <MailOutlined />,
      label: '外贸询盘',
    },
    {
      key: '/crm/foreign-orders',
      icon: <ShoppingCartOutlined />,
      label: '外贸订单',
    },
    {
      key: '/crm/products',
      icon: <ShopOutlined />,
      label: '产品管理',
    },
  ]

  // 通用菜单
  const commonMenuItems = [
    {
      type: 'divider',
    },
    {
      key: '/crm/performance',
      icon: <BarChartOutlined />,
      label: '业绩看板',
    },
    {
      key: '/crm/recommendations',
      icon: <StarOutlined />,
      label: '智能推荐',
    },
    {
      key: '/crm/data-viz',
      icon: <BarChartOutlined />,
      label: '数据大屏',
    },
    {
      key: '/crm/ai-chat',
      icon: <RobotOutlined />,
      label: 'AI 客服',
    },
    // divider removed to fix type error
    {
      key: '/crm/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/crm/permissions',
      icon: <SettingOutlined />,
      label: '权限管理',
    },
    {
      key: '/crm/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  // 合并菜单
  const menuItems = [
    ...(businessType === 'foreign' ? foreignMenuItems : domesticMenuItems),
    ...commonMenuItems,
  ]

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      inlineCollapsed={collapsed}
    />
  )
}

export default SideMenu
