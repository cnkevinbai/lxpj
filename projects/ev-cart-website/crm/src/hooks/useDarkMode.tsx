import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DarkModeContextType {
  isDark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark))
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggle = () => setIsDark(!isDark)
  const setDark = (dark: boolean) => setIsDark(dark)

  return (
    <DarkModeContext.Provider value={{ isDark, toggle, setDark }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
