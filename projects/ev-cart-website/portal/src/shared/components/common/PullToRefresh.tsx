import React, { useState, useEffect, ReactNode } from 'react'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
}

/**
 * 下拉刷新组件
 */
const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 100,
}) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)

  useEffect(() => {
    let touchStartY = 0
    let touchMoveY = 0
    let isScrolledToTop = false

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      isScrolledToTop = window.scrollY === 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolledToTop || isRefreshing) return

      touchMoveY = e.touches[0].clientY
      const distance = touchMoveY - touchStartY

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 2))
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } catch (error) {
          console.error('刷新失败', error)
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh])

  return (
    <div className="relative">
      {/* 下拉指示器 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div className="text-gray-400 text-sm">
          {isRefreshing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <span>刷新中...</span>
            </div>
          ) : pullDistance >= threshold ? (
            <span>释放刷新</span>
          ) : (
            <span>下拉刷新</span>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PullToRefresh
