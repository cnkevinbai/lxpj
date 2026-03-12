# ERP 前端开发文档

> 详细开发指南和 API 接口文档

## 📖 目录

1. [项目架构](#项目架构)
2. [组件开发](#组件开发)
3. [API 接口](#api 接口)
4. [类型定义](#类型定义)
5. [样式规范](#样式规范)

---

## 项目架构

### 技术选型

| 技术 | 版本 | 用途 |
|-----|------|------|
| React | 18.2.0 | UI 框架 |
| TypeScript | 5.3.2 | 类型系统 |
| Ant Design | 5.12.0 | UI 组件库 |
| Vite | 5.0.4 | 构建工具 |
| React Router | 6.20.0 | 路由管理 |
| Axios | 1.6.2 | HTTP 客户端 |

### 目录结构详解

```
src/
├── components/        # 公共组件
│   └── Layout/       # 主布局 (侧边栏 + 顶栏 + 内容区)
├── pages/            # 页面组件
│   ├── Login/        # 登录页面
│   ├── Dashboard/    # 仪表盘
│   ├── purchase/     # 采购管理 (3 个页面)
│   ├── inventory/    # 库存管理 (3 个页面)
│   ├── production/   # 生产管理 (2 个页面)
│   └── finance/      # 财务管理 (3 个页面)
├── services/         # 服务层
│   └── api.ts        # API 封装和拦截器
├── types/            # TypeScript 类型定义
│   └── index.ts      # 所有类型导出
├── App.tsx           # 应用根组件 (路由配置)
├── main.tsx          # 应用入口
└── index.css         # 全局样式
```

---

## 组件开发

### Layout 布局组件

**位置**: `src/components/Layout/index.tsx`

**功能**:
- 响应式侧边栏
- 顶部导航栏
- 菜单路由
- 用户信息和登出

**使用示例**:
```tsx
import Layout from './components/Layout'

// 所有受保护的路由都使用 Layout 包裹
```

### 页面组件规范

每个页面组件应该：

1. **独立文件**: 每个页面一个文件夹，包含 `index.tsx`
2. **类型安全**: 使用 TypeScript 定义 props 和 state
3. **API 调用**: 通过 `services/api.ts` 统一调用
4. **错误处理**: 使用 try-catch 和 message 提示

**示例结构**:
```tsx
import { useState } from 'react'
import { Card, Table, Button } from 'antd'
import { xxxApi } from '../../services/api'

export default function XxxPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const handleXxx = async () => {
    try {
      setLoading(true)
      await xxxApi.doSomething()
    } catch (error) {
      // 错误处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 页面内容 */}
    </div>
  )
}
```

---

## API 接口

### 基础配置

**文件**: `src/services/api.ts`

```typescript
const API_BASE_URL = '/api/erp'

// axios 实例配置
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器 - 自动添加 Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('erp_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### API 接口列表

#### 认证接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| POST | `/auth/login` | 用户登录 |
| POST | `/auth/logout` | 用户登出 |
| GET | `/auth/me` | 获取当前用户 |

#### 采购接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/purchase` | 获取采购列表 |
| POST | `/purchase` | 创建采购订单 |
| GET | `/purchase/:id` | 获取采购详情 |
| PUT | `/purchase/:id` | 更新采购订单 |
| DELETE | `/purchase/:id` | 删除采购订单 |
| POST | `/purchase/:id/approve` | 审批采购 |

#### 库存接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/inventory` | 获取库存列表 |
| POST | `/inventory/in` | 入库操作 |
| POST | `/inventory/out` | 出库操作 |
| POST | `/inventory/adjust` | 库存调整 |
| GET | `/inventory/stock/:sku` | 获取 SKU 库存 |

#### 生产接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/production/plan` | 获取生产计划列表 |
| POST | `/production/plan` | 创建生产计划 |
| GET | `/production/task` | 获取生产任务列表 |
| POST | `/production/task` | 创建生产任务 |
| PUT | `/production/task/:id/status` | 更新任务状态 |

#### 财务接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/finance/overview` | 获取财务总览 |
| GET | `/finance/receive` | 获取收款列表 |
| POST | `/finance/receive` | 创建收款记录 |
| GET | `/finance/pay` | 获取付款列表 |
| POST | `/finance/pay` | 创建付款记录 |
| GET | `/finance/statistics` | 获取统计数据 |

---

## 类型定义

**文件**: `src/types/index.ts`

### 通用类型

```typescript
// API 响应
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// 用户
export interface User {
  id: string
  username: string
  name: string
  role: string
  department: string
}
```

### 业务类型

详细类型定义见 `src/types/index.ts`，包括：

- `PurchaseOrder` - 采购订单
- `PurchaseItem` - 采购项
- `Inventory` - 库存
- `InventoryIn` - 入库单
- `InventoryOut` - 出库单
- `ProductionPlan` - 生产计划
- `ProductionTask` - 生产任务
- `FinanceReceive` - 收款单
- `FinancePay` - 付款单
- `DashboardStats` - 仪表盘统计

---

## 样式规范

### 全局样式

**文件**: `src/index.css`

```css
/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 工具类 */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-16 { margin-top: 16px; }
.mb-16 { margin-bottom: 16px; }
```

### 组件样式

优先使用 Ant Design 的 `style` prop 内联样式：

```tsx
<Card style={{ marginBottom: 16 }}>
  <div className="flex-between">
    <h1>标题</h1>
    <Button type="primary">操作</Button>
  </div>
</Card>
```

### 响应式设计

使用 Ant Design 的 Grid 系统：

```tsx
import { Row, Col } from 'antd'

<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={6}>
    <Card>内容</Card>
  </Col>
</Row>
```

---

## 最佳实践

### 1. 错误处理

```tsx
try {
  await api.call()
  message.success('操作成功')
} catch (error) {
  message.error('操作失败')
}
```

### 2. 加载状态

```tsx
const [loading, setLoading] = useState(false)

<Button loading={loading} onClick={handleClick}>
  提交
</Button>
```

### 3. 表单验证

```tsx
<Form.Item
  name="username"
  rules={[
    { required: true, message: '请输入用户名' },
    { min: 3, message: '用户名至少 3 个字符' }
  ]}
>
  <Input />
</Form.Item>
```

### 4. 表格分页

```tsx
<Table
  pagination={{
    pageSize: 10,
    showTotal: (total) => `共 ${total} 条`,
    showSizeChanger: true,
  }}
/>
```

---

## 部署指南

### 生产构建

```bash
npm run build
```

输出目录：`dist/`

### 环境变量

创建 `.env.production`:

```env
VITE_API_BASE_URL=https://api.example.com/erp
VITE_APP_TITLE=道达智能 ERP
```

### Docker 部署

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

_渔晓白 ⚙️ · 专业交付_
