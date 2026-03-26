/**
 * 键盘导航组件 - 支持键盘操作
 * 渔晓白 ⚙️ · 专业交付
 */

import { useEffect, useRef } from 'react'

interface KeyboardNavigationProps {
  enabled?: boolean
  onEnter?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  shortcuts?: Shortcut[]
}

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
}

export default function KeyboardNavigation({
  enabled = true,
  onEnter,
  onEscape,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  shortcuts = []
}: KeyboardNavigationProps) {
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (!enabledRef.current) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否在输入框中
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      // 处理快捷键
      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!e.ctrlKey === !!shortcut.ctrl &&
          !!e.shiftKey === !!shortcut.shift &&
          !!e.altKey === !!shortcut.alt
        ) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }

      // 处理方向键
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          onEnter?.()
          break
        case 'Escape':
          e.preventDefault()
          onEscape?.()
          break
        case 'ArrowUp':
          e.preventDefault()
          onArrowUp?.()
          break
        case 'ArrowDown':
          e.preventDefault()
          onArrowDown?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          onArrowLeft?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          onArrowRight?.()
          break
        case 'Tab':
          onTab?.()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, shortcuts])

  return null
}

// 使用示例
/*
<KeyboardNavigation
  enabled={true}
  onEnter={() => handleSubmit()}
  onEscape={() => handleClose()}
  shortcuts={[
    { key: 'n', action: () => handleNew() },
    { key: 's', ctrl: true, action: () => handleSave() },
    { key: 'f', ctrl: true, action: () => handleSearch() },
    { key: 'd', alt: true, action: () => handleDelete() }
  ]}
/>
*/
