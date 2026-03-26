# 道达智能数字化平台 - 企业内部管理系统技术架构设计文档

> **版本**: v1.0  
> **设计日期**: 2026-03-19  
> **项目名称**: 道达智能企业内部管理系统（统一门户）  
> **技术栈**: React 18 + TypeScript + Vite + Ant Design Pro 5

---

## 一、项目概述

### 1.1 项目定位

企业内部管理系统是道达智能数字化平台的核心业务系统，集成ERP、CRM、售后服务、MES、财务管理、权限管理、工作流等核心模块，为企业内部员工提供统一的数字化工作平台。

### 1.2 设计目标

```
┌─────────────────────────────────────────────────────────────────┐
│                   内部管理系统设计目标                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔗 系统集成                                                    │
│     • 统一门户入口                                              │
│     • 单点登录(SSO)                                             │
│     • 统一权限管理                                              │
│     • 统一消息中心                                              │
│                                                                 │
│  🎯 业务支撑                                                    │
│     • 全业务流程覆盖                                            │
│     • 实时数据展示                                              │
│     • 智能分析决策                                              │
│     • 移动办公支持                                              │
│                                                                 │
│  ⚡ 高性能                                                      │
│     • 页面加载 < 2秒                                            │
│     • 接口响应 < 500ms                                          │
│     • 支持万级并发                                              │
│                                                                 │
│  🔒 安全合规                                                    │
│     • RBAC权限控制                                              │
│     • 数据权限隔离                                              │
│     • 操作审计日志                                              │
│     • 数据加密传输                                              │
│                                                                 │
│  📱 多端适配                                                    │
│     • PC端完整功能                                              │
│     • 移动端核心功能                                            │
│     • 与APP数据同步                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 技术选型对比

| 技术选型 | 方案 | 备选方案 | 选型理由 |
|----------|------|----------|----------|
| **框架** | React 18 | Vue 3 | 生态成熟，团队熟悉 |
| **语言** | TypeScript | JavaScript | 类型安全 |
| **构建** | Vite 5 | Webpack | 开发体验好 |
| **UI框架** | Ant Design Pro 5 | Arco Design Pro | 企业级方案成熟 |
| **状态** | Zustand + React Query | Redux Toolkit | 轻量高效 |
| **路由** | React Router 6 | UmiJS | 灵活可控 |
| **表单** | ProComponents | Formily | 与Ant Design Pro一致 |
| **表格** | ProTable | AG Grid | 功能完整 |
| **图表** | ECharts 5 | BizCharts | 功能强大 |
| **编辑器** | Slate.js | Quill | 可扩展性强 |

---

## 二、系统架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      道达智能企业内部管理系统架构                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        客户端层 (Client)                        │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐                       │   │
│  │   │ PC浏览器 │  │ 移动浏览器│  │ 鸿蒙APP │                       │   │
│  │   └─────────┘  └─────────┘  └─────────┘                       │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      接入层 (Access Layer)                      │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    API Gateway (Kong/APISIX)            │  │   │
│  │   │                                                         │  │   │
│  │   │  • 统一入口        • 限流熔断        • 认证鉴权         │  │   │
│  │   │  • 路由转发        • 负载均衡        • 请求日志         │  │   │
│  │   │  • 协议转换        • 安全防护        • 灰度发布         │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      前端应用层 (Frontend)                       │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │              Portal SPA (React + Ant Design Pro)        │  │   │
│  │   │                                                         │  │   │
│  │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │  │   │
│  │   │  │ 工作台  │ │ 客户中心│ │ 运营中心│ │ 财务中心│      │  │   │
│  │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │  │   │
│  │   │                                                         │  │   │
│  │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │  │   │
│  │   │  │ 服务中  │ │ 人力资源│ │ 系统管理│ │ 数据分析│      │  │   │
│  │   │  │   心    │ │         │ │         │ │         │      │  │   │
│  │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      业务服务层 (Services)                      │   │
│  │                                                                 │   │
│  │   ┌──────────────────────────────────────────────────────────┐ │   │
│  │   │                    业务微服务集群                         │ │   │
│  │   │                                                         │ │   │
│  │   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │ │   │
│  │   │  │ Auth   │ │  CRM   │ │  ERP   │ │Service │           │ │   │
│  │   │  │ Service│ │ Service│ │ Service│ │ Service│           │ │   │
│  │   │  └────────┘ └────────┘ └────────┘ └────────┘           │ │   │
│  │   │                                                         │ │   │
│  │   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │ │   │
│  │   │  │  MES   │ │Finance │ │Workflow│ │  BI    │           │ │   │
│  │   │  │ Service│ │ Service│ │ Service│ │ Service│           │ │   │
│  │   │  └────────┘ └────────┘ └────────┘ └────────┘           │ │   │
│  │   │                                                         │ │   │
│  │   │  ┌────────┐ ┌────────┐ ┌────────┐                      │ │   │
│  │   │  │  SRM   │ │ Message│ │ Report │                      │ │   │
│  │   │  │ Service│ │ Service│ │ Service│                      │ │   │
│  │   │  └────────┘ └────────┘ └────────┘                      │ │   │
│  │   │                                                         │ │   │
│  │   │  技术栈: NestJS 10 + TypeScript + Prisma + gRPC        │ │   │
│  │   │                                                         │ │   │
│  │   └──────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      中间件层 (Middleware)                      │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │  Redis    │  │ RabbitMQ  │  │ElasticSearch│                │   │
│  │   │ 缓存/会话  │  │ 消息队列  │  │  搜索引擎   │                │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      数据存储层 (Data)                          │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │PostgreSQL │  │ ClickHouse│  │   MinIO   │                 │   │
│  │   │  主数据库  │  │ 分析数据库│  │ 文件存储  │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 前端架构设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        前端应用架构                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       应用入口 (Entry)                          │   │
│  │                                                                 │   │
│  │   main.tsx                                                      │   │
│  │     └── app.tsx                                                 │   │
│  │           ├── AppProvider (全局Provider)                        │   │
│  │           ├── Router (路由配置)                                 │   │
│  │           ├── Access (权限控制)                                │   │
│  │           └── Layout (布局框架)                                │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       核心层 (Core)                             │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Router    │  │   Store     │  │   API       │           │   │
│  │   │   路由管理   │  │   状态管理   │  │   接口封装   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Access    │  │   Hooks     │  │   Utils     │           │   │
│  │   │   权限控制   │  │   自定义Hook │  │   工具函数   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       业务模块层 (Modules)                      │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   CRM       │  │   ERP       │  │  Service    │           │   │
│  │   │   客户中心   │  │   运营中心   │  │   服务中心   │           │   │
│  │   │             │  │             │  │             │           │   │
│  │   │ • 客户管理   │  │ • 采购管理   │  │ • 工单管理   │           │   │
│  │   │ • 线索管理   │  │ • 库存管理   │  │ • 合同管理   │           │   │
│  │   │ • 商机管理   │  │ • 生产管理   │  │ • 配件管理   │           │   │
│  │   │ • 订单管理   │  │ • 质量管理   │  │ • 知识库    │           │   │
│  │   │ • 销售分析   │  │ • 设备管理   │  │ • 服务统计   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Finance   │  │    HR       │  │   System    │           │   │
│  │   │   财务中心   │  │   人力资源   │  │   系统管理   │           │   │
│  │   │             │  │             │  │             │           │   │
│  │   │ • 总账管理   │  │ • 员工管理   │  │ • 用户管理   │           │   │
│  │   │ • 应收应付   │  │ • 考勤管理   │  │ • 角色权限   │           │   │
│  │   │ • 固定资产   │  │ • 薪酬管理   │  │ • 组织架构   │           │   │
│  │   │ • 成本管理   │  │ • 绩效管理   │  │ • 菜单管理   │           │   │
│  │   │ • 预算管理   │  │ • 培训管理   │  │ • 日志管理   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐                            │   │
│  │   │    MES      │  │    BI       │                            │   │
│  │   │   生产执行   │  │   数据分析   │                            │   │
│  │   │             │  │             │                            │   │
│  │   │ • 计划管理   │  │ • 报表中心   │                            │   │
│  │   │ • 工单管理   │  │ • 仪表盘    │                            │   │
│  │   │ • 工序管理   │  │ • 数据大屏   │                            │   │
│  │   │ • 质量追溯   │  │ • 智能预警   │                            │   │
│  │   └─────────────┘  └─────────────┘                            │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       公共层 (Common)                           │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    组件库 (Components)                   │  │   │
│  │   │                                                         │  │   │
│  │   │  基础组件: Button, Icon, Image, Link, Modal...         │  │   │
│  │   │  业务组件: SearchForm, DataTable, DetailPage...        │  │   │
│  │   │  布局组件: MainLayout, BlankLayout...                  │  │   │
│  │   │  图表组件: LineChart, BarChart, PieChart...            │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    服务层 (Services)                     │  │   │
│  │   │                                                         │  │   │
│  │   │  CustomerService, OrderService, ProductService...       │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 三、目录结构设计

### 3.1 项目目录结构

```
portal/
├── public/                          # 静态资源
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── main.tsx                     # 应用入口
│   ├── app.tsx                      # 根组件
│   ├── global.less                  # 全局样式
│   │
│   ├── api/                         # API接口
│   │   ├── index.ts
│   │   ├── request.ts               # Axios封装
│   │   ├── auth.ts                  # 认证接口
│   │   ├── customer.ts              # 客户接口
│   │   ├── order.ts                 # 订单接口
│   │   ├── product.ts               # 产品接口
│   │   ├── purchase.ts              # 采购接口
│   │   ├── inventory.ts             # 库存接口
│   │   ├── workflow.ts              # 工作流接口
│   │   ├── report.ts                # 报表接口
│   │   └── system.ts                # 系统接口
│   │
│   ├── assets/                      # 静态资源
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                  # 组件
│   │   ├── common/                  # 通用组件
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   ├── Breadcrumb/
│   │   │   ├── Loading/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── EmptyState/
│   │   │   ├── ConfirmModal/
│   │   │   ├── ExportButton/
│   │   │   ├── ImportButton/
│   │   │   └── PrintButton/
│   │   │
│   │   ├── business/                # 业务组件
│   │   │   ├── CustomerSelect/      # 客户选择器
│   │   │   ├── ProductSelect/       # 产品选择器
│   │   │   ├── EmployeeSelect/      # 员工选择器
│   │   │   ├── DepartmentSelect/    # 部门选择器
│   │   │   ├── OrganizationTree/    # 组织树
│   │   │   ├── SearchForm/          # 搜索表单
│   │   │   ├── DataTable/           # 数据表格
│   │   │   ├── DetailPage/          # 详情页面
│   │   │   ├── AuditHistory/        # 审批历史
│   │   │   ├── AttachmentUpload/    # 附件上传
│   │   │   ├── CommentSection/      # 评论区域
│   │   │   └── TimelineView/        # 时间线
│   │   │
│   │   ├── charts/                  # 图表组件
│   │   │   ├── LineChart/
│   │   │   ├── BarChart/
│   │   │   ├── PieChart/
│   │   │   ├── GaugeChart/
│   │   │   ├── TreeMap/
│   │   │   └── MapChart/
│   │   │
│   │   └── layout/                  # 布局组件
│   │       ├── MainLayout/
│   │       ├── BlankLayout/
│   │       └── RouteLayout/
│   │
│   ├── config/                      # 配置
│   │   ├── index.ts                 # 主配置
│   │   ├── routes.tsx               # 路由配置
│   │   ├── menu.tsx                 # 菜单配置
│   │   └── constants.ts             # 常量配置
│   │
│   ├── hooks/                       # 自定义Hooks
│   │   ├── useRequest.ts
│   │   ├── useTable.ts
│   │   ├── useForm.ts
│   │   ├── useModal.ts
│   │   ├── useAccess.ts
│   │   ├── useSearchParams.ts
│   │   └── useDownload.ts
│   │
│   ├── layouts/                     # 布局
│   │   ├── MainLayout/
│   │   │   ├── index.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sider.tsx
│   │   │   ├── Content.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.module.less
│   │   └── BlankLayout/
│   │
│   ├── models/                      # 数据模型
│   │   ├── Customer.ts
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   └── Common.ts
│   │
│   ├── pages/                       # 页面
│   │   ├── dashboard/               # 工作台
│   │   │   ├── index.tsx
│   │   │   ├── Workbench.tsx
│   │   │   ├── Statistics.tsx
│   │   │   └── index.module.less
│   │   │
│   │   ├── crm/                     # 客户中心
│   │   │   ├── customer/            # 客户管理
│   │   │   │   ├── index.tsx        # 列表页
│   │   │   │   ├── Detail.tsx       # 详情页
│   │   │   │   ├── Form.tsx         # 表单页
│   │   │   │   └── index.module.less
│   │   │   ├── lead/                # 线索管理
│   │   │   ├── opportunity/          # 商机管理
│   │   │   ├── order/               # 订单管理
│   │   │   ├── contract/            # 合同管理
│   │   │   └── analysis/            # 销售分析
│   │   │
│   │   ├── erp/                     # 运营中心
│   │   │   ├── purchase/            # 采购管理
│   │   │   │   ├── request/         # 请购单
│   │   │   │   ├── order/           # 采购订单
│   │   │   │   ├── receiving/       # 入库管理
│   │   │   │   └── return/          # 退货管理
│   │   │   ├── inventory/          # 库存管理
│   │   │   │   ├── stock/           # 库存查询
│   │   │   │   ├── movement/        # 库存变动
│   │   │   │   ├── check/           # 库存盘点
│   │   │   │   └── warning/         # 库存预警
│   │   │   ├── production/          # 生产管理
│   │   │   ├── quality/             # 质量管理
│   │   │   └── equipment/           # 设备管理
│   │   │
│   │   ├── service/                 # 服务中心
│   │   │   ├── workorder/          # 工单管理
│   │   │   │   ├── index.tsx
│   │   │   │   ├── Detail.tsx
│   │   │   │   └── Form.tsx
│   │   │   ├── contract/           # 服务合同
│   │   │   ├── parts/              # 配件管理
│   │   │   ├── knowledge/          # 知识库
│   │   │   └── feedback/           # 客户反馈
│   │   │
│   │   ├── mes/                     # 生产执行
│   │   │   ├── plan/               # 计划管理
│   │   │   ├── workorder/          # 生产工单
│   │   │   ├── process/            # 工序管理
│   │   │   └── trace/              # 质量追溯
│   │   │
│   │   ├── finance/                 # 财务中心
│   │   │   ├── gl/                 # 总账管理
│   │   │   ├── ar/                 # 应收管理
│   │   │   ├── ap/                 # 应付管理
│   │   │   ├── asset/              # 固定资产
│   │   │   ├── cost/               # 成本管理
│   │   │   └── budget/             # 预算管理
│   │   │
│   │   ├── hr/                      # 人力资源
│   │   │   ├── employee/           # 员工管理
│   │   │   ├── attendance/         # 考勤管理
│   │   │   ├── salary/             # 薪酬管理
│   │   │   ├── performance/        # 绩效管理
│   │   │   └── training/           # 培训管理
│   │   │
│   │   ├── srm/                     # 供应商管理
│   │   │   ├── supplier/           # 供应商管理
│   │   │   ├── inquiry/            # 询比价
│   │   │   ├── performance/        # 绩效管理
│   │   │   └── contract/           # 合同管理
│   │   │
│   │   ├── bi/                      # 数据分析
│   │   │   ├── report/             # 报表中心
│   │   │   ├── dashboard/          # 仪表盘
│   │   │   ├── screen/             # 数据大屏
│   │   │   └── alert/              # 智能预警
│   │   │
│   │   ├── workflow/                # 工作流
│   │   │   ├── todo/               # 待办任务
│   │   │   ├── done/               # 已办任务
│   │   │   ├── mine/               # 我发起的
│   │   │   └── definition/         # 流程定义
│   │   │
│   │   ├── system/                  # 系统管理
│   │   │   ├── user/               # 用户管理
│   │   │   ├── role/               # 角色管理
│   │   │   ├── permission/         # 权限管理
│   │   │   ├── menu/               # 菜单管理
│   │   │   ├── organization/       # 组织管理
│   │   │   ├── position/           # 岗位管理
│   │   │   ├── dictionary/         # 数据字典
│   │   │   ├── config/             # 系统配置
│   │   │   └── log/                # 日志管理
│   │   │
│   │   ├── message/                 # 消息中心
│   │   │   ├── notification/       # 通知公告
│   │   │   ├── message/            # 站内消息
│   │   │   └── todo/               # 待办提醒
│   │   │
│   │   ├── profile/                 # 个人中心
│   │   │   ├── index.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Password.tsx
│   │   │
│   │   ├── login/                   # 登录
│   │   │   ├── index.tsx
│   │   │   └── index.module.less
│   │   │
│   │   └── error/                   # 错误页面
│   │       ├── 403.tsx
│   │       ├── 404.tsx
│   │       └── 500.tsx
│   │
│   ├── router/                      # 路由
│   │   ├── index.tsx
│   │   ├── routes.tsx
│   │   └── guards.tsx
│   │
│   ├── services/                    # 服务层
│   │   ├── CustomerService.ts
│   │   ├── OrderService.ts
│   │   ├── ProductService.ts
│   │   └── CommonService.ts
│   │
│   ├── store/                       # 状态管理
│   │   ├── index.ts
│   │   ├── useUserStore.ts
│   │   ├── useAppStore.ts
│   │   ├── useAccessStore.ts
│   │   └── useSettingStore.ts
│   │
│   ├── styles/                      # 样式
│   │   ├── index.less
│   │   ├── variables.less
│   │   └── mixins.less
│   │
│   ├── types/                       # 类型定义
│   │   ├── index.d.ts
│   │   ├── api.d.ts
│   │   ├── models.d.ts
│   │   └── components.d.ts
│   │
│   ├── utils/                       # 工具函数
│   │   ├── index.ts
│   │   ├── format.ts
│   │   ├── storage.ts
│   │   ├── validator.ts
│   │   ├── auth.ts
│   │   ├── permission.ts
│   │   └── download.ts
│   │
│   └── access/                      # 权限控制
│       ├── index.ts
│       ├── AccessProvider.tsx
│       └── access.ts
│
├── .env
├── .env.development
├── .env.production
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 四、核心功能模块设计

