/**
 * 网络状态监控 Hook
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect } from 'react'

interface NetworkStatus {
  online: boolean
  downlink?: number
  effectiveType?: '2g' | '3g' | '4g' | '5g'
  rtt?: number
  saveData?: boolean
}

/**
 * 网络状态监控
 */
export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
  })

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as any).connection
      
      setStatus({
        online: navigator.onLine,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
      })
    }

    updateStatus()

    // 监听网络变化
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateStatus)
    }

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
      if (connection) {
        connection.removeEventListener('change', updateStatus)
      }
    }
  }, [])

  return status
}

/**
 * 网络质量评分 (0-100)
 */
export function getNetworkQuality(status: NetworkStatus): number {
  if (!status.online) return 0
  
  let score = 100
  
  // 根据网络类型扣分
  if (status.effectiveType === '2g') score -= 60
  if (status.effectiveType === '3g') score -= 30
  if (status.effectiveType === '4g') score -= 10
  
  // 根据延迟扣分
  if (status.rtt && status.rtt > 1000) score -= 30
  else if (status.rtt && status.rtt > 500) score -= 20
  else if (status.rtt && status.rtt > 200) score -= 10
  
  // 根据带宽扣分
  if (status.downlink && status.downlink < 1) score -= 30
  else if (status.downlink && status.downlink < 5) score -= 15
  
  return Math.max(0, score)
}

/**
 * 网络质量等级
 */
export function getNetworkLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

export default useNetworkStatus
