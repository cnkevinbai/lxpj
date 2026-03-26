import React, { useState } from 'react'
import { Card, Menu } from 'antd'
import {
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  DatabaseOutlined,
  ApiOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const Settings: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState(location.pathname.replace('/settings/', '') || 'company')

  const menuItems = [
    {
      key: 'company',
      icon: <SettingOutlined />,
      label: '公司设置',
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'role',
      icon: <TeamOutlined />,
      label: '角色权限',
    },
    {
      key: 'security',
      icon: <SafetyCertificateOutlined />,
      label: '安全设置',
    },
    {
      key: 'notification',
      icon: <BellOutlined />,
      label: '通知设置',
    },
    {
      key: 'data',
      icon: <DatabaseOutlined />,
      label: '数据管理',
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: 'API 配置',
    },
    {
      key: 'system',
      icon: <GlobalOutlined />,
      label: '系统配置',
    },
  ]

  const handleClick = (e: any) => {
    setSelectedKey(e.key)
    navigate(`/settings/${e.key}`)
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Card style={{ width: 256, flex: 'none' }}>
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleClick}
        />
      </Card>
      
      <Card style={{ flex: 1 }}>
        <Outlet />
      </Card>
    </div>
  )
}

export default Settings
