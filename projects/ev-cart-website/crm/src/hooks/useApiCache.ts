/**
 * API 请求缓存 Hook
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useCallback } from 'react'

interface CacheConfig<T> {
  key: string
  ttl?: number // 缓存时间 (毫秒)
  staleWhileRevalidate?: boolean // 是否使用过期缓存
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

const cache = new Map<string, CacheEntry<any>>()

export function useApiCache<T>(
  fetcher: () => Promise<T>,
  config: CacheConfig<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    const { key, ttl = 300000, staleWhileRevalidate = true } = config

    // 检查缓存
    const cached = cache.get(key) as CacheEntry<T> | undefined

    if (cached) {
      const now = Date.now()
      const isExpired = now > cached.expiresAt

      // 使用缓存
      if (staleWhileRevalidate || !isExpired) {
        setData(cached.data)
        setLoading(false)

        // 后台更新
        if (isExpired) {
          fetcher()
            .then((newData) => {
              cache.set(key, {
                data: newData,
                timestamp: now,
                expiresAt: now + ttl
              })
              setData(newData)
            })
            .catch(console.error)
        }
        return
      }
    }

    // 请求新数据
    try {
      const newData = await fetcher()
      const now = Date.now()

      cache.set(key, {
        data: newData,
        timestamp: now,
        expiresAt: now + ttl
      })

      setData(newData)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [fetcher, config])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 手动刷新
  const refresh = useCallback(() => {
    const { key } = config
    cache.delete(key)
    return fetchData()
  }, [fetchData, config])

  // 清除缓存
  const clearCache = useCallback(() => {
    const { key } = config
    cache.delete(key)
  }, [config])

  return {
    data,
    loading,
    error,
    refresh,
    clearCache
  }
}

export default useApiCache

// 使用示例
/*
const { data, loading, refresh } = useApiCache(
  async () => {
    return await api.getCustomers()
  },
  {
    key: 'customers_list',
    ttl: 300000, // 5 分钟
    staleWhileRevalidate: true
  }
)
*/
