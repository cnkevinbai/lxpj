# EV Cart CRM 前端开发规范

> 前端开发指南 - React 18 + TypeScript + Ant Design 5

## 📁 项目结构

```
crm/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Finance.tsx
│   │   └── ...
│   ├── layout/             # 布局组件
│   │   └── Layout.tsx
│   ├── components/         # 公共组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── utils/              # 工具函数
│   │   ├── request.ts      # HTTP 请求
│   │   └── index.ts        # 通用工具
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
├── public/                 # 静态资源
└── package.json
```

## 🎨 开发规范

### 1. 组件命名
- 使用 PascalCase（大驼峰）
- 文件名为组件名.tsx

```typescript
// ✅ 正确
const DealerList: React.FC = () => {}

// ❌ 错误
const dealerList: React.FC = () => {}
```

### 2. Props 类型定义
- 使用 interface 定义 Props
- 明确标注可选属性

```typescript
interface DealerListProps {
  onDealerSelect?: (dealerId: string) => void
  showActions?: boolean
}
```

### 3. 状态管理
- 使用 useState 管理本地状态
- 复杂状态使用 useReducer
- 全局状态使用 Context 或 Redux

### 4. 副作用处理
- 使用 useEffect 处理副作用
- 注意清理函数
- 正确设置依赖数组

```typescript
useEffect(() => {
  fetchData()
  return () => {
    // 清理
  }
}, [dependency])
```

### 5. 事件处理
- 使用 useCallback 缓存事件处理函数
- 避免内联函数造成重复渲染

```typescript
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependencies])
```

### 6. 样式规范
- 优先使用 Ant Design 组件
- 自定义样式使用 CSS Modules 或 styled-components
- 遵循设计系统颜色规范

### 7. 错误处理
- 使用 Error Boundary 捕获错误
- API 请求统一错误处理
- 用户友好的错误提示

### 8. 性能优化
- 使用 React.memo 优化组件渲染
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存函数
- 列表渲染使用 key

## 📝 代码提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 🚀 最佳实践

### 1. 组件拆分
- 单一职责原则
- 组件不宜过大（<300 行）
- 提取公共逻辑为 Hooks

### 2. 代码复用
- 提取公共组件
- 使用自定义 Hooks
- 使用 render props 或 HOC

### 3. 类型安全
- 使用 TypeScript
- 避免使用 any
- 定义清晰的接口

### 4. 可访问性
- 使用语义化标签
- 添加 aria 属性
- 支持键盘导航

## 📊 性能指标

- 首屏加载 < 2s
- 页面交互响应 < 100ms
- Lighthouse 评分 > 90

## 🔧 开发工具

- ESLint - 代码检查
- Prettier - 代码格式化
- TypeScript - 类型检查

## 📞 联系方式

- 邮箱：dev@evcart.com
- 文档：https://docs.evcart.com
