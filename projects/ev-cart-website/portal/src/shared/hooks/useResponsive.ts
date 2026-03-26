import { useState, useEffect } from 'react'

export interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      setState({
        isMobile: screenWidth < 768,
        isTablet: screenWidth >= 768 && screenWidth < 1024,
        isDesktop: screenWidth >= 1024,
        screenWidth,
        screenHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return state
}

export default useResponsive
