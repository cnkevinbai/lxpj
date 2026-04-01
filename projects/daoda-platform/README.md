# 道达智能数字化平台 (DAODA Platform)

## 项目概述

道达智能数字化平台是一个企业级 CRM+ERP+HR 一体化管理系统，提供完整的客户关系管理、企业资源计划、人力资源管理和财务管理功能。

## 技术栈

### 后端
- **框架**: NestJS 10 + TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 15
- **认证**: JWT + 多租户支持
- **API文档**: Swagger/OpenAPI

### 前端 Portal
- **框架**: React 18 + TypeScript + Vite
- **UI库**: Ant Design 5
- **状态管理**: Zustand
- **路由**: React Router 6

### 前端 Website (官网)
- **框架**: React 18 + TypeScript + Vite
- **风格**: 深色玻璃态设计
- **语言**: 中英双语支持

## 项目结构

```
daoda-platform/
├── backend/                 # NestJS 后端服务
│   ├── src/
│   │   ├── common/          # 公共模块 (guards, filters, interceptors)
│   │   ├── core/            # 核心模块 (auth, user, config)
│   │   ├── modules/         # 业务模块
│   │   │   ├── crm/         # CRM 模块
│   │   │   ├── erp/         # ERP 模块
│   │   │   ├── finance/     # 财务模块
│   │   │   ├── hr/          # HR 模块
│   │   │   ├── service/     # 服务模块
│   │   │   └── cms/         # CMS 模块
│   │   └── app.module.ts    # 主模块
│   ├── prisma/              # Prisma Schema
│   ├── test/                # E2E 测试
│   └── jest.config.json     # Jest 配置
│
├── web/
│   ├── portal/              # 内部管理门户
│   │   ├── src/
│   │   │   ├── components/  # 共享组件
│   │   │   ├── pages/       # 页面组件 (38个)
│   │   │   ├── stores/      # Zustand 状态
│   │   │   └── utils/       # 工具函数
│   │   └── package.json
│   │
│   └── website/             # 对外官网
│       ├── src/
│       │   ├── pages/       # 官网页面
│       │   └── components/  # 官网组件
│       └ package.json
│
└── docs/                    # 项目文档
    ├── PROJECT_OVERVIEW.md
    ├── ARCHITECTURE_REQUIREMENTS_COMPLETE.md
    └── ...
```

## 功能模块

### CRM 模块 (客户关系管理)
| 功能 | 状态 | API数量 |
|------|------|---------|
| 客户管理 | ✅ | 12 |
| 线索管理 | ✅ | 10 |
| 商机管理 | ✅ | 10 |
| 销售预测 | ✅ | 8 |
| 营销自动化 | ✅ | 14 |
| 销售绩效 | ✅ | 8 |

### ERP 模块 (企业资源计划)
| 功能 | 状态 | API数量 |
|------|------|---------|
| 库存管理 | ✅ | 12 |
| 生产管理 | ✅ | 10 |
| 采购管理 | ✅ | 10 |
| 设备管理 | ✅ | 10 |
| 项目管理 | ✅ | 8 |

### Finance 模块 (财务管理)
| 功能 | 状态 | API数量 |
|------|------|---------|
| 发票管理 | ✅ | 10 |
| 应收账款 | ✅ | 10 |
| 应付账款 | ✅ | 10 |
| 固定资产 | ✅ | 15 |
| 预算管理 | ✅ | 12 |
| 税务管理 | ✅ | 10 |

### HR 模块 (人力资源管理)
| 功能 | 状态 | API数量 |
|------|------|---------|
| 员工管理 | ✅ | 12 |
| 考勤管理 | ✅ | 10 |
| 薪资管理 | ✅ | 10 |
| 培训管理 | ✅ | 10 |

### Service 模块 (售后服务)
| 功能 | 状态 | API数量 |
|------|------|---------|
| 服务工单 | ✅ | 12 |
| 合同管理 | ✅ | 10 |
| 配件管理 | ✅ | 8 |
| 客户满意度 | ✅ | 12 |

### CMS 模块 (内容管理)
| 功能 | 状态 | API数量 |
|------|------|---------|
| 新闻管理 | ✅ | 10 |
| 案例管理 | ✅ | 10 |
| 视频管理 | ✅ | 8 |

## 项目统计

| 指标 | 数量 |
|------|------|
| 后端服务 | **72** |
| Controller | **73** |
| Module | **107** |
| DTO | **37** |
| 前端页面 | **38** |
| 测试文件 | **7** |
| 测试用例 | **66** |

## 快速开始

### 后端启动

```bash
cd backend

# 安装依赖
npm install

# 配置数据库
cp .env.example .env
# 编辑 .env 配置 PostgreSQL 连接

# 初始化数据库
npx prisma migrate dev
npx prisma generate

# 启动服务
npm run start:dev

# 访问 API 文档
open http://localhost:3000/api/docs
```

### 前端 Portal 启动

```bash
cd web/portal

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
open http://localhost:5173
```

### 前端 Website 启动

```bash
cd web/website

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
open http://localhost:5174
```

## 测试

```bash
# 运行单元测试
cd backend && npm test

# 运行测试并生成覆盖率报告
npm run test:cov

# 运行 E2E 测试
npm run test:e2e
```

### 测试结果

```
Test Suites: 7 passed, 7 total
Tests:       66 passed, 66 total
Snapshots:   0 total
Time:        3.74 s
```

## API 文档

启动后端服务后访问 Swagger 文档：

- **地址**: http://localhost:3000/api/docs
- **API数量**: ~500+
- **模块分组**: CRM / ERP / Finance / HR / Service / CMS

## 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 生产环境

```bash
# 后端构建
cd backend && npm run build

# 前端构建
cd web/portal && npm run build
cd web/website && npm run build
```

## 开发状态

| 模块 | 完成度 | 状态 |
|------|--------|------|
| 后端 API | **98%** | ✅ 完成 |
| 前端 Portal | **95%** | ✅ 完成 |
| 前端 Website | **90%** | ✅ 完成 |
| 单元测试 | **15%** | 🔄 进行中 |
| E2E 测试 | **5%** | 🔄 进行中 |

## 更新日志

### 2026-04-01
- ✅ 新增 7 个服务模块 (固定资产、预算、设备、培训、营销自动化、税务管理、客户满意度)
- ✅ 新增 4 个 DTO 文件
- ✅ 新增 7 个测试文件 (66 测试用例)
- ✅ 修复 ESLint 错误 (2387 → 808)
- ✅ Swagger API 文档完善

### 2026-03-21
- ✅ 后端 21 个模块完成
- ✅ 前端 Portal 38 个页面完成
- ✅ 前端 Website 官网完成

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 许可证

Copyright © 2026 DAODA Intelligent Technology