import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ConfirmDialogProps {
  visible: boolean
  title?: string
  content: string
  type?: 'info' | 'success' | 'warning' | 'error'
  okText?: string
  cancelText?: string
  onOk: () => void
  onCancel: () => void
  loading?: boolean
}

/**
 * 确认对话框组件
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title = '确认操作',
  content,
  type = 'warning',
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  loading = false,
}) => {
  const iconMap = {
    info: <ExclamationCircleOutlined className="text-blue-500 text-2xl" />,
    success: <ExclamationCircleOutlined className="text-green-500 text-2xl" />,
    warning: <ExclamationCircleOutlined className="text-yellow-500 text-2xl" />,
    error: <ExclamationCircleOutlined className="text-red-500 text-2xl" />,
  }

  return (
    <Modal
      open={visible}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={okText}
      cancelText={cancelText}
      centered
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {iconMap[type]}
        </div>
        <div className="flex-1">
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
