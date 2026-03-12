# ERP 前端管理系统

> 道达智能 ERP 前端 - React + TypeScript + Ant Design

## 📊 项目信息

- **技术栈**: React 18 + TypeScript + Ant Design 5 + Vite
- **端口**: 3003
- **API 代理**: http://localhost:3002 (ERP 后端)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问：http://localhost:3003

### 生产构建

```bash
npm run build
```

### 预览构建

```bash
npm run preview
```

## 📁 项目结构

```
erp-frontend/
├── src/
│   ├── components/          # 公共组件
│   │   └── Layout/          # 布局组件
│   ├── pages/               # 页面组件
│   │   ├── Login/           # 登录页
│   │   ├── Dashboard/       # 仪表盘
│   │   ├── purchase/        # 采购管理
│   │   ├── inventory/       # 库存管理
│   │   ├── production/      # 生产管理
│   │   └── finance/         # 财务管理
│   ├── services/            # API 服务
│   │   └── api.ts           # API 封装
│   ├── types/               # TypeScript 类型
│   │   └── index.ts
│   ├── App.tsx              # 应用入口
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📋 功能模块

### 1. 登录认证
- 用户名密码登录
- JWT Token 认证
- 自动登录状态保持

### 2. 仪表盘
- 核心指标展示
- 采购订单统计
- 库存预警
- 财务数据总览

### 3. 采购管理
- 采购列表查询
- 新建采购订单
- 采购订单详情
- 采购审批流程

### 4. 库存管理
- 库存列表查询
- 入库管理
- 出库管理
- 库存预警提示

### 5. 生产管理
- 生产计划管理
- 生产任务分配
- 任务状态跟踪

### 6. 财务管理
- 财务总览
- 收款管理
- 付款管理
- 交易记录查询

## 🔌 API 接口

所有 API 请求通过 `/api/erp` 代理到后端服务：

| 模块 | 基础路径 | 说明 |
|-----|---------|------|
| 认证 | `/api/erp/auth` | 登录、登出 |
| 采购 | `/api/erp/purchase` | 采购订单管理 |
| 库存 | `/api/erp/inventory` | 库存管理 |
| 生产 | `/api/erp/production` | 生产管理 |
| 财务 | `/api/erp/finance` | 财务管理 |

## 🎨 设计规范

- **主色调**: `#1677ff` (Ant Design 默认蓝)
- **圆角**: `6px`
- **字体**: 系统字体栈，优先使用苹方、微软雅黑

## 📝 开发规范

### 组件命名

- 页面组件：PascalCase (如 `PurchaseList.tsx`)
- 组件目录：PascalCase (如 `components/Layout/`)

### 状态管理

- 使用 React Hooks 管理本地状态
- 复杂状态考虑使用 Zustand 或 Redux

### API 调用

- 所有 API 调用封装在 `services/api.ts`
- 使用统一的请求拦截器处理 Token

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=/api/erp
VITE_APP_TITLE=道达智能 ERP
```

### 代理配置

修改 `vite.config.ts` 中的代理目标地址。

## 📊 代码统计

| 项目 | 数量 |
|-----|------|
| 页面组件 | 12 |
| 公共组件 | 1 |
| API 接口 | 20+ |
| TypeScript 类型 | 15+ |
| 代码行数 | ~2000 |

## 🦞 开发者

渔晓白 ⚙️ - AI 系统构建者

---

_道达智能 · 版权所有_
