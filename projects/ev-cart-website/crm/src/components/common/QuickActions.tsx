import React, { useState } from 'react'
import { FloatButton, Tooltip } from 'antd'
import {
  PlusOutlined,
  InboxOutlined,
  TeamOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

/**
 * 快速操作面板
 * 悬浮按钮，快速访问常用功能
 */
const QuickActions: React.FC = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const actions = [
    {
      icon: <InboxOutlined />,
      tooltip: '新建线索',
      action: () => navigate('/crm/leads/create'),
    },
    {
      icon: <TeamOutlined />,
      tooltip: '新建客户',
      action: () => navigate('/crm/customers/create'),
    },
    {
      icon: <FileTextOutlined />,
      tooltip: '新建订单',
      action: () => navigate('/crm/orders/create'),
    },
    {
      icon: <CustomerServiceOutlined />,
      tooltip: 'AI 客服',
      action: () => navigate('/crm/ai-chat'),
    },
  ]

  return (
    <>
      <FloatButton.Group
        shape="circle"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<PlusOutlined />}
        open={open}
        onClick={() => setOpen(!open)}
      >
        {actions.map((action, index) => (
          <Tooltip key={index} title={action.tooltip} placement="left">
            <FloatButton
              icon={action.icon}
              onClick={(e) => {
                e.stopPropagation()
                action.action()
                setOpen(false)
              }}
            />
          </Tooltip>
        ))}
      </FloatButton.Group>
    </>
  )
}

export default QuickActions
