import React from 'react'
import { Card, Radio, theme } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useDarkMode } from '../../hooks/useDarkMode'

interface ThemeConfig {
  id: string
  name: string
  primaryColor: string
  isDark: boolean
}

const themes: ThemeConfig[] = [
  {
    id: 'default',
    name: '经典蓝',
    primaryColor: '#0070FF',
    isDark: false,
  },
  {
    id: 'dark',
    name: '深邃黑',
    primaryColor: '#1890FF',
    isDark: true,
  },
  {
    id: 'green',
    name: '清新绿',
    primaryColor: '#52C41A',
    isDark: false,
  },
  {
    id: 'purple',
    name: '优雅紫',
    primaryColor: '#722ED1',
    isDark: false,
  },
]

/**
 * 主题选择器组件
 */
const ThemeSelector: React.FC = () => {
  const { isDark, setDark } = useDarkMode()
  const [selectedTheme, setSelectedTheme] = React.useState('default')

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      setDark(theme.isDark)
      // TODO: 应用主题色到全局
      document.documentElement.style.setProperty('--brand-blue', theme.primaryColor)
    }
  }

  return (
    <Card title="主题设置" className="mb-4">
      <Radio.Group
        value={selectedTheme}
        onChange={(e) => handleThemeChange(e.target.value)}
        className="grid grid-cols-2 gap-4"
      >
        {themes.map((theme) => (
          <Radio.Button
            key={theme.id}
            value={theme.id}
            className="relative p-4 h-auto flex flex-col items-center"
          >
            <div
              className="w-12 h-12 rounded-lg mb-2"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div className="text-sm">{theme.name}</div>
            {selectedTheme === theme.id && (
              <CheckOutlined className="absolute top-2 right-2 text-green-500" />
            )}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Card>
  )
}

export default ThemeSelector
