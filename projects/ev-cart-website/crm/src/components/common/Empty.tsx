import React from 'react'
import { Empty as AntEmpty, Button } from 'antd'

interface EmptyProps {
  description?: string
  image?: React.ReactNode
  onAction?: () => void
  actionText?: string
}

/**
 * 空状态组件
 */
const Empty: React.FC<EmptyProps> = ({
  description = '暂无数据',
  image,
  onAction,
  actionText,
}) => {
  return (
    <div className="py-12">
      <AntEmpty
        image={image}
        description={description}
      >
        {onAction && actionText && (
          <Button type="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </AntEmpty>
    </div>
  )
}

export default Empty
