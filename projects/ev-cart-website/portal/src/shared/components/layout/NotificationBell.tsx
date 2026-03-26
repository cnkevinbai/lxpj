import React, { useState, useEffect } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Badge, Popover, List, Button, Tag } from 'antd'
import apiClient from '../../services/api'
import dayjs from 'dayjs'

/**
 * 通知铃铛组件
 */
const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
    // 每 30 秒刷新一次
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications', {
        params: { limit: 10 },
      })
      setNotifications(response.data.data)
    } catch (error) {
      console.error('加载通知失败', error)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count')
      setUnreadCount(response.data)
    } catch (error) {
      console.error('加载未读数失败', error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    await apiClient.post(`/notifications/${id}/read`)
    loadNotifications()
    loadUnreadCount()
  }

  const handleMarkAllAsRead = async () => {
    await apiClient.post('/notifications/read-all')
    loadNotifications()
    loadUnreadCount()
  }

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      internal: 'blue',
      dingtalk: 'cyan',
      wecom: 'green',
      email: 'orange',
      sms: 'purple',
    }
    return colorMap[type] || 'default'
  }

  const content = (
    <div className="w-80">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">通知</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead}>
            全部已读
          </Button>
        )}
      </div>
      <List
        dataSource={notifications}
        renderItem={(item: any) => (
          <List.Item
            className={`cursor-pointer ${item.status === 'unread' ? 'bg-blue-50' : ''}`}
            onClick={() => handleMarkAsRead(item.id)}
          >
            <List.Item.Meta
              title={
                <div className="flex justify-between">
                  <span>{item.title}</span>
                  {item.status === 'unread' && (
                    <Tag color="blue" className="text-xs">未读</Tag>
                  )}
                </div>
              }
              description={
                <div>
                  <div className="text-sm text-gray-600 truncate">{item.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {dayjs(item.createdAt).format('MM-DD HH:mm')}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      {notifications.length === 0 && (
        <div className="text-center py-4 text-gray-400">暂无通知</div>
      )}
    </div>
  )

  return (
    <Popover content={content} trigger="click" open={visible} onOpenChange={setVisible}>
      <Badge count={unreadCount} size="small">
        <BellOutlined className="text-xl text-gray-600 hover:text-gray-900 cursor-pointer" />
      </Badge>
    </Popover>
  )
}

export default NotificationBell
