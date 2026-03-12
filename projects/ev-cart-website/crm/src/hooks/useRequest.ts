/**
 * 统一请求 Hook
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useCallback } from 'react'
import { message } from 'antd'
import { useLoadingStore } from '@/store'

interface RequestConfig<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  showSuccess?: boolean
  showError?: boolean
  loadingKey?: string
}

/**
 * 统一请求 Hook
 * 
 * @example
 * ```typescript
 * const { data, loading, run } = useRequest(api.getUser)
 * 
 * // 手动触发
 * run(userId)
 * 
 * // 自动触发
 * const { data } = useRequest(api.getUser, { autoRun: true })
 * ```
 */
export function useRequest<T = any, P extends any[] = any[]>(
  service: (...args: P) => Promise<T>,
  config: RequestConfig<T> & { autoRun?: boolean } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  
  const { setGlobal, startEffect, stopEffect } = useLoadingStore()
  
  const {
    onSuccess,
    onError,
    showSuccess = false,
    showError = true,
    loadingKey,
    autoRun = false,
  } = config

  const run = useCallback(
    async (...args: P) => {
      setLoading(true)
      setError(null)
      
      // 启动 loading
      if (loadingKey) {
        startEffect(loadingKey)
      } else {
        setGlobal(true)
      }

      try {
        const result = await service(...args)
        setData(result)
        
        // 成功回调
        onSuccess?.(result)
        if (showSuccess) {
          message.success('操作成功')
        }
        
        return result
      } catch (err: any) {
        setError(err)
        
        // 错误回调
        onError?.(err)
        if (showError) {
          message.error(err?.message || '操作失败')
        }
        
        throw err
      } finally {
        setLoading(false)
        
        // 停止 loading
        if (loadingKey) {
          stopEffect(loadingKey)
        } else {
          setGlobal(false)
        }
      }
    },
    [service, onSuccess, onError, showSuccess, showError, loadingKey, setGlobal, startEffect, stopEffect]
  )

  // 自动执行
  useState(() => {
    if (autoRun) {
      run()
    }
  })

  return {
    data,
    loading,
    error,
    run,
    setData,
    setError,
  }
}

/**
 * 防抖请求 Hook
 */
export function useDebounceRequest<T = any, P extends any[] = any[]>(
  service: (...args: P) => Promise<T>,
  delay: number = 300,
  config?: RequestConfig<T>
) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const { loading, error, data, run, setData, setError } = useRequest(service, config)

  const debounceRun = useCallback(
    (...args: P) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      const id = setTimeout(() => {
        run(...args)
      }, delay)

      setTimeoutId(id)
    },
    [timeoutId, run, delay]
  )

  return {
    data,
    loading,
    error,
    run: debounceRun,
    setData,
    setError,
  }
}

/**
 * 轮询请求 Hook
 */
export function usePollingRequest<T = any, P extends any[] = any[]>(
  service: (...args: P) => Promise<T>,
  interval: number = 5000,
  config?: RequestConfig<T> & { immediate?: boolean }
) {
  const { loading, error, data, run, setData, setError } = useRequest(service, config)
  const [isPolling, setIsPolling] = useState(config?.immediate ?? true)

  useState(() => {
    if (!isPolling) return

    const id = setInterval(() => {
      run()
    }, interval)

    return () => clearInterval(id)
  }, [isPolling, interval, run])

  const startPolling = useCallback(() => setIsPolling(true), [])
  const stopPolling = useCallback(() => setIsPolling(false), [])

  return {
    data,
    loading,
    error,
    run,
    setData,
    setError,
    isPolling,
    startPolling,
    stopPolling,
  }
}

export default useRequest
