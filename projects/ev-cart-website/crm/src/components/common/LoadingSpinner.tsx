import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingSpinnerProps {
  tip?: string
  size?: 'small' | 'default' | 'large'
  fullScreen?: boolean
}

export default function LoadingSpinner({
  tip = '加载中...',
  size = 'default',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 14 : 24 }} spin />}
      tip={tip}
      size={size}
    />
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}>
        {spinner}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    }}>
      {spinner}
    </div>
  )
}
