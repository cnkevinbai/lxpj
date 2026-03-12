import React, { useState, useEffect } from 'react'
import { Menu, Avatar, Dropdown, Space, Badge, message } from 'antd'
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  FileTextOutlined, 
  CustomerServiceOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  TeamOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'

const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 获取用户信息
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    message.success('已退出登录')
    window.location.href = '/login'
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人信息
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        系统设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          height: 64,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
      >
        {/* Logo + 系统切换 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 700, color: '#000', textDecoration: 'none' }}>
            四川道达智能
          </a>
          <Menu mode="horizontal" selectedKeys={['portal']} style={{ border: 'none' }}>
            <Menu.Item key="portal" icon={<HomeOutlined />}>
              <a href="/portal">客户门户</a>
            </Menu.Item>
            <Menu.Item key="crm" icon={<TeamOutlined />}>
              <a href="/portal/crm">CRM</a>
            </Menu.Item>
            <Menu.Item key="erp" icon={<BarChartOutlined />}>
              <a href="/portal/erp">ERP</a>
            </Menu.Item>
            <Menu.Item key="service" icon={<CustomerServiceOutlined />}>
              <a href="/portal/service">售后</a>
            </Menu.Item>
          </Menu>
        </div>

        {/* 右侧用户信息 */}
        <Space size="large">
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: 20, color: '#666', cursor: 'pointer' }} />
          </Badge>
          
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <span style={{ fontSize: 14 }}>{user?.realName || user?.username}</span>
            </Space>
          </Dropdown>
        </Space>
      </motion.div>

      {/* 内容区域 */}
      <div style={{ 
        marginTop: 64, 
        minHeight: 'calc(100vh - 64px)',
        padding: 32
      }}>
        {children}
      </div>
    </div>
  )
}

export default PortalLayout
