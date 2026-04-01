/**
 * 空状态组件
 * 统一的空数据展示
 */
import { Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface EmptyStateProps {
  description?: string
  showAction?: boolean
  actionText?: string
  onAction?: () => void
  image?: 'empty' | 'search' | 'error'
}

export default function EmptyState({
  description = '暂无数据',
  showAction = false,
  actionText = '新增',
  onAction,
  image = 'empty',
}: EmptyStateProps) {
  const imageMap = {
    empty: Empty.PRESENTED_IMAGE_SIMPLE,
    search: Empty.PRESENTED_IMAGE_SIMPLE,
    error: Empty.PRESENTED_IMAGE_SIMPLE,
  }

  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <Empty
        image={imageMap[image]}
        description={<span style={{ color: '#64748b' }}>{description}</span>}
      >
        {showAction && onAction && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  )
}