### 4.1 权限控制设计

```typescript
// src/access/index.ts

import { useUserStore } from '@/store/useUserStore';

// 权限代码定义
export const ACCESS_CODES = {
  // CRM权限
  CRM_CUSTOMER_VIEW: 'crm:customer:view',
  CRM_CUSTOMER_CREATE: 'crm:customer:create',
  CRM_CUSTOMER_EDIT: 'crm:customer:edit',
  CRM_CUSTOMER_DELETE: 'crm:customer:delete',
  CRM_CUSTOMER_EXPORT: 'crm:customer:export',
  
  // ERP权限
  ERP_PURCHASE_VIEW: 'erp:purchase:view',
  ERP_PURCHASE_CREATE: 'erp:purchase:create',
  ERP_PURCHASE_APPROVE: 'erp:purchase:approve',
  ERP_INVENTORY_VIEW: 'erp:inventory:view',
  ERP_INVENTORY_EDIT: 'erp:inventory:edit',
  
  // 财务权限
  FINANCE_VOUCHER_VIEW: 'finance:voucher:view',
  FINANCE_VOUCHER_CREATE: 'finance:voucher:create',
  FINANCE_VOUCHER_APPROVE: 'finance:voucher:approve',
  FINANCE_REPORT_VIEW: 'finance:report:view',
  
  // 系统权限
  SYSTEM_USER_VIEW: 'system:user:view',
  SYSTEM_USER_CREATE: 'system:user:create',
  SYSTEM_ROLE_VIEW: 'system:role:view',
  SYSTEM_ROLE_EDIT: 'system:role:edit',
} as const;

// 权限检查Hook
export const useAccess = () => {
  const { permissions, roles } = useUserStore();
  
  // 检查是否有某个权限
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };
  
  // 检查是否有任一权限
  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some((p) => permissions.includes(p));
  };
  
  // 检查是否有全部权限
  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every((p) => permissions.includes(p));
  };
  
  // 检查是否有某个角色
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };
  
  // 检查是否是管理员
  const isAdmin = (): boolean => {
    return roles.includes('admin') || roles.includes('super_admin');
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
  };
};

// 权限组件
interface AccessProps {
  access: string | string[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Access: React.FC<AccessProps> = ({
  access,
  mode = 'any',
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAccess();
  
  const check = Array.isArray(access)
    ? mode === 'all'
      ? hasAllPermissions(access)
      : hasAnyPermission(access)
    : hasPermission(access);
  
  return check ? <>{children}</> : <>{fallback}</>;
};

// 使用示例
const CustomerPage = () => {
  const { hasPermission } = useAccess();
  
  return (
    <div>
      <ProTable
        // ...
        toolBarRender={() => [
          hasPermission(ACCESS_CODES.CRM_CUSTOMER_CREATE) && (
            <Button type="primary" onClick={handleCreate}>
              新建客户
            </Button>
          ),
          hasPermission(ACCESS_CODES.CRM_CUSTOMER_EXPORT) && (
            <Button onClick={handleExport}>导出</Button>
          ),
        ]}
      />
    </div>
  );
};
```

