/**
 * 无限滚动 Hook - 上拉加载更多
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number) => Promise<{ data: T[]; total: number }>
  pageSize?: number
  threshold?: number
}

interface UseInfiniteScrollReturn<T> {
  data: T[]
  loading: boolean
  hasMore: boolean
  total: number
  loadMore: () => void
  refresh: () => void
}

export function useInfiniteScroll<T>({
  fetchData,
  pageSize = 20,
  threshold = 100
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 加载数据
  const loadPage = useCallback(async (pageNum: number) => {
    if (loading) return

    setLoading(true)
    try {
      const result = await fetchData(pageNum)
      setData(prev => pageNum === 1 ? result.data : [...prev, ...result.data])
      setTotal(result.total)
      setHasMore(data.length + result.data.length < result.total)
      setPage(pageNum)
    } catch (error) {
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, fetchData, data.length])

  // 加载更多
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPage(page + 1)
    }
  }, [loading, hasMore, page, loadPage])

  // 刷新
  const refresh = useCallback(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    loadPage(1)
  }, [loadPage])

  // 监听滚动
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      {
        rootMargin: `${threshold}px`
      }
    )

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [hasMore, loading, loadMore, threshold])

  // 初始加载
  useEffect(() => {
    loadPage(1)
  }, [])

  return {
    data,
    loading,
    hasMore,
    total,
    loadMore,
    refresh
  }
}

export default useInfiniteScroll

// 使用示例
/*
const { data, loading, hasMore, loadMore, refresh } = useInfiniteScroll({
  fetchData: async (page) => {
    return await api.getList({ page, pageSize: 20 })
  },
  pageSize: 20,
  threshold: 100
})

return (
  <div>
    {data.map(item => <Item key={item.id} item={item} />)}
    {loading && <Loading />}
    {hasMore && <div ref={loadMoreRef}>加载更多...</div>}
  </div>
)
*/
