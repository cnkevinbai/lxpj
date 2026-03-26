/**
 * 批量操作组件
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState } from 'react'
import { Checkbox, Button, Space, Modal, message } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

interface BatchActionsProps {
  selectedIds: string[]
  onClear: () => void
  actions: BatchAction[]
}

interface BatchAction {
  key: string
  label: string
  icon?: React.ReactNode
  confirm?: boolean
  confirmText?: string
  onClick: (ids: string[]) => Promise<void>
}

export default function BatchActions({
  selectedIds,
  onClear,
  actions
}: BatchActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: BatchAction) => {
    if (action.confirm) {
      Modal.confirm({
        title: '确认操作',
        content: action.confirmText || `确定要对选中的 ${selectedIds.length} 项执行此操作吗？`,
        onOk: async () => {
          await executeAction(action)
        }
      })
    } else {
      await executeAction(action)
    }
  }

  const executeAction = async (action: BatchAction) => {
    setLoading(action.key)
    try {
      await action.onClick(selectedIds)
      message.success('操作成功')
      onClear()
    } catch (error) {
      message.error('操作失败')
    } finally {
      setLoading(null)
    }
  }

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      background: '#FFFFFF',
      borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
    }}>
      <Checkbox
        checked={true}
        onChange={onClear}
        style={{ marginRight: 16 }}
      >
        <CheckOutlined /> 已选 {selectedIds.length} 项
      </Checkbox>

      <Space size={16}>
        {actions.map((action) => (
          <Button
            key={action.key}
            type="primary"
            icon={action.icon}
            loading={loading === action.key}
            onClick={() => handleAction(action)}
          >
            {action.label}
          </Button>
        ))}

        <Button
          icon={<CloseOutlined />}
          onClick={onClear}
        >
          取消选择
        </Button>
      </Space>
    </div>
  )
}