### 4.2 路由守卫设计

```typescript
// src/router/guards.tsx

import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { getToken } from '@/utils/auth';

// 白名单路由
const whiteList = ['/login', '/403', '/404', '/500'];

// 认证守卫
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = getToken();
  
  // 白名单路由直接放行
  if (whiteList.includes(location.pathname)) {
    return <>{children}</>;
  }
  
  // 未登录跳转登录页
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// 权限守卫
export const PermissionGuard: React.FC<{
  children: React.ReactNode;
  permissions?: string[];
}> = ({ children, permissions }) => {
  const { hasAnyPermission, isAdmin } = useAccess();
  
  // 无权限要求，放行
  if (!permissions || permissions.length === 0) {
    return <>{children}</>;
  }
  
  // 管理员放行
  if (isAdmin()) {
    return <>{children}</>;
  }
  
  // 检查权限
  if (!hasAnyPermission(permissions)) {
    return <Navigate to="/403" replace />;
  }
  
  return <>{children}</>;
};

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <PermissionGuard>
          <MainLayout />
        </PermissionGuard>
      </AuthGuard>
    ),
    children: [
      // 首页
      { index: true, element: <Dashboard /> },
      
      // CRM
      {
        path: 'crm/customer',
        element: <CustomerList />,
        handle: { permissions: ['crm:customer:view'] },
      },
      {
        path: 'crm/customer/:id',
        element: <CustomerDetail />,
        handle: { permissions: ['crm:customer:view'] },
      },
      
      // ERP
      {
        path: 'erp/purchase',
        element: <PurchaseList />,
        handle: { permissions: ['erp:purchase:view'] },
      },
      
      // 财务
      {
        path: 'finance/voucher',
        element: <VoucherList />,
        handle: { permissions: ['finance:voucher:view'] },
      },
      
      // 系统管理
      {
        path: 'system/user',
        element: <UserList />,
        handle: { permissions: ['system:user:view'] },
      },
      
      // ... 其他路由
    ],
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
```

