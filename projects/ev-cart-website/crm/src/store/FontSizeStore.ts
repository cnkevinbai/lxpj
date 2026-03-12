/**
 * 字体大小状态管理
 * 渔晓白 ⚙️ · 专业交付
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontSize = 'small' | 'medium' | 'large'

interface FontSizeState {
  size: FontSize
  setSize: (size: FontSize) => void
  getFontSize: () => number
}

const fontSizeMap = {
  small: 12,
  medium: 14,
  large: 16
}

export const useFontSizeStore = create<FontSizeState>()(
  persist(
    (set, get) => ({
      size: 'medium',

      setSize: (size: FontSize) => {
        set({ size })
        applyFontSize(size)
      },

      getFontSize: () => {
        return fontSizeMap[get().size]
      }
    }),
    {
      name: 'font-size-storage'
    }
  )
)

function applyFontSize(size: FontSize) {
  const root = document.documentElement
  const baseSize = fontSizeMap[size]

  root.style.setProperty('--font-size-base', `${baseSize}px`)
  root.style.setProperty('--font-size-sm', `${baseSize - 2}px`)
  root.style.setProperty('--font-size-lg', `${baseSize + 2}px`)
}

// 初始化应用
const { size } = useFontSizeStore.getState()
applyFontSize(size)

export default useFontSizeStore
