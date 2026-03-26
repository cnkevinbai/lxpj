import { useState } from 'react'
import { Badge, Dropdown, List, Tag, Avatar, Button, Space } from 'antd'
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  time: string
  read: boolean
  action?: {
    label: string
    url: string
  }
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: '待跟进提醒',
    message: '您有 3 个线索需要在今天跟进',
    time: '10 分钟前',
    read: false,
    action: { label: '去跟进', url: '/leads' },
  },
  {
    id: '2',
    type: 'success',
    title: '订单完成',
    message: '订单 ORD20260312001 已收款完成',
    time: '1 小时前',
    read: false,
    action: { label: '查看详情', url: '/orders/1' },
  },
  {
    id: '3',
    type: 'info',
    title: '新客户',
    message: '成都某某科技有限公司已分配给您',
    time: '2 小时前',
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: '库存预警',
    message: '钢材 A 型库存不足，请及时采购',
    time: '3 小时前',
    read: true,
    action: { label: '去采购', url: '/purchase/create' },
  },
  {
    id: '5',
    type: 'info',
    title: '审批通知',
    message: '您的采购申请已批准',
    time: '昨天',
    read: true,
  },
]

const typeConfig = {
  info: { icon: <InfoCircleOutlined />, color: '#1890ff' },
  success: { icon: <CheckCircleOutlined />, color: '#52c41a' },
  warning: { icon: <ExclamationCircleOutlined />, color: '#faad14' },
  error: { icon: <ClockCircleOutlined />, color: '#ff4d4f' },
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [visible, setVisible] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleReadAll = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'actions',
      label: (
        <div style={{ padding: '8px 16px' }}>
          <Space>
            <Button size="small" onClick={handleReadAll}>
              全部已读
            </Button>
            <Button size="small" danger>
              清空全部
            </Button>
          </Space>
        </div>
      ),
    },
  ]

  const notificationList = (
    <div style={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
      {notifications.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>
          <BellOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>暂无通知</div>
        </div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => {
            const config = typeConfig[item.type]
            return (
              <List.Item
                onClick={() => handleMarkRead(item.id)}
                style={{
                  padding: '12px 16px',
                  background: item.read ? '#fff' : '#f6f8ff',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.read ? '#fafafa' : '#e6f4ff'
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: config.color }}>
                      {config.icon}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: item.read ? 400 : 600 }}>
                        {item.title}
                      </span>
                      <span style={{ color: '#999', fontSize: 12 }}>{item.time}</span>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ color: '#666', marginBottom: 8 }}>{item.message}</div>
                      {item.action && (
                        <Button
                          type="link"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            // navigate(item.action.url)
                          }}
                        >
                          {item.action.label}
                        </Button>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )
          }}
        />
      )}
    </div>
  )

  return (
    <Dropdown
      menu={{ items: [] }}
      trigger={['click']}
      open={visible}
      onOpenChange={setVisible}
      dropdownRender={() => notificationList}
    >
      <Badge count={unreadCount} offset={[-5, 5]}>
        <BellOutlined
          style={{
            fontSize: 18,
            cursor: 'pointer',
            color: unreadCount > 0 ? '#1890ff' : '#666',
          }}
        />
      </Badge>
    </Dropdown>
  )
}
