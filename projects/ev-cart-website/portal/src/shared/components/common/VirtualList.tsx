/**
 * 虚拟列表组件 - 高性能大列表渲染
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useRef, useCallback } from 'react'

interface VirtualListProps<T> {
  data: T[]
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  onScroll?: (scrollTop: number) => void
}

export default function VirtualList<T>({
  data,
  itemHeight,
  renderItem,
  overscan = 5,
  onScroll
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)

  // 计算可视区域
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleData = data.slice(startIndex, endIndex)
  const totalHeight = data.length * itemHeight
  const offsetY = startIndex * itemHeight

  // 监听容器大小
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight)
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 处理滚动
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '100%',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <div style={{
        height: totalHeight,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${offsetY}px)`
        }}>
          {visibleData.map((item, index) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 使用示例
/*
<VirtualList
  data={largeData}
  itemHeight={80}
  overscan={5}
  renderItem={(item, index) => (
    <div key={index} style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
      {item.name}
    </div>
  )}
/>
*/
