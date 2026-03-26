import { useState, useEffect } from 'react'

interface GestureState {
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null
  isSwiping: boolean
  startX: number
  startY: number
}

/**
 * 手势 Hook
 * 支持滑动、长按等手势
 */
export function useGesture(
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void,
  onLongPress?: () => void,
) {
  const [state, setState] = useState<GestureState>({
    swipeDirection: null,
    isSwiping: false,
    startX: 0,
    startY: 0,
  })

  const threshold = 50 // 滑动阈值 (px)
  const longPressDuration = 500 // 长按时长 (ms)

  useEffect(() => {
    let longPressTimer: NodeJS.Timeout

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setState(prev => ({
        ...prev,
        isSwiping: true,
        startX: touch.clientX,
        startY: touch.clientY,
        swipeDirection: null,
      }))

      // 长按检测
      longPressTimer = setTimeout(() => {
        if (onLongPress) {
          onLongPress()
        }
      }, longPressDuration)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.isSwiping) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - state.startX
      const deltaY = touch.clientY - state.startY

      // 判断滑动方向
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        clearTimeout(longPressTimer)
        
        let direction: 'left' | 'right' | 'up' | 'down'
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left'
        } else {
          direction = deltaY > 0 ? 'down' : 'up'
        }

        setState(prev => ({ ...prev, swipeDirection: direction }))

        if (onSwipe) {
          onSwipe(direction)
        }
      }
    }

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer)
      setState(prev => ({
        ...prev,
        isSwiping: false,
        swipeDirection: null,
      }))
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      clearTimeout(longPressTimer)
    }
  }, [state.isSwiping, state.startX, state.startY, onSwipe, onLongPress])

  return state
}
