/**
 * 性能监控组件
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect } from 'react'
import { Badge, Tooltip } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  tti: number // Time to Interactive
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    tti: 0,
  })
  
  const [score, setScore] = useState(100)

  useEffect(() => {
    // 使用 Performance API 监控性能
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      
      for (const entry of entries) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics((prev) => ({ ...prev, fcp: entry.startTime }))
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics((prev) => ({ ...prev, lcp: entry.startTime }))
        }
        
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          setMetrics((prev) => ({ ...prev, cls: prev.cls + (entry as any).value }))
        }
      }
    })
    
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] })
    
    // 计算性能分数
    const calculateScore = () => {
      let score = 100
      
      // FCP 评分 (< 1.8s 为优秀)
      if (metrics.fcp > 1800) score -= 10
      if (metrics.fcp > 3000) score -= 10
      
      // LCP 评分 (< 2.5s 为优秀)
      if (metrics.lcp > 2500) score -= 15
      if (metrics.lcp > 4000) score -= 15
      
      // CLS 评分 (< 0.1 为优秀)
      if (metrics.cls > 0.1) score -= 10
      if (metrics.cls > 0.25) score -= 15
      
      setScore(Math.max(0, score))
    }
    
    calculateScore()
    
    return () => observer.disconnect()
  }, [metrics])

  // 获取性能等级
  const getPerformanceLevel = () => {
    if (score >= 90) return { level: '优秀', color: '#52c41a' }
    if (score >= 70) return { level: '良好', color: '#1890ff' }
    if (score >= 50) return { level: '一般', color: '#faad14' }
    return { level: '较差', color: '#ff4d4f' }
  }

  const { level, color } = getPerformanceLevel()

  return (
    <Tooltip
      title={
        <div style={{ width: 250 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>性能分数：</strong>
            <span style={{ color, fontWeight: 'bold' }}>{score}</span>
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            <div>FCP: {metrics.fcp.toFixed(0)}ms</div>
            <div>LCP: {metrics.lcp.toFixed(0)}ms</div>
            <div>CLS: {metrics.cls.toFixed(3)}</div>
          </div>
        </div>
      }
    >
      <Badge
        count={level}
        style={{
          backgroundColor: color,
          cursor: 'pointer',
        }}
      >
        <ThunderboltOutlined style={{ fontSize: 16 }} />
      </Badge>
    </Tooltip>
  )
}
