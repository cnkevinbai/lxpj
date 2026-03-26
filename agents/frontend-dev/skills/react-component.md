# React 组件开发技能（强化版）

## 📋 技能说明

开发高质量、可维护的 React 函数组件，遵循官方最佳实践和 React 18 新特性。

---

## 🎯 React 18 核心概念

### 组件规则（Rules of React）

1. **组件和 Hooks 必须是纯函数**
   - 相同输入 → 相同输出
   - 不修改外部状态
   - 不执行副作用（在渲染期间）

2. **React 调用组件和 Hooks**
   - 不要在循环/条件中调用 Hooks
   - Hooks 只能在组件顶层调用

3. **Hooks 规则**
   - 只在函数组件/自定义 Hook 中调用
   - 只在最顶层调用

---

## 📝 Hooks 最佳实践

### useState

```typescript
// ✅ 正确：使用函数式更新
setCount(prev => prev + 1)

// ✅ 正确：对象更新使用展开
setUser(prev => ({ ...prev, name: 'New' }))

// ❌ 错误：直接修改状态
state.items.push(newItem)
setState(state)
```

### useEffect

```typescript
// ✅ 正确：清理副作用
useEffect(() => {
  const controller = new AbortController()
  
  fetchData({ signal: controller.signal })
  
  return () => controller.abort()
}, [id])

// ✅ 正确：依赖数组完整
useEffect(() => {
  document.title = `Hello, ${name}`
}, [name]) // 包含所有依赖

// ❌ 错误：缺少依赖
useEffect(() => {
  fetchData(userId) // userId 未在依赖中
}, [])
```

### useMemo / useCallback

```typescript
// ✅ 缓存计算结果
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
)

// ✅ 缓存回调函数
const handleSubmit = useCallback(
  (data: FormData) => submitForm(data),
  [submitForm]
)

// ⚠️ 不要过度使用：简单计算不需要
const sum = useMemo(() => a + b, [a, b]) // 不必要
```

### useReducer（复杂状态）

```typescript
interface State {
  loading: boolean
  data: Data | null
  error: Error | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Data }
  | { type: 'FETCH_ERROR'; payload: Error }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { loading: false, data: action.payload, error: null }
    case 'FETCH_ERROR':
      return { loading: false, data: null, error: action.payload }
    default:
      return state
  }
}
```

---

## 📝 组件模板（生产级）

```typescript
/**
 * UserCard - 用户卡片组件
 * 
 * @example
 * <UserCard user={user} onEdit={handleEdit} />
 */
import { FC, memo, useState, useCallback } from 'react'

// ==================== 类型定义 ====================

interface UserCardProps {
  /** 用户数据 */
  user: User
  /** 编辑回调 */
  onEdit?: (user: User) => void
  /** 删除回调 */
  onDelete?: (userId: string) => Promise<void>
}

// ==================== 组件定义 ====================

export const UserCard: FC<UserCardProps> = memo(({
  user,
  onEdit,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  
  // 事件处理（缓存）
  const handleEdit = useCallback(() => {
    onEdit?.(user)
  }, [user, onEdit])
  
  const handleDelete = useCallback(async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    try {
      await onDelete?.(user.id)
    } finally {
      setIsDeleting(false)
    }
  }, [user.id, isDeleting, onDelete])
  
  // 渲染
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      
      <div className="mt-4 flex gap-2">
        <button 
          onClick={handleEdit}
          className="px-3 py-1 text-sm text-blue-600 hover:underline"
        >
          编辑
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {isDeleting ? '删除中...' : '删除'}
        </button>
      </div>
    </div>
  )
})

UserCard.displayName = 'UserCard'
```

---

## ✅ 生产级检查清单

### 性能优化

- [ ] 使用 `memo` 包装纯组件
- [ ] 使用 `useMemo` 缓存昂贵计算
- [ ] 使用 `useCallback` 缓存回调
- [ ] 避免内联对象/数组创建
- [ ] 使用 `React.lazy` 代码分割

### 代码质量

- [ ] 组件单一职责
- [ ] Props 类型完整
- [ ] 默认值合理
- [ ] 错误边界处理
- [ ] 可访问性支持

### 测试覆盖

- [ ] 渲染测试
- [ ] 交互测试
- [ ] 边界情况
- [ ] 异步操作

---

## 📚 参考资源

- [React 官方文档](https://react.dev/)
- [React Hooks 参考](https://react.dev/reference/react/hooks)
- [React 测试库](https://testing-library.com/docs/react-testing-library/intro/)

---

## 📚 相关技能

- `typescript` - TypeScript 开发
- `state-management` - 状态管理
- `testing-frontend` - 前端测试