/**
 * 主题切换器组件
 * 渔晓白 ⚙️ · 专业交付
 */

import { Dropdown, Menu } from 'antd'
import { SunOutlined, MoonOutlined, LaptopOutlined, CheckOutlined } from '@ant-design/icons'
import { useThemeStore, ThemeMode } from '../store'

export default function ThemeSwitcher() {
  const { mode, setMode } = useThemeStore()

  const menu = (
    <Menu
      selectedKeys={[mode]}
      onClick={({ key }) => setMode(key as ThemeMode)}
    >
      <Menu.Item key="light">
        <SunOutlined /> 亮色模式
        {mode === 'light' && <CheckOutlined style={{ marginLeft: 8 }} />}
      </Menu.Item>
      <Menu.Item key="dark">
        <MoonOutlined /> 暗色模式
        {mode === 'dark' && <CheckOutlined style={{ marginLeft: 8 }} />}
      </Menu.Item>
      <Menu.Item key="auto">
        <LaptopOutlined /> 跟随系统
        {mode === 'auto' && <CheckOutlined style={{ marginLeft: 8 }} />}
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}>
        {mode === 'dark' ? (
          <MoonOutlined style={{ fontSize: 18 }} />
        ) : mode === 'light' ? (
          <SunOutlined style={{ fontSize: 18 }} />
        ) : (
          <LaptopOutlined style={{ fontSize: 18 }} />
        )}
      </div>
    </Dropdown>
  )
}