### 4.3 表格组件封装

```typescript
// src/components/business/DataTable/index.tsx

import React, { useRef } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Popconfirm } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAccess } from '@/access';
import type { ActionType as AntdActionType } from '@ant-design/pro-components';

interface DataTableProps<T = any, P = any> {
  // 表格列配置
  columns: ProColumns<T>[];
  // 数据请求函数
  request: (params: P) => Promise<{ data: T[]; total: number }>;
  // 搜索表单配置
  search?: boolean | ProColumns<T>[];
  // 工具栏配置
  toolBar?: {
    create?: boolean | { permission?: string; onClick: () => void };
    export?: boolean | { permission?: string; onClick: () => void };
    custom?: React.ReactNode[];
  };
  // 行操作配置
  rowActions?: {
    edit?: boolean | { permission?: string; onClick: (record: T) => void };
    delete?: boolean | { permission?: string; onClick: (record: T) => void };
    custom?: (record: T) => React.ReactNode[];
  };
  // 批量操作
  batchActions?: {
    delete?: boolean | { permission?: string; onClick: (ids: string[]) => void };
    custom?: React.ReactNode;
  };
  // 其他ProTable属性
  rowKey?: string;
  pagination?: any;
  scroll?: any;
  expandable?: any;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  request,
  search = true,
  toolBar,
  rowActions,
  batchActions,
  rowKey = 'id',
  ...rest
}: DataTableProps<T>) => {
  const actionRef = useRef<ActionType>();
  const { hasPermission } = useAccess();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 处理工具栏
  const toolBarRender = () => {
    const items: React.ReactNode[] = [];
    
    if (toolBar?.create) {
      const config = typeof toolBar.create === 'object' ? toolBar.create : {};
      if (!config.permission || hasPermission(config.permission)) {
        items.push(
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={config.onClick}
          >
            新建
          </Button>
        );
      }
    }
    
    if (toolBar?.export) {
      const config = typeof toolBar.export === 'object' ? toolBar.export : {};
      if (!config.permission || hasPermission(config.permission)) {
        items.push(
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={config.onClick}
          >
            导出
          </Button>
        );
      }
    }
    
    if (toolBar?.custom) {
      items.push(...toolBar.custom);
    }
    
    return items;
  };
  
  // 处理行操作
  const actionColumn: ProColumns<T> = {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
    render: (_, record) => {
      const items: React.ReactNode[] = [];
      
      if (rowActions?.edit) {
        const config = typeof rowActions.edit === 'object' ? rowActions.edit : {};
        if (!config.permission || hasPermission(config.permission)) {
          items.push(
            <Tooltip key="edit" title="编辑">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => config.onClick?.(record)}
              />
            </Tooltip>
          );
        }
      }
      
      if (rowActions?.delete) {
        const config = typeof rowActions.delete === 'object' ? rowActions.delete : {};
        if (!config.permission || hasPermission(config.permission)) {
          items.push(
            <Popconfirm
              key="delete"
              title="确定删除吗？"
              onConfirm={() => config.onClick?.(record)}
            >
              <Tooltip title="删除">
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          );
        }
      }
      
      if (rowActions?.custom) {
        items.push(...rowActions.custom(record));
      }
      
      return <Space>{items}</Space>;
    },
  };
  
  // 最终列配置
  const finalColumns = rowActions ? [...columns, actionColumn] : columns;
  
  return (
    <ProTable<T>
      actionRef={actionRef}
      columns={finalColumns}
      request={async (params) => {
        const { current, pageSize, ...restParams } = params;
        const result = await request({ page: current, pageSize, ...restParams } as P);
        return {
          data: result.data,
          total: result.total,
          success: true,
        };
      }}
      rowKey={rowKey}
      search={search}
      toolBarRender={toolBarRender}
      rowSelection={
        batchActions
          ? {
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }
          : undefined
      }
      tableAlertRender={
        batchActions
          ? ({ selectedRowKeys }) => (
              <span>
                已选择 <a>{selectedRowKeys.length}</a> 项
              </span>
            )
          : undefined
      }
      tableAlertOptionRender={
        batchActions
          ? () => (
              <Space>
                {batchActions.delete && (
                  <Popconfirm
                    title="确定删除选中的数据吗？"
                    onConfirm={() => {
                      const config =
                        typeof batchActions.delete === 'object'
                          ? batchActions.delete
                          : {};
                      config.onClick?.(selectedRowKeys as string[]);
                      setSelectedRowKeys([]);
                    }}
                  >
                    <Button danger size="small">
                      批量删除
                    </Button>
                  </Popconfirm>
                )}
                {batchActions.custom}
                <Button
                  size="small"
                  onClick={() => setSelectedRowKeys([])}
                >
                  取消选择
                </Button>
              </Space>
            )
          : undefined
      }
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      {...rest}
    />
  );
};

// 使用示例
const CustomerList = () => {
  const navigate = useNavigate();
  const { mutate: deleteCustomer } = useDeleteCustomer();
  
  return (
    <DataTable<Customer>
      columns={customerColumns}
      request={getCustomers}
      toolBar={{
        create: {
          permission: ACCESS_CODES.CRM_CUSTOMER_CREATE,
          onClick: () => navigate('/crm/customer/create'),
        },
        export: {
          permission: ACCESS_CODES.CRM_CUSTOMER_EXPORT,
          onClick: handleExport,
        },
      }}
      rowActions={{
        edit: {
          permission: ACCESS_CODES.CRM_CUSTOMER_EDIT,
          onClick: (record) => navigate(`/crm/customer/${record.id}/edit`),
        },
        delete: {
          permission: ACCESS_CODES.CRM_CUSTOMER_DELETE,
          onClick: (record) => deleteCustomer(record.id),
        },
      }}
    />
  );
};
```

