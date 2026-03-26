# 前端测试技能（强化版）

## 📋 技能说明

使用 React Testing Library 和 Jest 进行专业的前端测试，遵循"测试用户行为而非实现细节"原则。

---

## 🎯 核心原则

> The more your tests resemble the way your software is used, the more confidence they can give you.

**测试用户行为，而非实现细节**

---

## 📝 查询优先级

React Testing Library 推荐的查询优先级：

```typescript
// 1. getByRole - 最推荐（可访问性）
screen.getByRole('button', { name: '提交' })
screen.getByRole('textbox', { name: /邮箱/i })

// 2. getByLabelText - 表单元素
screen.getByLabelText('用户名')

// 3. getByPlaceholderText - 输入框
screen.getByPlaceholderText('请输入邮箱')

// 4. getByText - 文本内容
screen.getByText('欢迎使用')

// 5. getByTestId - 最后手段（data-testid）
screen.getByTestId('submit-button')
```

---

## 📝 测试模板

### 组件渲染测试

```typescript
import { render, screen } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com'
  }

  it('应该正确渲染用户信息', () => {
    render(<UserCard user={mockUser} />)
    
    // 验证文本内容
    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument()
  })
})
```

### 交互测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('应该成功提交表单', async () => {
    const mockOnSubmit = jest.fn()
    const user = userEvent.setup()
    
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    // 填写表单（模拟用户行为）
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'password123')
    await user.click(screen.getByRole('button', { name: '登录' }))
    
    // 验证回调被调用
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('应该显示验证错误', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)
    
    // 提交空表单
    await user.click(screen.getByRole('button', { name: '登录' }))
    
    // 验证错误信息
    expect(await screen.findByText('请输入邮箱')).toBeInTheDocument()
    expect(screen.getByText('请输入密码')).toBeInTheDocument()
  })
})
```

### 异步操作测试

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  it('应该加载并显示用户数据', async () => {
    // Mock API
    jest.spyOn(api, 'getUser').mockResolvedValue({
      id: '1',
      name: '张三'
    })
    
    render(<UserProfile userId="1" />)
    
    // 加载状态
    expect(screen.getByText('加载中...')).toBeInTheDocument()
    
    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument()
    })
    
    // 加载状态消失
    expect(screen.queryByText('加载中...')).not.toBeInTheDocument()
  })
})
```

### Hooks 测试

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('应该正确初始化和更新', () => {
    const { result } = renderHook(() => useCounter(0))
    
    // 初始值
    expect(result.current.count).toBe(0)
    
    // 增加
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
    
    // 减少
    act(() => {
      result.current.decrement()
    })
    expect(result.current.count).toBe(0)
  })
})
```

---

## ✅ 测试最佳实践

### AAA 模式

```typescript
it('测试描述', () => {
  // Arrange（准备）
  const props = { ... }
  render(<Component {...props} />)
  
  // Act（操作）
  fireEvent.click(screen.getByRole('button'))
  
  // Assert（断言）
  expect(screen.getByText('结果')).toBeInTheDocument()
})
```

### 避免测试实现细节

```typescript
// ❌ 不推荐：测试组件状态
expect(component.state.isLoading).toBe(true)

// ✅ 推荐：测试用户可见的行为
expect(screen.getByText('加载中...')).toBeInTheDocument()
```

### 使用 userEvent 而非 fireEvent

```typescript
// ❌ fireEvent 不模拟完整交互
fireEvent.click(button)

// ✅ userEvent 更接近真实用户行为
await user.click(button)  // 包含焦点、悬停等
await user.type(input, 'text')  // 逐字符输入
```

---

## 📚 参考资源

- [React Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library 查询优先级](https://testing-library.com/docs/queries/about/)
- [Jest 文档](https://jestjs.io/docs/getting-started)

---

## 📚 相关技能

- `react-component` - React 组件开发
- `e2e-test` - E2E 测试