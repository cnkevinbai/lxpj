# 状态管理技能

## 📋 技能说明

使用 Zustand、Redux Toolkit 或 Context 进行应用状态管理。

---

## 🎯 适用场景

- 全局状态管理
- 组件间状态共享
- 复杂状态逻辑

---

## 📝 Zustand 示例（推荐）

```typescript
// stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      }))
    }),
    { name: 'user-storage' }
  )
)

// 使用
function Component() {
  const { user, login, logout } = useUserStore()
  // ...
}
```

---

## 📚 相关技能

- `react-component` - React 组件开发
- `typescript` - TypeScript 开发