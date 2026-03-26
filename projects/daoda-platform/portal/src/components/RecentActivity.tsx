import { List, Tag, Typography, Space } from 'antd'
import React from 'react'
import dayjs from 'dayjs'

const { Text } = Typography

interface ActivityItem {
  id: string
  title: string
  description?: string
  time: string | Date
  type: string
  typeColor?: string
  avatar?: React.ReactNode
}

interface RecentActivityProps {
  items: ActivityItem[]
  loading?: boolean
  onItemClick?: (item: ActivityItem) => void
}

export default function RecentActivity({
  items,
  loading = false,
  onItemClick,
}: RecentActivityProps) {
  return (
    <div className="recent-activity">
      <List
        loading={loading}
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            onClick={() => onItemClick?.(item)}
            style={{ 
              cursor: onItemClick ? 'pointer' : 'default',
              padding: '12px 0',
              background: onItemClick ? '#fafafa' : 'transparent',
              borderRadius: 8,
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              if (onItemClick) {
                e.currentTarget.style.backgroundColor = '#e6f4ff'
              }
            }}
            onMouseLeave={(e) => {
              if (onItemClick) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <List.Item.Meta
                  title={
                    <div style={{ fontWeight: 500, fontSize: 14 }}>
                      {item.title}
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                        {typeof item.time === 'string' ? dayjs(item.time).format('HH:mm') : dayjs(item.time).format('HH:mm')}
                      </Text>
                    </div>
                  }
                  description={item.description}
                />
              </div>
              {item.type && (
                <Tag 
                  color={item.typeColor} 
                  style={{ 
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 12,
                    height: 'auto',
                    marginLeft: 8,
                  }}
                >
                  {item.type}
                </Tag>
              )}
            </Space>
          </List.Item>
        )}
      />
    </div>
  )
}
