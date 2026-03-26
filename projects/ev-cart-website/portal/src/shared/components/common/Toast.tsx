/**
 * Toast 提示组件 - 带撤销操作
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  onClose: () => void
}

const iconMap = {
  success: <CheckCircleOutlined />,
  error: <CloseCircleOutlined />,
  info: <InfoCircleOutlined />,
  warning: <WarningOutlined />
}

const colorMap = {
  success: '#52C41A',
  error: '#FF4D4F',
  info: '#1890FF',
  warning: '#FAAD14'
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  action,
  onClose
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      background: '#FFFFFF',
      borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      minWidth: 300,
      maxWidth: 500
    }}>
      <span style={{
        fontSize: 18,
        color: colorMap[type],
        marginRight: 12
      }}>
        {iconMap[type]}
      </span>
      <span style={{
        flex: 1,
        fontSize: 14,
        color: '#333'
      }}>
        {message}
      </span>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginLeft: 16,
            padding: '4px 12px',
            background: 'transparent',
            border: `1px solid ${colorMap[type]}`,
            borderRadius: 4,
            color: colorMap[type],
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          {action.label}
        </button>
      )}
      <button
        onClick={() => {
          setVisible(false)
          onClose()
        }}
        style={{
          marginLeft: 16,
          padding: 0,
          background: 'transparent',
          border: 'none',
          color: '#999',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        ×
      </button>
    </div>
  )
}

// Toast 快捷方法
export function showToast(config: {
  message: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}) {
  // 实现 Toast 管理器
  console.log('Toast:', config)
}
