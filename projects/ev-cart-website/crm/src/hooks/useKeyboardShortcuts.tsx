import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

/**
 * 键盘快捷键 Hook
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'd',
      ctrl: true,
      action: () => navigate('/crm/dashboard'),
      description: '跳转到仪表盘',
    },
    {
      key: 'l',
      ctrl: true,
      action: () => navigate('/crm/leads'),
      description: '跳转到线索管理',
    },
    {
      key: 'c',
      ctrl: true,
      action: () => navigate('/crm/customers'),
      description: '跳转到客户管理',
    },
    {
      key: 'o',
      ctrl: true,
      action: () => navigate('/crm/orders'),
      description: '跳转到订单管理',
    },
    {
      key: 'p',
      ctrl: true,
      action: () => navigate('/crm/performance'),
      description: '跳转到业绩看板',
    },
    {
      key: 'n',
      ctrl: true,
      shift: true,
      action: () => navigate('/crm/leads/create'),
      description: '新建线索',
    },
    {
      key: 'm',
      ctrl: true,
      shift: true,
      action: () => navigate('/crm/customers/create'),
      description: '新建客户',
    },
    {
      key: '/',
      ctrl: true,
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      },
      description: '聚焦搜索框',
    },
    {
      key: '?',
      shift: true,
      action: () => {
        // 显示快捷键帮助
        const event = new CustomEvent('show-shortcuts-help')
        window.dispatchEvent(event)
      },
      description: '显示快捷键帮助',
    },
    {
      key: 'Escape',
      action: () => {
        // 关闭弹窗
        const event = new CustomEvent('close-modal')
        window.dispatchEvent(event)
      },
      description: '关闭弹窗',
    },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => {
        if (s.key.toLowerCase() !== event.key.toLowerCase()) return false
        if (s.ctrl && !event.ctrlKey) return false
        if (s.shift && !event.shiftKey) return false
        if (s.alt && !event.altKey) return false
        return true
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return shortcuts
}