### 4.4 表单组件封装

```typescript
// src/components/business/SearchForm/index.tsx

import React from 'react';
import { ProForm, ProFormText, ProFormSelect, ProFormDateRangePicker } from '@ant-design/pro-components';
import { Collapse, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons';

interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange';
  options?: { label: string; value: any }[];
  placeholder?: string;
}

interface SearchFormProps {
  fields: SearchField[];
  onSearch: (values: any) => void;
  onReset?: () => void;
  loading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  fields,
  onSearch,
  onReset,
  loading,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const formRef = useRef<ProFormInstance>();
  
  // 渲染搜索字段
  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'text':
        return (
          <ProFormText
            name={field.name}
            label={field.label}
            placeholder={field.placeholder || `请输入${field.label}`}
          />
        );
      case 'select':
        return (
          <ProFormSelect
            name={field.name}
            label={field.label}
            options={field.options}
            placeholder={field.placeholder || `请选择${field.label}`}
          />
        );
      case 'dateRange':
        return (
          <ProFormDateRangePicker
            name={field.name}
            label={field.label}
            placeholder={['开始日期', '结束日期']}
          />
        );
      default:
        return null;
    }
  };
  
  // 显示的字段（折叠时只显示前3个）
  const visibleFields = collapsed ? fields.slice(0, 3) : fields;
  const hasMore = fields.length > 3;
  
  return (
    <div className={styles.searchForm}>
      <ProForm
        formRef={formRef}
        layout="inline"
        submitter={false}
        onFinish={onSearch}
      >
        {visibleFields.map(renderField)}
        
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              查询
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                formRef.current?.resetFields();
                onReset?.();
              }}
            >
              重置
            </Button>
            {hasMore && (
              <Button
                type="link"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? '展开' : '收起'}
                <DownOutlined
                  style={{
                    marginLeft: 4,
                    transition: 'transform 0.3s',
                    transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
                  }}
                />
              </Button>
            )}
          </Space>
        </Form.Item>
      </ProForm>
    </div>
  );
};

// 使用示例
const CustomerList = () => {
  const searchFields: SearchField[] = [
    { name: 'name', label: '客户名称', type: 'text' },
    { name: 'contact', label: '联系人', type: 'text' },
    { name: 'phone', label: '电话', type: 'text' },
    {
      name: 'status',
      label: '客户状态',
      type: 'select',
      options: [
        { label: '潜在客户', value: 'potential' },
        { label: '意向客户', value: 'intention' },
        { label: '成交客户', value: 'dealed' },
      ],
    },
    { name: 'createTime', label: '创建时间', type: 'dateRange' },
  ];
  
  return (
    <SearchForm
      fields={searchFields}
      onSearch={handleSearch}
      onReset={handleReset}
    />
  );
};
```

