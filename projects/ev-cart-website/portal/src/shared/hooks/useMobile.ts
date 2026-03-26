import { useState, useEffect } from 'react'

interface MobileState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

/**
 * 移动端检测 Hook
 */
export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    breakpoint: 'lg',
  })

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      let breakpoint: MobileState['breakpoint']
      let isMobile = false
      let isTablet = false
      let isDesktop = false

      if (width < 640) {
        breakpoint = 'xs'
        isMobile = true
      } else if (width < 768) {
        breakpoint = 'sm'
        isMobile = true
      } else if (width < 1024) {
        breakpoint = 'md'
        isTablet = true
      } else if (width < 1280) {
        breakpoint = 'lg'
        isDesktop = true
      } else if (width < 1536) {
        breakpoint = 'xl'
        isDesktop = true
      } else {
        breakpoint = '2xl'
        isDesktop = true
      }

      setState({ isMobile, isTablet, isDesktop, breakpoint })
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)

    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return state
}
