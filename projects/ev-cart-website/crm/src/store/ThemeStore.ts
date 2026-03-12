/**
 * 主题状态管理 - 支持暗黑模式
 * 渔晓白 ⚙️ · 专业交付
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      isDark: false,

      setMode: (mode: ThemeMode) => {
        set({ mode })
        get().applyTheme()
      },

      toggleTheme: () => {
        const currentMode = get().mode
        const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light'
        set({ mode: newMode })
        get().applyTheme()
      },

      applyTheme: () => {
        const { mode } = get()
        let isDark = false

        if (mode === 'auto') {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        } else {
          isDark = mode === 'dark'
        }

        set({ isDark })

        // 应用主题类名
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }

        // 更新 CSS 变量
        updateThemeVariables(isDark)
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)

// 更新 CSS 变量
function updateThemeVariables(isDark: boolean) {
  const root = document.documentElement

  if (isDark) {
    // 暗黑主题
    root.style.setProperty('--bg-page', '#1A1A1A')
    root.style.setProperty('--bg-card', '#2D2D2D')
    root.style.setProperty('--text-primary', '#FFFFFF')
    root.style.setProperty('--text-secondary', '#CCCCCC')
    root.style.setProperty('--border-color', '#404040')
  } else {
    // 亮色主题
    root.style.setProperty('--bg-page', '#F5F5F5')
    root.style.setProperty('--bg-card', '#FFFFFF')
    root.style.setProperty('--text-primary', '#1D1D1F')
    root.style.setProperty('--text-secondary', '#666666')
    root.style.setProperty('--border-color', '#E5E5E5')
  }
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const { mode, applyTheme } = useThemeStore.getState()
  if (mode === 'auto') {
    applyTheme()
  }
})

export default useThemeStore