---

## 五、页面设计

### 5.1 页面清单

| 一级菜单 | 二级菜单 | 路由 | 说明 |
|---------|---------|------|------|
| **工作台** | 概览 | `/dashboard` | 数据概览、待办事项 |
| **客户中心** | 客户管理 | `/crm/customer` | 客户列表、详情、编辑 |
| | 线索管理 | `/crm/lead` | 线索跟进 |
| | 商机管理 | `/crm/opportunity` | 商机跟进 |
| | 订单管理 | `/crm/order` | 订单处理 |
| | 销售分析 | `/crm/analysis` | 销售报表 |
| **运营中心** | 采购管理 | `/erp/purchase` | 采购全流程 |
| | 库存管理 | `/erp/inventory` | 库存管理 |
| | 生产管理 | `/erp/production` | 生产管理 |
| | 质量管理 | `/erp/quality` | 质量管理 |
| | 设备管理 | `/erp/equipment` | 设备管理 |
| **服务中心** | 工单管理 | `/service/workorder` | 工单处理 |
| | 服务合同 | `/service/contract` | 合同管理 |
| | 配件管理 | `/service/parts` | 配件管理 |
| | 知识库 | `/service/knowledge` | 知识文章 |
| **财务中心** | 总账管理 | `/finance/gl` | 凭证、账簿 |
| | 应收管理 | `/finance/ar` | 应收、收款 |
| | 应付管理 | `/finance/ap` | 应付、付款 |
| | 预算管理 | `/finance/budget` | 预算管理 |
| **人力资源** | 员工管理 | `/hr/employee` | 员工档案 |
| | 考勤管理 | `/hr/attendance` | 考勤统计 |
| | 薪酬管理 | `/hr/salary` | 薪酬核算 |
| **系统管理** | 用户管理 | `/system/user` | 用户账号 |
| | 角色权限 | `/system/role` | 角色权限 |
| | 组织架构 | `/system/organization` | 组织管理 |
| | 数据字典 | `/system/dictionary` | 字典管理 |
| | 系统日志 | `/system/log` | 操作日志 |

