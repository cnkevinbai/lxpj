import React, { useState } from 'react'
import { useGesture } from '../../hooks/useGesture'

interface SwipeItemProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onLongPress?: () => void
  className?: string
}

/**
 * 可滑动列表项组件
 */
const SwipeItem: React.FC<SwipeItemProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  className = '',
}) => {
  const [offset, setOffset] = useState(0)

  useGesture(
    (direction) => {
      if (direction === 'left' && onSwipeLeft) {
        setOffset(-100)
        setTimeout(() => {
          onSwipeLeft()
          setOffset(0)
        }, 300)
      }
      if (direction === 'right' && onSwipeRight) {
        setOffset(100)
        setTimeout(() => {
          onSwipeRight()
          setOffset(0)
        }, 300)
      }
    },
    onLongPress,
  )

  return (
    <div
      className={`transition-transform duration-300 ${className}`}
      style={{ transform: `translateX(${offset}px)` }}
    >
      {children}
    </div>
  )
}

export default SwipeItem
