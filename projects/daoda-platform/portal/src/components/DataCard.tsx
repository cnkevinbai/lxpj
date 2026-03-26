import { Card, Statistic, Skeleton } from 'antd'
import React from 'react'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface DataCardProps {
  title: string
  value: number
  prefixIcon?: React.ReactNode
  suffix?: string
  trend?: number
  loading?: boolean
  onClick?: () => void
}

export default function DataCard({
  title,
  value,
  prefixIcon,
  suffix,
  trend,
  loading = false,
  onClick,
}: DataCardProps) {
  const trendColor = trend
    ? trend > 0
      ? '#3f8600'
      : trend < 0
        ? '#cf1322'
        : undefined
    : undefined
  const trendIcon = trend
    ? trend > 0
      ? <ArrowUpOutlined style={{ color: trendColor }} />
      : trend < 0
        ? <ArrowDownOutlined style={{ color: trendColor }} />
        : undefined
    : undefined

  if (loading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    )
  }

  return (
    <Card
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', height: '100%' }}
    >
      <div className="data-card">
        <div className="data-card-title">{title}</div>
        <Statistic
          title=""
          value={value}
          prefix={prefixIcon}
          suffix={suffix}
          valueStyle={{ fontSize: 24, fontWeight: 600 }}
        />
        {trend !== undefined && trend !== 0 && trendIcon && (
          <div className="data-card-trend" style={{ color: trendColor, marginTop: 8 }}>
            {trend > 0 ? '+' : ''}{trend}%
            {trendIcon}
          </div>
        )}
      </div>
    </Card>
  )
}
