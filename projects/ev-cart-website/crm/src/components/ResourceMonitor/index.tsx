/**
 * 资源监控组件 - 内存/CPU/网络
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect } from 'react'
import { Card, Progress, Space, Tag, Tooltip } from 'antd'
import {
  WifiOutlined,
  DashboardOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useNetworkStatus, getNetworkQuality, getNetworkLevel } from '@/hooks/useNetworkStatus'

interface ResourceMetrics {
  memory: number
  cpu: number
  network: number
}

export default function ResourceMonitor() {
  const networkStatus = useNetworkStatus()
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    memory: 0,
    cpu: 0,
    network: 100,
  })

  useEffect(() => {
    // 监控内存使用
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      const memoryPercent = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100
      setMetrics((prev) => ({ ...prev, memory: memoryPercent }))
    }

    // 监控网络质量
    const networkScore = getNetworkQuality(networkStatus)
    setMetrics((prev) => ({ ...prev, network: networkScore }))
  }, [networkStatus])

  const getMemoryLevel = (percent: number) => {
    if (percent < 50) return { color: '#52c41a', text: '正常' }
    if (percent < 80) return { color: '#faad14', text: '偏高' }
    return { color: '#ff4d4f', text: '过高' }
  }

  const getNetworkLevelInfo = (score: number) => {
    const level = getNetworkLevel(score)
    const config = {
      excellent: { color: '#52c41a', text: '优秀' },
      good: { color: '#1890ff', text: '良好' },
      fair: { color: '#faad14', text: '一般' },
      poor: { color: '#ff4d4f', text: '较差' },
    }
    return config[level]
  }

  const memoryLevel = getMemoryLevel(metrics.memory)
  const networkLevel = getNetworkLevelInfo(metrics.network)

  return (
    <Card
      size="small"
      title={
        <Space>
          <DashboardOutlined />
          资源监控
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* 内存使用 */}
        <div>
          <Space style={{ marginBottom: 4 }}>
            <CloudServerOutlined />
            <span>内存使用</span>
            <Tag color={memoryLevel.color}>{memoryLevel.text}</Tag>
          </Space>
          <Progress
            percent={Math.round(metrics.memory)}
            strokeColor={memoryLevel.color}
            size="small"
            format={() => `${metrics.memory.toFixed(1)}%`}
          />
        </div>

        {/* 网络质量 */}
        <div>
          <Space style={{ marginBottom: 4 }}>
            <WifiOutlined />
            <span>网络质量</span>
            <Tag color={networkLevel.color}>{networkLevel.text}</Tag>
          </Space>
          <Progress
            percent={Math.round(metrics.network)}
            strokeColor={networkLevel.color}
            size="small"
            format={() => {
              if (!networkStatus.online) return '离线'
              return `${metrics.network.toFixed(0)}%`
            }}
          />
          {networkStatus.downlink && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              下行：{networkStatus.downlink.toFixed(1)} Mbps |
              延迟：{networkStatus.rtt} ms |
              类型：{networkStatus.effectiveType?.toUpperCase()}
            </div>
          )}
        </div>

        {/* 在线状态 */}
        <div style={{ textAlign: 'center', fontSize: 12 }}>
          <Tag color={networkStatus.online ? 'green' : 'red'}>
            {networkStatus.online ? '● 在线' : '● 离线'}
          </Tag>
        </div>
      </Space>
    </Card>
  )
}
