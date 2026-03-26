import React, { useState, useEffect, useRef, ReactNode } from 'react'

interface InfiniteScrollProps {
  children: ReactNode
  onLoadMore: () => Promise<void>
  hasMore: boolean
  loading?: boolean
  threshold?: number
}

/**
 * 上拉加载更多组件
 */
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 100,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !loading && !isLoadingMore) {
          loadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading, isLoadingMore, threshold])

  const loadMore = async () => {
    if (!hasMore || loading || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      await onLoadMore()
    } catch (error) {
      console.error('加载更多失败', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div>
      {children}

      {/* 加载指示器 */}
      <div ref={observerTarget} className="py-4 text-center">
        {hasMore ? (
          isLoadingMore || loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <span>加载中...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>上拉加载更多</span>
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )
        ) : (
          <div className="text-gray-400 text-sm">
            {isLoadingMore ? '加载中...' : '没有更多了'}
          </div>
        )}
      </div>
    </div>
  )
}

export default InfiniteScroll
