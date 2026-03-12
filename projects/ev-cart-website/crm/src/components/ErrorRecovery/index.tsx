/**
 * 错误恢复组件 - 自动重试 + 降级处理
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useCallback } from 'react'
import { Result, Button, Alert, Progress } from 'antd'
import { ReloadOutlined, WifiOutlined } from '@ant-design/icons'

interface ErrorRecoveryProps {
  error?: any
  onRetry: () => Promise<void>
  maxRetries?: number
  retryDelay?: number
  children?: React.ReactNode
}

export default function ErrorRecovery({
  error,
  onRetry,
  maxRetries = 3,
  retryDelay = 3000,
  children,
}: ErrorRecoveryProps) {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      setRetryCount(0)
      return
    }

    setIsRetrying(true)
    try {
      await onRetry()
      setRetryCount(0)
    } catch (err) {
      setRetryCount((prev) => prev + 1)
      // 指数退避
      const delay = retryDelay * Math.pow(2, retryCount)
      setCountdown(Math.floor(delay / 1000))
    } finally {
      setIsRetrying(false)
    }
  }, [onRetry, retryCount, maxRetries, retryDelay])

  // 自动重试倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])

  if (!error) {
    return <>{children}</>
  }

  const progress = (retryCount / maxRetries) * 100

  return (
    <Result
      status="error"
      title="加载失败"
      subTitle={error?.message || '网络开小差了，请稍后重试'}
      icon={<WifiOutlined style={{ color: '#ff4d4f', fontSize: 64 }} />}
      extra={
        <div style={{ maxWidth: 400 }}>
          {retryCount > 0 && (
            <Alert
              message={`已重试 ${retryCount}/${maxRetries} 次`}
              type="warning"
              style={{ marginBottom: 16 }}
            />
          )}
          
          {countdown > 0 ? (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Progress
                percent={progress}
                strokeColor="#faad14"
                format={() => `${countdown}秒后自动重试`}
              />
            </div>
          ) : (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRetry}
              loading={isRetrying}
              block
            >
              {isRetrying ? '重试中...' : '点击重试'}
            </Button>
          )}
          
          <div style={{ marginTop: 16, fontSize: 12, color: '#999', textAlign: 'center' }}>
            <div>错误代码：{error?.code || 'UNKNOWN'}</div>
            <div>请求 ID: {error?.requestId || '-'}</div>
          </div>
        </div>
      }
    />
  )
}
