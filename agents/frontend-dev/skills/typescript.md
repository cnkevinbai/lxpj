# TypeScript 开发技能

## 📋 技能说明

使用 TypeScript 进行类型安全的开发，编写高质量、可维护的代码。

---

## 🎯 适用场景

- TypeScript 类型定义
- 泛型编程
- 类型守卫和断言
- 装饰器开发

---

## 📝 类型定义规范

### 基础类型

```typescript
// 基本类型
type ID = string
type Age = number
type Email = string

// 联合类型
type Status = 'pending' | 'active' | 'inactive'
type Role = 'admin' | 'user' | 'guest'

// 交叉类型
type User = {
  id: ID
  name: string
} & {
  email: Email
  role: Role
}
```

### 接口定义

```typescript
// 响应接口
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页接口
interface PagedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

// 组件 Props
interface ComponentProps {
  // 必填
  id: string
  name: string
  // 可选
  description?: string
  // 回调
  onChange?: (value: string) => void
}
```

### 泛型使用

```typescript
// 泛型函数
function createResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 0,
    message: 'success',
    data,
    timestamp: Date.now()
  }
}

// 泛型接口
interface Repository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(entity: Omit<T, 'id'>): Promise<T>
  update(id: string, entity: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// 泛型约束
interface WithId {
  id: string
}

function updateEntity<T extends WithId>(entity: T, updates: Partial<T>): T {
  return { ...entity, ...updates }
}
```

### 类型守卫

```typescript
// 类型谓词
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' 
    && obj !== null 
    && 'id' in obj 
    && 'name' in obj
}

// 使用
function process(data: unknown) {
  if (isUser(data)) {
    // data 类型为 User
    console.log(data.name)
  }
}
```

---

## ✅ 检查清单

- [ ] 避免使用 any
- [ ] 使用严格模式
- [ ] 类型定义完整
- [ ] 导出类型供复用
- [ ] 使用泛型提高复用性

---

## 📚 相关技能

- `react-component` - React 组件开发
- `nestjs-api` - NestJS API 开发