import React from 'react'
import { Switch } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useDarkMode } from '../../hooks/useDarkMode'

/**
 * 主题切换开关
 */
const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="flex items-center gap-2">
      <SunOutlined className={`text-lg ${!isDark ? 'text-yellow-500' : 'text-gray-400'}`} />
      <Switch
        checked={isDark}
        onChange={toggle}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        size="small"
      />
      <MoonOutlined className={`text-lg ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
    </div>
  )
}

export default ThemeToggle
