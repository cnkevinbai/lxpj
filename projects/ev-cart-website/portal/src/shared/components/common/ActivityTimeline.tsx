import React from 'react'
import { Timeline, Tag } from 'antd'
import {
  InboxOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Activity {
  id: string
  type: 'lead' | 'customer' | 'order' | 'followup' | 'task'
  action: string
  target: string
  user: string
  createdAt: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

/**
 * 动态时间轴组件
 */
const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'lead': return <InboxOutlined className="text-blue-500" />
      case 'customer': return <TeamOutlined className="text-green-500" />
      case 'order': return <ShoppingCartOutlined className="text-orange-500" />
      case 'followup': return <FileTextOutlined className="text-purple-500" />
      case 'task': return <CheckCircleOutlined className="text-green-500" />
      default: return <InboxOutlined />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'lead': return 'blue'
      case 'customer': return 'green'
      case 'order': return 'orange'
      case 'followup': return 'purple'
      case 'task': return 'green'
      default: return 'default'
    }
  }

  return (
    <Timeline>
      {activities.map((activity) => (
        <Timeline.Item
          key={activity.id}
          dot={getIcon(activity.type)}
          color={getColor(activity.type)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">
                <Tag color={getColor(activity.type)} className="mr-2">
                  {activity.type === 'lead' && '线索'}
                  {activity.type === 'customer' && '客户'}
                  {activity.type === 'order' && '订单'}
                  {activity.type === 'followup' && '跟进'}
                  {activity.type === 'task' && '任务'}
                </Tag>
                {activity.action}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {activity.target}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {activity.user} · {dayjs(activity.createdAt).fromNow()}
              </div>
            </div>
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}

export default ActivityTimeline
