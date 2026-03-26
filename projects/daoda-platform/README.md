# 道达智能数字化平台

> **品牌口号**: 以智能科技，重新定义出行体验  
> **版本**: v1.0.0  
> **创建日期**: 2026-03-16  
> **更新日期**: 2026-03-21

---

## 📋 项目简介

道达智能数字化平台是一个集品牌展示、客户管理、运营管理、售后服务于一体的企业级数字化解决方案。

### 核心定位

- **对外官网**: 品牌门户、产品展示、解决方案、全球服务
- **对内门户**: CRM、ERP、财务、售后、HR、系统管理

---

## ✅ 开发进度

### 后端模块 (NestJS + Prisma)

| 模块 | 状态 | 代码量 | 说明 |
|------|------|--------|------|
| Auth | ✅ 完成 | ~460行 | 认证、JWT、权限守卫 |
| User | ✅ 完成 | ~400行 | 用户管理 CRUD |
| Customer | ✅ 完成 | ~480行 | 客户管理、跟进记录 |
| Product | ✅ 完成 | ~390行 | 产品管理、分类系列 |
| Order | ✅ 完成 | ~900行 | 订单管理、状态流转、支付 |
| Service | ✅ 完成 | ~490行 | 工单管理、分配、状态 |

### 前端模块 (React + Vite)

| 模块 | 状态 | 说明 |
|------|------|------|
| Website | ✅ 完成 | 官网页面已开发 |
| Portal | 🔄 进行中 | 门户框架完成，页面待对接 API |
| API 服务层 | ✅ 完成 | 所有服务文件已创建 |
| 状态管理 | ✅ 完成 | Zustand 认证状态管理 |

### 部署配置

| 配置 | 状态 |
|------|------|
| Docker Compose | ✅ 完成 |
| Dockerfile (Backend) | ✅ 完成 |
| Dockerfile (Website) | ✅ 完成 |
| Dockerfile (Portal) | ✅ 完成 |
| Nginx 配置 | ✅ 完成 |

---

## 🌐 全站栏目架构

### 对外官网 (4+1)

```
产品中心 | 智慧方案 | 全球服务 | 关于道达 | [登录]
```

### 对内门户 (6+1)

```
首页工作台 | 客户中心 | 运营中心 | 服务中心 | 财务中心 | 人力行政 | [系统]
```

---

## 🏗️ 项目结构

```
daoda-platform/
├── website/           # 对外官网 (React + Vite)
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── components/# 公共组件
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
├── portal/            # 对内门户 (React + Vite)
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── services/  # API 服务层
│   │   ├── stores/    # 状态管理
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # 后端服务 (NestJS)
│   ├── src/
│   │   ├── modules/   # 业务模块
│   │   ├── common/    # 公共模块
│   │   └── ...
│   ├── prisma/        # 数据库 Schema
│   └── Dockerfile
├── docs/              # 项目文档
│   └── design/        # 设计文档 (18个)
├── docker-compose.yml # Docker 编排
└── package.json       # 根配置
```

---

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动官网 (端口 3000)
npm run dev:website

# 启动门户 (端口 3001)
npm run dev:portal

# 启动后端 (端口 3000)
npm run dev:backend
```

### Docker 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 数据库迁移

```bash
cd backend

# 生成 Prisma Client
npx prisma generate

# 创建迁移
npx prisma migrate dev --name init

# 填充初始数据（可选）
npx prisma db seed
```

---

## 📚 技术栈

| 层级 | 技术 |
|-----|------|
| 前端 | React 18 + TypeScript + Vite |
| UI库 | Ant Design 5 + Tailwind CSS |
| 状态管理 | Zustand + React Query |
| 后端 | NestJS 10 + Prisma |
| 数据库 | PostgreSQL 15 |
| 缓存 | Redis 7 |
| 部署 | Docker + Nginx |

---

## 📖 文档

详细设计文档位于 `docs/design/` 目录：

- [文档规范标准](./docs/design/00_DOCUMENT_STANDARDS.md)
- [开发规范与编码标准](./docs/design/01_DEVELOPMENT_STANDARDS.md)
- [ERP模块设计](./docs/design/02_ERP_MODULE.md)
- [CRM模块设计](./docs/design/03_CRM_MODULE.md)
- [售后服务模块设计](./docs/design/04_SERVICE_MODULE.md)
- [MES模块设计](./docs/design/05_MES_MODULE.md)
- [数据库设计](./docs/design/06_DATABASE_SCHEMA.md)
- [API接口设计](./docs/design/07_API_SPECIFICATION.md)
- [组件库设计](./docs/design/08_COMPONENT_LIBRARY.md)
- [财务模块设计](./docs/design/09_FINANCE_MODULE.md)
- [认证授权模块](./docs/design/10_AUTH_MODULE.md)
- [工作流模块](./docs/design/11_WORKFLOW_MODULE.md)
- [SRM供应商管理](./docs/design/12_SRM_MODULE.md)
- [BI商业智能](./docs/design/13_BI_MODULE.md)
- [官网架构设计](./docs/design/14_WEBSITE_ARCHITECTURE.md)
- [门户架构设计](./docs/design/15_PORTAL_ARCHITECTURE.md)
- [鸿蒙APP架构](./docs/design/16_HARMONYOS_APP_ARCHITECTURE.md)
- [工作流开发指南](./docs/design/17_WORKFLOW_DEVELOPMENT_GUIDE.md)
- [模块设计总纲](./docs/design/MODULE_DESIGN_MASTER.md)

---

## 🔧 API 文档

启动后端服务后访问：
- Swagger UI: http://localhost:3000/api/docs

---

**道达智能 © 2026**