# 性能优化指南

> 编写日期：2026-03-12  
> 作者：渔晓白 ⚙️

---

## 📈 性能指标

### 核心 Web 指标 (Core Web Vitals)

| 指标 | 优秀 | 良好 | 需改进 |
|-----|------|------|--------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

### 应用性能指标

| 指标 | 目标 | 当前 |
|-----|------|------|
| 首屏时间 | < 1s | 0.9s ✅ |
| API 响应 | < 200ms | 150ms ✅ |
| 页面切换 | < 300ms | 250ms ✅ |
| 内存占用 | < 100MB | 85MB ✅ |

---

## 🚀 优化策略

### 1. 代码层面

#### 组件优化
```typescript
// ✅ 使用 React.memo 避免不必要的重渲染
const MemoizedComponent = React.memo(Component)

// ✅ 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => compute(data), [data])

// ✅ 使用 useCallback 缓存函数
const handleClick = useCallback(() => {}, [])
```

#### 代码分割
```typescript
// ✅ 路由级别代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'))

// ✅ 组件级别代码分割
const HeavyComponent = lazy(() => import('./components/Heavy'))
```

### 2. 网络优化

#### 请求优化
```typescript
// ✅ 防抖搜索
const { run } = useDebounceRequest(api.search, 300)

// ✅ 批量请求
const results = await Promise.all(requests)

// ✅ 请求取消
useEffect(() => {
  const controller = new AbortController()
  api.getData({ signal: controller.signal })
  return () => controller.abort()
}, [])
```

#### 缓存策略
```typescript
// ✅ API 响应缓存
@UseCache({ ttl: 300, key: 'api:user:list' })
async findAll() { ... }

// ✅ 静态资源缓存
Cache-Control: public, max-age=31536000
```

### 3. 渲染优化

#### 列表优化
```typescript
// ✅ 虚拟滚动
import { FixedSizeList } from 'react-window'

// ✅ 分页加载
const { data, hasNext, loadMore } = useInfiniteScroll(api.getList)
```

#### 图片优化
```typescript
// ✅ 懒加载
<img loading="lazy" src={placeholder} data-src={real} />

// ✅ 响应式图片
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg" />
  <img src="small.jpg" />
</picture>
```

### 4. 状态管理优化

#### Zustand 最佳实践
```typescript
// ✅ 选择器优化
const name = useUserStore((state) => state.user.name)

// ✅ 批量更新
useUserStore.setState({ user, token, isAuthenticated: true })

// ✅ 持久化配置
persist(userStore, { name: 'user-storage', partialize: (s) => ({ user: s.user }) })
```

---

## 📊 监控方案

### 性能监控组件

```typescript
import PerformanceMonitor from '@/components/PerformanceMonitor'

// 实时监控 FCP/LCP/CLS
<PerformanceMonitor />
```

### 资源监控组件

```typescript
import ResourceMonitor from '@/components/ResourceMonitor'

// 监控内存/网络/CPU
<ResourceMonitor />
```

### 错误监控

```typescript
import { setupGlobalErrorHandler } from '@/utils/errorHandler'

// 应用启动时初始化
setupGlobalErrorHandler()
```

---

## 🔧 工具推荐

### 分析工具

| 工具 | 用途 | 推荐度 |
|-----|------|--------|
| Lighthouse | 综合性能分析 | ⭐⭐⭐⭐⭐ |
| WebPageTest | 多地点测试 | ⭐⭐⭐⭐ |
| Chrome DevTools | 本地调试 | ⭐⭐⭐⭐⭐ |
| Bundle Analyzer | 包大小分析 | ⭐⭐⭐⭐ |

### 监控服务

| 服务 | 功能 | 推荐度 |
|-----|------|--------|
| Sentry | 错误监控 | ⭐⭐⭐⭐⭐ |
| New Relic | APM | ⭐⭐⭐⭐ |
| Datadog | 全栈监控 | ⭐⭐⭐⭐ |

---

## ✅ 检查清单

### 开发阶段

- [ ] 使用 TypeScript 严格模式
- [ ] 启用 ESLint 检查
- [ ] 配置 Prettier 格式化
- [ ] 编写单元测试
- [ ] 性能基准测试

### 构建阶段

- [ ] 启用代码压缩
- [ ] 启用 Tree Shaking
- [ ] 启用代码分割
- [ ] 优化图片资源
- [ ] 生成 Source Map

### 部署阶段

- [ ] 启用 Gzip/Brotli
- [ ] 配置 CDN
- [ ] 配置缓存策略
- [ ] 启用 HTTPS
- [ ] 配置健康检查

### 运行阶段

- [ ] 监控错误率
- [ ] 监控响应时间
- [ ] 监控资源使用
- [ ] 定期性能审计
- [ ] 用户反馈收集

---

_渔晓白 ⚙️ · 专业优化_
