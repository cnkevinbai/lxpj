# 道达智能统一门户

> 官网 + 内部业务管理系统统一前端

## 📁 项目结构

```
portal/
├── src/
│   ├── layouts/              # 布局组件
│   │   ├── WebsiteLayout.tsx  # 官网布局
│   │   └── PortalLayout.tsx   # 门户布局
│   ├── pages/
│   │   ├── website/          # 官网页面
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   └── ...
│   │   └── portal/           # 内部系统
│   │       ├── Dashboard.tsx
│   │       ├── Login.tsx
│   │       └── ...
│   ├── shared/               # 共享组件
│   ├── store/                # 状态管理
│   └── App.tsx               # 统一路由
├── package.json
├── vite.config.ts
└── Dockerfile
```

## 🚀 快速开始

### 安装依赖

```bash
cd portal
npm install
```

### 开发模式

```bash
npm run dev
```

访问：http://localhost:5173

### 构建

```bash
npm run build
```

### Docker 部署

```bash
docker build -t daoda-portal .
docker run -p 80:80 daoda-portal
```

## 📊 系统模块

### 官网模块
- 首页
- 产品中心
- 解决方案
- 经销商加盟
- 服务支持
- 关于我们
- 联系我们
- 业务管理系统介绍

### 内部系统模块
- **工作台** - 统一入口
- **CRM** - 客户管理 (10 模块)
- **ERP** - 企业资源计划 (10 模块)
- **财务** - 财务管理 (6 模块)
- **外贸** - 外贸管理 (8 模块)
- **售后** - 售后服务 (6 模块)
- **HR** - 人力资源 (6 模块)
- **CMS** - 内容管理 (6 模块)
- **消息** - 消息中心 (6 模块)
- **工作流** - 审批流 (6 模块)
- **系统管理** - 系统设置

## 🔧 技术栈

- **React 18.2** - UI 框架
- **TypeScript 5.3** - 类型系统
- **Vite 5.1** - 构建工具
- **Ant Design 5.14** - UI 组件库
- **React Router 6.22** - 路由管理
- **Zustand 4.5** - 状态管理
- **Axios 1.6** - HTTP 客户端

## 📝 开发规范

### 目录约定

- `@layouts` - 布局组件
- `@pages` - 页面组件
- `@shared` - 共享组件
- `@store` - 状态管理
- `@config` - 配置文件

### 组件命名

- 使用 PascalCase
- 语义化命名
- 添加 TypeScript 类型

### 路由规范

- 官网：`/` 根路径
- 门户：`/portal` 需登录
- 模块：`/portal/{module}`

## 🚀 下一步

1. ✅ 基础框架搭建完成
2. ⏳ 迁移现有代码到对应模块
3. ⏳ 完善官网页面内容
4. ⏳ 实现统一认证
5. ⏳ Docker 部署测试

## 📚 相关文档

- [架构重构计划](../ARCHITECTURE_REFACTOR_PLAN_v3.md)
- [系统总览](../SYSTEM_OVERVIEW.md)
- [部署指南](../DEPLOYMENT_GUIDE.md)

---

**版本**: 3.0.0  
**最后更新**: 2026-03-14  
**维护人**: 渔晓白 ⚙️