### 5.2 主布局设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo] 道达智能门户    [搜索...]    [通知] [消息] [用户头像 ▼]        │
├────────────┬────────────────────────────────────────────────────────────┤
│            │                                                            │
│  📊 工作台  │  首页 > 客户管理 > 客户列表                               │
│  ├─ 概览   │                                                            │
│            │  ┌────────────────────────────────────────────────────┐   │
│  👥 客户中心│  │                                                    │   │
│  ├─ 客户管理│  │   [新建客户] [导出]          [搜索] [重置]         │   │
│  ├─ 线索管理│  │                                                    │   │
│  ├─ 商机管理│  │   ┌─────────────────────────────────────────────┐ │   │
│  ├─ 订单管理│  │   │ 客户名称 │ 联系人 │ 电话 │ 状态 │ 操作     │ │   │
│  └─ 销售分析│  │   ├─────────────────────────────────────────────┤ │   │
│            │  │   │ 客户A   │ 张三   │ 138xxx │ 意向 │ [编辑]...│ │   │
│  📦 运营中心│  │   │ 客户B   │ 李四   │ 139xxx │ 成交 │ [编辑]...│ │   │
│  ├─ 采购管理│  │   │ 客户C   │ 王五   │ 137xxx │ 潜在 │ [编辑]...│ │   │
│  ├─ 库存管理│  │   └─────────────────────────────────────────────┘ │   │
│  ├─ 生产管理│  │                                                    │   │
│  ├─ 质量管理│  │   共 100 条  < 1 2 3 ... >                         │   │
│  └─ 设备管理│  │                                                    │   │
│            │  └────────────────────────────────────────────────────┘   │
│  🔧 服务中心│                                                            │
│  ├─ 工单管理│                                                            │
│  ├─ 服务合同│                                                            │
│  ├─ 配件管理│                                                            │
│  └─ 知识库 │                                                            │
│            │                                                            │
│  💰 财务中心│                                                            │
│  ├─ 总账管理│                                                            │
│  ├─ 应收管理│                                                            │
│  ├─ 应付管理│                                                            │
│  └─ 预算管理│                                                            │
│            │                                                            │
│  👤 人力资源│                                                            │
│  ├─ 员工管理│                                                            │
│  ├─ 考勤管理│                                                            │
│  └─ 薪酬管理│                                                            │
│            │                                                            │
│  ⚙️ 系统管理│                                                            │
│  ├─ 用户管理│                                                            │
│  ├─ 角色权限│                                                            │
│  ├─ 组织架构│                                                            │
│  ├─ 数据字典│                                                            │
│  └─ 系统日志│                                                            │
│            │                                                            │
├────────────┴────────────────────────────────────────────────────────────┤
│  © 2026 道达智能                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 六、性能优化方案

