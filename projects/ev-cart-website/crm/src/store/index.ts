/**
 * 全局状态管理 (Zustand)
 * 渔晓白 ⚙️ · 专业交付
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ==================== 用户状态 ====================

interface User {
  id: string
  username: string
  name: string
  role: string
  department: string
  avatar?: string
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'user-storage' }
  )
)

// ==================== 加载状态 ====================

interface LoadingState {
  global: boolean
  effects: Record<string, boolean>
  setGlobal: (loading: boolean) => void
  startEffect: (key: string) => void
  stopEffect: (key: string) => void
}

export const useLoadingStore = create<LoadingState>()((set, get) => ({
  global: false,
  effects: {},
  setGlobal: (loading) => set({ global: loading }),
  startEffect: (key) =>
    set((state) => ({ effects: { ...state.effects, [key]: true } })),
  stopEffect: (key) =>
    set((state) => ({ effects: { ...state.effects, [key]: false } })),
}))

// ==================== 通知状态 ====================

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleString('zh-CN'),
        read: false,
      }
      const notifications = [newNotification, ...state.notifications]
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    }),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))

// ==================== 应用配置 ====================

interface AppConfig {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  sidebarCollapsed: boolean
  compactMode: boolean
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'zh-CN' | 'en-US') => void
  toggleSidebar: () => void
  toggleCompactMode: () => void
}

export const useAppConfigStore = create<AppConfig>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh-CN',
      sidebarCollapsed: false,
      compactMode: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleCompactMode: () =>
        set((state) => ({ compactMode: !state.compactMode })),
    }),
    { name: 'app-config-storage' }
  )
)

// ==================== 导出所有 Store ====================

export default {
  user: useUserStore,
  loading: useLoadingStore,
  notification: useNotificationStore,
  config: useAppConfigStore,
}
