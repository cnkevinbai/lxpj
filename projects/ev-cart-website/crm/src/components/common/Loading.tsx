import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingProps {
  fullScreen?: boolean
  size?: 'small' | 'default' | 'large'
  text?: string
}

/**
 * 加载组件
 */
const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  size = 'large',
  text = '加载中...',
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        <div className="text-center">
          <Spin indicator={antIcon} size={size} />
          {text && <div className="mt-4 text-gray-600">{text}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Spin indicator={antIcon} size={size} />
        {text && <div className="mt-2 text-gray-600 text-sm">{text}</div>}
      </div>
    </div>
  )
}

export default Loading
