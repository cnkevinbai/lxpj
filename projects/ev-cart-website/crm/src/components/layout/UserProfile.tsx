import React from 'react'
import { Dropdown, Avatar, Menu } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from 'antd/icons'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useNavigate } from 'react-router-dom'

/**
 * 用户头像下拉菜单
 */
const UserProfile: React.FC = () => {
  const { user, logout } = useAuth()
  const { isDark, toggle: toggleTheme } = useDarkMode()
  const navigate = useNavigate()

  const menu = (
    <Menu className="w-48">
      {/* 用户信息 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} src={user?.avatarUrl} />
          <div>
            <div className="font-medium text-gray-900">{user?.username}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* 菜单项 */}
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate('/crm/profile')}
      >
        个人中心
      </Menu.Item>

      <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
        onClick={() => navigate('/crm/settings')}
      >
        系统设置
      </Menu.Item>

      <Menu.Item
        key="theme"
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
      >
        {isDark ? '切换到亮色模式' : '切换到暗色模式'}
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        danger
        onClick={logout}
      >
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <Avatar size={32} icon={<UserOutlined />} src={user?.avatarUrl} />
        <span className="text-sm font-medium text-gray-700 hidden md:inline">
          {user?.username}
        </span>
      </div>
    </Dropdown>
  )
}

export default UserProfile
