import { useState, useEffect } from 'react'

/**
 * 本地存储 Hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 从本地存储获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('读取本地存储失败', error)
      return initialValue
    }
  })

  // 当值变化时保存到本地存储
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('保存本地存储失败', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
