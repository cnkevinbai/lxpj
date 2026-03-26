/**
 * 绑定事件时间线组件
 * 
 * @description 展示设备绑定的操作历史
 * @author 渔晓白
 */

import { Timeline, Tag, Empty, Spin, Typography } from 'antd'
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ApiOutlined,
  LinkOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import type { BindingEvent, BindingEventType, ProtocolType } from '@/types/binding'
import { ProtocolConfig } from '@/types/binding'

const { Text } = Typography

interface BindingEventTimelineProps {
  events: BindingEvent[]
  loading?: boolean
}

/** 事件类型配置 */
const EventTypeConfig: Record<BindingEventType, { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
}> = {
  BIND_REQUEST: { label: '绑定请求', color: 'processing', icon: <SyncOutlined /> },
  BIND_SUCCESS: { label: '绑定成功', color: 'success', icon: <CheckCircleOutlined /> },
  BIND_FAILURE: { label: '绑定失败', color: 'error', icon: <CloseCircleOutlined /> },
  UNBIND_REQUEST: { label: '解绑请求', color: 'warning', icon: <WarningOutlined /> },
  UNBIND_SUCCESS: { label: '解绑成功', color: 'default', icon: <CloseCircleOutlined /> },
  BIND_RECOVERED: { label: '绑定恢复', color: 'success', icon: <CheckCircleOutlined /> },
  BIND_EXPIRED: { label: '绑定过期', color: 'warning', icon: <WarningOutlined /> },
  DEVICE_ONLINE: { label: '设备上线', color: 'success', icon: <ApiOutlined /> },
  DEVICE_OFFLINE: { label: '设备离线', color: 'default', icon: <ApiOutlined /> },
  AUTH_SUCCESS: { label: '认证成功', color: 'success', icon: <CheckCircleOutlined /> },
  AUTH_FAILURE: { label: '认证失败', color: 'error', icon: <CloseCircleOutlined /> },
}

export default function BindingEventTimeline({ events, loading }: BindingEventTimelineProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin />
      </div>
    )
  }
  
  if (!events || events.length === 0) {
    return <Empty description="暂无事件记录" />
  }
  
  return (
    <Timeline
      items={events.map((event) => {
        const config = EventTypeConfig[event.eventType] || {
          label: event.eventType,
          color: 'default',
          icon: null,
        }
        
        return {
          key: event.eventId,
          dot: config.icon,
          children: (
            <div>
              <div style={{ marginBottom: 4 }}>
                <Tag color={config.color} icon={config.icon}>
                  {config.label}
                </Tag>
                <Tag color={ProtocolConfig[event.protocol]?.color || 'default'}>
                  {ProtocolConfig[event.protocol]?.label || event.protocol}
                </Tag>
                {event.retryCount > 0 && (
                  <Text type="secondary">重试 {event.retryCount} 次</Text>
                )}
              </div>
              <div>
                <Text type="secondary">
                  {formatTime(event.eventTime)}
                </Text>
                {event.errorMessage && (
                  <Text type="danger" style={{ marginLeft: 8 }}>
                    {event.errorMessage}
                  </Text>
                )}
              </div>
            </div>
          ),
        }
      })}
    />
  )
}

/** 格式化时间 */
function formatTime(time: string): string {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}