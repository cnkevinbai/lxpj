import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface FullScreenLoadingProps {
  tip?: string
}

export default function FullScreenLoading({ tip = '加载中...' }: FullScreenLoadingProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} tip={tip} />
    </div>
  )
}
