import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Input, Select, message, Badge } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons'

interface Message {
  id: string
  type: string
  title: string
  content: string
  sender: string
  isRead: boolean
  priority: string
  createdAt: string
}

const MessageCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState<string>()
  const [filterPriority, setFilterPriority] = useState<string>()

  const typeLabels: Record<string, string> = {
    system: '系统通知',
    approval: '审批通知',
    order: '订单通知',
    inventory: '库存预警',
    service: '服务工单',
  }

  const priorityColors: Record<string, string> = {
    high: 'red',
    normal: 'blue',
    low: 'default',
  }

  const priorityLabels: Record<string, string> = {
    high: '紧急',
    normal: '普通',
    low: '低',
  }

  // 获取消息列表
  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/messages')
      const data = await response.json()
      setMessages(data.data || [])
    } catch (error) {
      message.error('加载消息失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // 标记为已读
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/v1/messages/${id}/read`, { method: 'POST' })
      fetchMessages()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag>{typeLabels[type] || type}</Tag>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: Message) => (
        <span style={{ fontWeight: record.isRead ? 'normal' : 'bold', color: record.isRead ? '#666' : '#000' }}>
          {record.isRead ? text : '📬 ' + text}
        </span>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 400,
      ellipsis: true,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => <Tag color={priorityColors[priority]}>{priorityLabels[priority]}</Tag>,
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      key: 'sender',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_: any, record: Message) => (
        record.isRead ? <Badge status="default" text="已读" /> : <Badge status="processing" text="未读" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Message) => (
        <Space size="small">
          {!record.isRead && (
            <Button type="link" size="small" onClick={() => markAsRead(record.id)}>标记已读</Button>
          )}
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card title="📬 消息中心">
        {/* 筛选栏 */}
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索消息"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
          />
          <Select
            placeholder="消息类型"
            style={{ width: 120 }}
            allowClear
            onChange={setFilterType}
            options={[
              { label: '系统通知', value: 'system' },
              { label: '审批通知', value: 'approval' },
              { label: '订单通知', value: 'order' },
              { label: '库存预警', value: 'inventory' },
              { label: '服务工单', value: 'service' },
            ]}
          />
          <Select
            placeholder="优先级"
            style={{ width: 100 }}
            allowClear
            onChange={setFilterPriority}
            options={[
              { label: '紧急', value: 'high' },
              { label: '普通', value: 'normal' },
              { label: '低', value: 'low' },
            ]}
          />
          <Button type="primary">刷新</Button>
          <Button>全部标记已读</Button>
        </Space>

        {/* 消息列表 */}
        <Table
          columns={columns}
          dataSource={messages}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}

export default MessageCenter
