/**
 * 本地存储工具函数
 * 渔晓白 ⚙️ · 专业交付
 */

/**
 * 设置 localStorage
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Storage set error:', error)
  }
}

/**
 * 获取 localStorage
 */
export function getStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Storage get error:', error)
    return null
  }
}

/**
 * 移除 localStorage
 */
export function removeStorage(key: string): void {
  localStorage.removeItem(key)
}

/**
 * 清空 localStorage
 */
export function clearStorage(): void {
  localStorage.clear()
}

/**
 * 设置 sessionStorage
 */
export function setSessionStorage<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('SessionStorage set error:', error)
  }
}

/**
 * 获取 sessionStorage
 */
export function getSessionStorage<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('SessionStorage get error:', error)
    return null
  }
}