### 6.1 代码分割

```typescript
// 路由级代码分割
const CRMModule = lazy(() => import('@/pages/crm'));
const ERPModule = lazy(() => import('@/pages/erp'));
const ServiceModule = lazy(() => import('@/pages/service'));
const FinanceModule = lazy(() => import('@/pages/finance'));
const SystemModule = lazy(() => import('@/pages/system'));

// 路由配置
{
  path: '/crm',
  element: (
    <Suspense fallback={<PageLoading />}>
      <CRMModule />
    </Suspense>
  ),
}

// 组件级代码分割
const HeavyChart = lazy(() => import('@/components/charts/HeavyChart'));
```

### 6.2 缓存策略

```typescript
// React Query 缓存配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5分钟内数据新鲜
      cacheTime: 30 * 60 * 1000,   // 30分钟后清除缓存
      refetchOnWindowFocus: false,  // 窗口聚焦不重新请求
      retry: 2,                     // 失败重试2次
    },
  },
});

// 使用缓存
const { data, isLoading } = useQuery({
  queryKey: ['customers', params],
  queryFn: () => getCustomers(params),
  keepPreviousData: true,  // 保持旧数据直到新数据加载
});

// 预加载
const prefetchCustomer = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id),
  });
};
```

### 6.3 虚拟滚动

```typescript
// 长列表虚拟滚动
import { VirtualTable } from 'virtuoso';

const LargeDataTable = ({ data }) => (
  <VirtualTable
    data={data}
    itemContent={(index, item) => (
      <tr>
        <td>{item.name}</td>
        <td>{item.status}</td>
      </tr>
    )}
    style={{ height: 600 }}
  />
);
```

---

## 七、部署方案

### 7.1 Docker部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  portal:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=/api
    depends_on:
      - backend
    networks:
      - daoda-network

  backend:
    image: daoda/backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/daoda
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - daoda-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=daoda
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - daoda-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - daoda-network

volumes:
  postgres-data:
  redis-data:

networks:
  daoda-network:
    driver: bridge
```

---

## 八、开发计划

### 8.1 开发阶段

```
┌─────────────────────────────────────────────────────────────────┐
│                   内部管理系统开发计划                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: 基础框架 (3周)                                        │
│  ├─ Week 1: 项目搭建、路由、权限框架                           │
│  ├─ Week 2: 布局组件、通用组件、API封装                        │
│  └─ Week 3: 用户认证、菜单权限、消息中心                       │
│                                                                 │
│  Phase 2: 核心业务 (8周)                                        │
│  ├─ Week 4-5: CRM客户中心                                      │
│  ├─ Week 6-7: ERP运营中心                                      │
│  ├─ Week 8-9: 服务中心                                         │
│  └─ Week 10-11: 财务中心                                       │
│                                                                 │
│  Phase 3: 扩展功能 (4周)                                        │
│  ├─ Week 12-13: MES生产执行                                    │
│  └─ Week 14-15: HR人力资源                                     │
│                                                                 │
│  Phase 4: 优化完善 (2周)                                        │
│  ├─ Week 16: 性能优化、测试                                    │
│  └─ Week 17: 修复、文档、部署                                  │
│                                                                 │
│  总计: 17周 (约4个月)                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

> **下一份文档**: `16_HARMONYOS_APP_ARCHITECTURE.md` - 鸿蒙原生APP技术架构
>
> **文档维护**: 渔晓白
> **最后更新**: 2026-03-19