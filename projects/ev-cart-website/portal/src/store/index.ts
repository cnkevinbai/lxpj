import { create } from 'zustand'

interface UserState {
  user: {
    id: string
    username: string
    name: string
    avatar?: string
    roles: string[]
  } | null
  setUser: (user: any) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))

interface AppState {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
}))

export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'auto',
  setMode: (mode) => set({ mode }),
}))
