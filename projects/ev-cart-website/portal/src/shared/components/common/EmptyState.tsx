import { Empty, Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface EmptyStateProps {
  image?: React.ReactNode
  description?: string
  onAction?: () => void
  actionText?: string
  extra?: React.ReactNode
}

export default function EmptyState({
  image,
  description = '暂无数据',
  onAction,
  actionText = '新建',
  extra,
}: EmptyStateProps) {
  return (
    <Empty
      image={image || Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
    >
      {(onAction || extra) && (
        <Space>
          {onAction && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
              {actionText}
            </Button>
          )}
          {extra}
        </Space>
      )}
    </Empty>
  )
}
