/**
 * 主布局
 * 
 * @description 包含所有模块功能的完整菜单
 */
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Badge, Button, theme } from 'antd'
import {
  DashboardOutlined,
  LaptopOutlined,
  CarOutlined,
  EnvironmentOutlined,
  AlertOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ApiOutlined,
  CloudUploadOutlined,
  CodeOutlined,
  LineChartOutlined,
  BorderOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  TeamOutlined,
  KeyOutlined,
  HeartOutlined,
  LinkOutlined,
  ClusterOutlined,
  ControlOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import './MainLayout.css'

const { Header, Sider, Content } = Layout

// 完整菜单配置 - 覆盖所有模块功能
const menuItems: MenuProps['items'] = [
  // 监控中心
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '监控大屏',
  },
  
  // 设备管理组
  {
    key: 'device-group',
    label: '设备管理',
    type: 'group',
    children: [
      {
        key: '/terminals',
        icon: <LaptopOutlined />,
        label: '终端管理',
      },
      {
        key: '/vehicles',
        icon: <CarOutlined />,
        label: '车辆管理',
      },
      {
        key: '/access',
        icon: <LinkOutlined />,
        label: '设备接入',
      },
    ],
  },
  
  // 监控服务组
  {
    key: 'monitor-group',
    label: '监控服务',
    type: 'group',
    children: [
      {
        key: '/map',
        icon: <EnvironmentOutlined />,
        label: '实时地图',
      },
      {
        key: '/trajectory',
        icon: <LineChartOutlined />,
        label: '轨迹回放',
      },
      {
        key: '/geofence',
        icon: <BorderOutlined />,
        label: '电子围栏',
      },
    ],
  },
  
  // 告警服务组
  {
    key: 'alarm-group',
    label: '告警服务',
    type: 'group',
    children: [
      {
        key: '/alarms',
        icon: <AlertOutlined />,
        label: '告警列表',
      },
      {
        key: '/alarm-rules',
        icon: <ControlOutlined />,
        label: '告警规则',
      },
    ],
  },
  
  // 远程控制组
  {
    key: 'control-group',
    label: '远程控制',
    type: 'group',
    children: [
      {
        key: '/commands',
        icon: <CodeOutlined />,
        label: '指令管理',
      },
      {
        key: '/remote',
        icon: <ControlOutlined />,
        label: '远程控制',
      },
    ],
  },
  
  // OTA升级组
  {
    key: 'ota-group',
    label: 'OTA升级',
    type: 'group',
    children: [
      {
        key: '/firmware',
        icon: <CloudUploadOutlined />,
        label: '固件管理',
      },
      {
        key: '/ota-tasks',
        icon: <ScheduleOutlined />,
        label: '升级任务',
      },
    ],
  },
  
  // 规划服务组
  {
    key: 'planning-group',
    label: '智能规划',
    type: 'group',
    children: [
      {
        key: '/route-planning',
        icon: <LineChartOutlined />,
        label: '路径规划',
      },
      {
        key: '/trip-planning',
        icon: <ScheduleOutlined />,
        label: '行程规划',
      },
    ],
  },
  
  // 系统管理组
  {
    key: 'system-group',
    label: '系统管理',
    type: 'group',
    children: [
      {
        key: '/modules',
        icon: <AppstoreOutlined />,
        label: '模块管理',
      },
      {
        key: '/reports',
        icon: <LineChartOutlined />,
        label: '报表统计',
      },
      {
        key: '/tenants',
        icon: <TeamOutlined />,
        label: '租户管理',
      },
      {
        key: '/roles',
        icon: <KeyOutlined />,
        label: '角色权限',
      },
      {
        key: '/accounts',
        icon: <UserOutlined />,
        label: '子账号管理',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '系统设置',
      },
    ],
  },
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()
  
  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]
  
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }
  
  const handleUserMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }
  
  return (
    <Layout className="main-layout">
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="sider"
        width={220}
      >
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">🚗</div>
          {!collapsed && <span className="logo-text">道达车联网平台</span>}
        </div>
        
        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        {/* 顶部栏 */}
        <Header className="header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger"
            />
          </div>
          
          <div className="header-right">
            {/* 通知 */}
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} className="header-btn" />
            </Badge>
            
            {/* 用户 */}
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
                <span className="user-name">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        {/* 内容区 */}
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}