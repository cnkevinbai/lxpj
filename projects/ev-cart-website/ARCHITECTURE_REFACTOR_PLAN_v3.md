# 道达智能门户架构重构方案 v3

**版本**: 3.1  
**创建时间**: 2026-03-13  
**更新时间**: 2026-03-14 06:24  
**状态**: ✅ 方案确认，准备实施  
**优先级**: 🔴 高

---

## 🎯 架构定位（重要更新）

### 正确的架构理解

```
┌─────────────────────────────────────────────────────────────┐
│                     Web 统一前端                            │
│  路径：portal/ (新建)                                       │
│  技术栈：React 18 + Vite 5.4                               │
│                                                             │
│  ┌─────────────┐           ┌─────────────┐                │
│  │   官网      │           │   门户      │                │
│  │  (对外)     │           │  (对内)     │                │
│  │             │           │             │                │
│  │ • 公司展示   │           │ • CRM       │                │
│  │ • 产品展示   │           │ • ERP       │                │
│  │ • 解决方案   │           │ • 财务      │                │
│  │ • 经销商    │           │ • 售后      │                │
│  │ • 关于我们  │           │ • HR        │                │
│  │ •  CMS      │           │ • 系统管理  │                │
│  └─────────────┘           └─────────────┘                │
│                                                             │
│  路由设计：                                                  │
│  /              → 官网首页                                   │
│  /products      → 产品中心                                   │
│  /portal        → 门户首页 (需登录)                          │
│  /portal/crm    → CRM 系统                                   │
│  /portal/erp    → ERP 系统                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 统一 API
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │  Web    │          │  手机   │          │ 鸿蒙    │
   │  浏览器  │          │  APP    │          │  APP    │
   │         │          │         │          │         │
   │ 响应式   │          │ H5/     │          │ 原生    │
   │ 适配    │          │ RN      │          │ ArkTS   │
   └─────────┘          └─────────┘          └─────────┘
   
   ✅ 官网 + 门户统一     ✅ 保持独立            ✅ 保持独立
   (本次重构核心)         (后续优化)            (不重构)
```

### 鸿蒙 APP 架构（保持独立）

```
┌─────────────────────────────────────────────────────────────┐
│              鸿蒙 APP (HarmonyOS NEXT)                       │
│  路径：harmonyos-app/                                        │
│  技术栈：ArkTS/ETS                                          │
│  状态：✅ 50+ 页面已完成，不重构                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API 调用
                              │
┌─────────────────────────────────────────────────────────────┐
│              鸿蒙后端 (API 网关)                              │
│  路径：harmony-server/                                       │
│  技术栈：Node.js + Express + WebSocket                     │
│  状态：⏳ 需要改造为 API 代理，统一认证                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 代理转发
                              │
┌─────────────────────────────────────────────────────────────┐
│              主后端 (统一业务逻辑)                           │
│  路径：backend/                                              │
│  技术栈：NestJS + PostgreSQL                                │
│  状态：✅ 81 个模块、455+ API 已完成                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 重构范围确认

### ✅ 本次重构（Phase 1-3）
| 项目 | 说明 | 状态 |
|------|------|------|
| 官网 + 门户统一 | website/ + crm/ → portal/ | ⏳ 待开始 |
| 统一路由配置 | 官网路由 + 门户路由统一 | ⏳ 待开始 |
| 统一部署 | Docker Compose 一键部署 | ⏳ 待开始 |

### ⏳ 后续优化（Phase 4+）
| 项目 | 说明 | 状态 |
|------|------|------|
| 鸿蒙 API 网关 | harmony-server 改为 API 代理 | ⏳ 后续 |
| 统一认证 | JWT 认证统一 | ⏳ 后续 |

### ❌ 不重构
| 项目 | 说明 | 原因 |
|------|------|------|
| 鸿蒙 APP 前端 | 50+ 页面 ArkTS 代码 | 原生体验最佳，无需改动 |
| 鸿蒙 APP UI | 鸿蒙原生组件 | 保持原生优势 |

---

## 📊 当前状态（2026-03-14）

### ✅ 已完成
| 任务 | 状态 | 说明 |
|------|------|------|
| 文档体系建设 | ✅ 完成 | 10 大核心系统指南全部完成 (77KB) |
| 系统功能开发 | ✅ 完成 | 81 个模块、138 个页面、455+ API |
| 文档索引创建 | ✅ 完成 | DOCUMENTATION_INDEX.md |
| 冗余文档归档 | ✅ 完成 | 50+ 份归档至 docs-archive/ |

### ⏳ 待实施
| 任务 | 优先级 | 说明 |
|------|--------|------|
| 架构重构 | 🔴 高 | 官网 + 门户统一、三端整合 |
| 统一部署 | 🔴 高 | Docker Compose 一键部署 |
| 代码优化 | 🟡 中 | 模块化重构、性能优化 |

---

## 🎯 核心原则

1. **统一部署**：所有系统一键自动化部署，不分开部署
2. **官网展示**：对外官网展示公司实力和内部系统入口
3. **三端统一**：Web 门户 + 手机 APP + HarmonyOS APP，共享同一套后端和权限体系
4. **文档先行**：所有重构必须有文档支撑（✅ 已完成）

---

## 🏗️ 目标架构（三端统一）

```
┌─────────────────────────────────────────────────────────────┐
│                    对外官网 (Public)                         │
│  Domain: www.ddzn.com                                        │
│  技术栈：React 18 + Vite (与门户统一)                        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 首页 │ 产品中心 │ 解决方案 │ 经销商 │ 服务 │ 关于我们 │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   🏆 道达智能 - 行业领先的车联网解决方案提供商           │  │
│  │                                                        │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │   🚀 强大的业务管理系统 - 彰显公司实力                  │  │
│  │                                                        │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │   │  CRM     │ │  ERP     │ │  财务    │             │  │
│  │   │  10 模块  │ │  10 模块  │ │  6 模块   │             │  │
│  │   └──────────┘ └──────────┘ └──────────┘             │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │   │  售后    │ │  人力    │ │  消息    │             │  │
│  │   │  6 模块   │ │  6 模块   │ │  6 模块   │             │  │
│  │   └──────────┘ └──────────┘ └──────────┘             │  │
│  │                                                        │  │
│  │   💼 企业客户专属入口                                  │  │
│  │   [登录业务管理系统] → /portal/login                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (共享后端 API + 数据库)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Web 门户      │   │  手机 APP     │   │ HarmonyOS    │
│ (React+Vite)  │   │ (React Native)│   │  App         │
│               │   │               │   │              │
│ /portal       │   │ 首页         │   │ 首页         │
│ /crm          │   │ CRM          │   │ CRM          │
│ /erp          │   │ ERP          │   │ ERP          │
│               │   │               │   │              │
│ 统一认证 JWT   │   │ 统一认证 JWT   │   │ 统一认证 JWT   │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │          统一后端 API (NestJS)          │
        │                                         │
        │  /api/auth/*      认证授权              │
        │  /api/crm/*       CRM 功能              │
        │  /api/erp/*       ERP 功能              │
        │  /api/finance/*   财务功能              │
        │  /api/service/*   售后功能              │
        │  /api/hr/*        人力功能              │
        │  /api/cms/*       CMS 功能              │
        │  /api/common/*    公共功能              │
        │                                         │
        │  JWT 验证 + 角色权限控制                 │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │       数据库 (PostgreSQL 15)            │
        │                                         │
        │  users          用户表                  │
        │  roles          角色表                  │
        │  permissions    权限表                  │
        │  crm_*          CRM 数据                │
        │  erp_*          ERP 数据                │
        │  finance_*      财务数据                │
        │  hr_*           HR 数据                 │
        │  cms_*          CMS 数据                │
        └─────────────────────────────────────────┘
```

---

## 📐 关键设计决策

### 1. 官网与门户统一

**现状问题**:
- ❌ website/ 和 crm/ 两个独立项目
- ❌ 分别部署、维护成本高
- ❌ 代码无法共享

**目标方案**:
```
统一前端 (portal/)
├── src/
│   ├── layouts/
│   │   ├── WebsiteLayout.tsx    # 官网布局
│   │   └── PortalLayout.tsx     # 门户布局
│   ├── pages/
│   │   ├── website/   # 官网页面
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   └── ...
│   │   └── portal/    # 内部系统
│   │       ├── Dashboard.tsx
│   │       ├── crm/
│   │       ├── erp/
│   │       └── ...
│   └── App.tsx        # 统一路由
```

**路由设计**:
```typescript
// App.tsx
<Routes>
  {/* 官网路由 (公开) */}
  <Route path="/" element={<WebsiteLayout />}>
    <Route index element={<Home />} />
    <Route path="products" element={<Products />} />
    <Route path="solutions" element={<Solutions />} />
    <Route path="dealer" element={<Dealer />} />
    <Route path="service" element={<Service />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="portal" element={<PortalIntro />} />
  </Route>

  {/* 内部系统路由 (需登录) */}
  <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="crm/*" element={<CRMModule />} />
    <Route path="erp/*" element={<ERPModule />} />
    <Route path="finance/*" element={<FinanceModule />} />
    <Route path="hr/*" element={<HRModule />} />
    <Route path="service/*" element={<ServiceModule />} />
    <Route path="cms/*" element={<CMSModule />} />
    <Route path="settings/*" element={<SettingsModule />} />
  </Route>

  {/* 登录页 */}
  <Route path="/login" element={<Login />} />
  <Route path="/403" element={<Forbidden />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 2. 三端统一核心

```
┌─────────────────────────────────────────────┐
│              三端统一策略                    │
├─────────────────────────────────────────────┤
│                                             │
│  同一套后端 API                              │
│  ├─ 10 大系统、81 个模块                     │
│  ├─ 455+ API 接口                           │
│  └─ JWT 统一认证                            │
│                                             │
│  同一个数据库                                │
│  ├─ PostgreSQL 15                           │
│  ├─ 统一用户/角色/权限                      │
│  └─ 业务数据共享                            │
│                                             │
│  同一套权限体系                              │
│  ├─ RBAC 模型                               │
│  ├─ 功能权限 + 数据权限                     │
│  └─ 统一鉴权中间件                          │
│                                             │
│  三端差异化                                  │
│  ├─ Web：功能最全，管理操作                 │
│  ├─ APP：移动办公，审批，查看               │
│  └─ HarmonyOS：适配华为生态                 │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. 官网展示内部系统

**官网页面结构**:
```
首页 (/)
├── 产品中心 (/products)
├── 解决方案 (/solutions)
├── 经销商加盟 (/dealer)
├── 服务支持 (/service)
├── 关于我们 (/about)
├── 联系我们 (/contact)
└── 业务管理系统 (/portal) ← 系统实力展示
    ├── 系统介绍页
    ├── 功能模块展示
    └── [登录系统] 按钮
```

**官网底部展示区**:
```
┌─────────────────────────────────────────────┐
│  🏢 道达智能 - 完整的业务管理体系            │
│                                             │
│  十大系统：                                  │
│  [CRM] [ERP] [财务] [外贸] [售后]           │
│  [人力] [CMS] [消息] [审批] [系统管理]      │
│                                             │
│  💼 企业客户 [登录系统]  |  📱 [下载 APP]   │
└─────────────────────────────────────────────┘
```

---

## 📱 三端详细设计

### Web 门户（主战场）

**技术栈**:
- React 18 + Vite 5.4
- Ant Design 5
- React Router v6
- JWT 认证

**目录结构**:
```
portal/
├── src/
│   ├── modules/          # 10 大系统模块
│   │   ├── crm/         # CRM (10 模块)
│   │   ├── erp/         # ERP (10 模块)
│   │   ├── finance/     # 财务 (6 模块)
│   │   ├── foreign/     # 外贸 (8 模块)
│   │   ├── aftersales/  # 售后 (6 模块)
│   │   ├── hr/          # 人力 (6 模块)
│   │   ├── cms/         # CMS (6 模块)
│   │   ├── message/     # 消息 (6 模块)
│   │   ├── workflow/    # 审批流 (6 模块)
│   │   └── admin/       # 系统管理
│   ├── layouts/         # 布局组件
│   │   ├── WebsiteLayout.tsx
│   │   └── PortalLayout.tsx
│   ├── shared/          # 共享组件
│   ├── services/        # API 服务
│   ├── store/           # 状态管理
│   ├── types/           # TypeScript 类型
│   ├── utils/           # 工具函数
│   └── App.tsx          # 统一路由
├── public/
├── package.json
├── vite.config.ts
└── Dockerfile
```

### 手机 APP（移动端）

**技术栈**:
- React Native (推荐) 或 Capacitor (现有)
- React Navigation
- 与 Web 共享 API 服务层

**代码共享策略**:
```
packages/
├── shared/              # 共享代码包
│   ├── api/            # API 调用
│   ├── utils/          # 工具函数
│   ├── hooks/          # 自定义 Hooks
│   ├── types/          # TypeScript 类型
│   └── constants/      # 常量配置
├── web/                 # Web 专用
│   └── ...
└── mobile/              # 移动端专用
    └── ...
```

**功能定位**:
- **移动办公**：审批、查看、通知
- **外勤场景**：销售拜访、售后服务
- **即时通知**：推送提醒

### HarmonyOS APP

**定位**: 与手机 APP 功能类似，适配华为生态

**特殊能力**:
- 华为推送服务
- 华为账号登录（可选）
- 鸿蒙系统特性适配

---

## 🚀 一键部署方案

### Docker Compose（统一版）

```yaml
version: '3.8'

services:
  # ==================== 数据库 ====================
  postgres:
    image: postgres:15-alpine
    container_name: daoda-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: daoda
      POSTGRES_USER: daoda
      POSTGRES_PASSWORD: ${DB_PASSWORD:-Daoda@2026!}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    networks:
      - daoda-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U daoda"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== Redis 缓存 ====================
  redis:
    image: redis:7-alpine
    container_name: daoda-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - daoda-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==================== 后端 API ====================
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: daoda-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://daoda:${DB_PASSWORD}@postgres:5432/daoda
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET:-change-me-in-production}
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - daoda-network

  # ==================== 前端（官网 + 门户） ====================
  frontend:
    build:
      context: ./portal
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=/api
    container_name: daoda-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: production
    ports:
      - "80:80"
    depends_on:
      - api
    volumes:
      - ./portal:/app
      - /app/node_modules
    networks:
      - daoda-network

  # ==================== Nginx 反向代理 ====================
  nginx:
    image: nginx:alpine
    container_name: daoda-nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - api
    networks:
      - daoda-network

volumes:
  postgres_data:
  redis_data:

networks:
  daoda-network:
    driver: bridge
```

### Nginx 配置

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:80;
    }

    upstream api {
        server api:3001;
    }

    server {
        listen 80;
        server_name localhost;

        # 前端
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # API
        location /api {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 部署脚本

```bash
#!/bin/bash
# deploy.sh - 一键部署脚本

set -e

echo "🚀 道达智能系统 - 一键部署"
echo "================================"

# 检查环境
echo "📋 检查环境..."
command -v docker >/dev/null 2>&1 || { echo "❌ Docker 未安装"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose 未安装"; exit 1; }

# 加载环境变量
echo "⚙️  加载配置..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  .env 文件已创建，请修改配置后重新运行"
    exit 0
fi

# 构建镜像
echo "🔨 构建镜像..."
docker-compose build

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 健康检查
echo "🏥 健康检查..."
sleep 15
docker-compose ps

# 显示访问信息
echo ""
echo "================================"
echo "✅ 部署完成！"
echo ""
echo "📱 访问地址："
echo "   官网 + 门户：http://localhost:8080"
echo "   API 地址：http://localhost:8080/api"
echo "   管理后台：http://localhost:8080/portal"
echo ""
echo "🔧 常用命令："
echo "   查看日志：docker-compose logs -f"
echo "   停止服务：docker-compose down"
echo "   重启服务：docker-compose restart"
echo ""
```

---

## 📋 实施步骤

### Phase 1: 代码重组（3-5 天）

**目标**: 将现有代码重组为统一门户结构

**任务**:
1. [ ] 创建 portal/ 目录结构
2. [ ] 移动 website/ 和 crm/ 代码到 portal/
3. [ ] 创建 WebsiteLayout 和 PortalLayout
4. [ ] 统一路由配置
5. [ ] 创建门户工作台首页

**交付物**:
- ✅ 统一前端代码结构
- ✅ 统一路由系统
- ✅ 门户工作台

---

### Phase 2: 官网优化（2-3 天）

**目标**: 在官网展示公司实力和系统入口

**任务**:
1. [ ] 创建"业务管理系统"介绍页
2. [ ] 在官网首页添加系统入口展示
3. [ ] 在官网底部添加系统导航
4. [ ] 优化官网 UI/UX
5. [ ] 添加 APP 下载入口

**交付物**:
- ✅ 官网系统展示区
- ✅ 登录入口
- ✅ APP 下载引导

---

### Phase 3: 部署配置（2 天）

**目标**: Docker Compose 一键部署

**任务**:
1. [ ] 编写 Dockerfile（前端、后端）
2. [ ] 编写 docker-compose.yml
3. [ ] 编写 nginx 配置
4. [ ] 编写部署脚本
5. [ ] 测试部署流程

**交付物**:
- ✅ Docker 配置文件
- ✅ 一键部署脚本
- ✅ 部署文档

---

### Phase 4: 鸿蒙 API 网关改造（2-3 天）

**目标**: harmony-server 改造为 API 代理，统一认证

**任务**:
1. [ ] harmony-server 改为 API 代理
2. [ ] 统一 JWT 认证
3. [ ] WebSocket 服务保留
4. [ ] API 路径统一 (`/api/v1/harmony` → `/api/v1`)
5. [ ] 测试验证

**交付物**:
- ✅ 改造后的 harmony-server
- ✅ 统一认证流程
- ✅ 测试报告

---

### Phase 5: 全面测试与优化（3-5 天）

**目标**: 全面测试、性能优化

**任务**:
1. [ ] Web 端功能测试
2. [ ] 鸿蒙 APP 兼容性测试
3. [ ] 性能测试
4. [ ] 安全测试
5. [ ] 文档更新

**交付物**:
- ✅ 测试报告
- ✅ 性能优化报告
- ✅ 更新文档

---

### Phase 5: 测试与优化（持续）

**目标**: 全面测试、性能优化

**任务**:
1. [ ] 功能测试
2. [ ] 性能测试
3. [ ] 安全测试
4. [ ] 用户体验优化
5. [ ] 文档更新

**交付物**:
- ✅ 测试报告
- ✅ 性能优化报告
- ✅ 更新文档

---

## 📊 技术选型对比

| 组件 | 原方案 | 新方案 | 说明 |
|------|--------|--------|------|
| **前端框架** | React + Vite | React + Vite | ✅ 保持不变 |
| **UI 库** | Ant Design 5 | Ant Design 5 | ✅ 保持不变 |
| **路由** | React Router | React Router v6 | ✅ 升级 |
| **认证** | 会话+JWT | 统一 JWT | ✅ 简化 |
| **部署** | 手动部署 | Docker Compose | ✅ 自动化 |
| **官网** | 独立项目 | 统一前端模块 | ✅ 统一维护 |
| **APP** | Capacitor | React Native | 🔄 推荐升级 |
| **数据库** | PostgreSQL | PostgreSQL 15 | ✅ 升级版本 |

---

## ✅ 成功标准

### 功能性
- [ ] 官网展示公司实力和系统入口
- [ ] 内部系统通过统一门户访问
- [ ] 三端共享同一套后端和权限
- [ ] 所有现有功能正常迁移
- [ ] 10 大系统、81 模块全部可用

### 部署
- [ ] 一键部署成功（`./deploy.sh`）
- [ ] 所有服务健康运行
- [ ] 回滚方案可行

### 性能
- [ ] 官网加载 < 2s
- [ ] 门户加载 < 3s
- [ ] API 响应 < 500ms
- [ ] 支持 1000+ 并发用户

### 用户体验
- [ ] 官网彰显公司实力
- [ ] 内部系统易用
- [ ] 三端体验一致
- [ ] 移动端适配良好

---

## 📚 参考文档

### 核心系统文档（10 份）
- [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) — 系统总览
- [ERP_SYSTEM_GUIDE.md](./ERP_SYSTEM_GUIDE.md) — ERP 系统指南
- [FINANCE_SYSTEM_GUIDE.md](./FINANCE_SYSTEM_GUIDE.md) — 财务系统指南
- [FOREIGN_TRADE_SYSTEM.md](./FOREIGN_TRADE_SYSTEM.md) — 外贸系统指南
- [MESSAGE_CENTER_GUIDE.md](./MESSAGE_CENTER_GUIDE.md) — 消息中心指南
- [CRM_SYSTEM_GUIDE.md](./CRM_SYSTEM_GUIDE.md) — CRM 系统指南
- [AFTER_SALES_GUIDE.md](./AFTER_SALES_GUIDE.md) — 售后系统指南
- [HR_SYSTEM_GUIDE.md](./HR_SYSTEM_GUIDE.md) — HR 系统指南
- [CMS_SYSTEM_GUIDE.md](./CMS_SYSTEM_GUIDE.md) — CMS 系统指南
- [WORKFLOW_SYSTEM_GUIDE.md](./WORKFLOW_SYSTEM_GUIDE.md) — 审批流系统指南

### 项目文档
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) — 文档索引
- [DOCUMENTATION_CLEANUP_REPORT.md](./DOCUMENTATION_CLEANUP_REPORT.md) — 文档整理报告
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — 部署指南

### 外部参考
- [企业门户架构技能](~/.agents/skills/enterprise-portal-architecture/SKILL.md)
- [部署指南](~/.agents/skills/enterprise-portal-architecture/references/deployment-guide.md)

---

## 🚀 下一步行动

### 立即执行（今天）
1. **确认架构方案**（主人审批）✅
2. **创建 portal/ 目录结构**
3. **开始代码重组**

### 本周完成（2026-03-14 ~ 2026-03-20）
1. **Phase 1**: 代码重组（3-5 天）
2. **Phase 2**: 官网优化（2-3 天）
3. **Phase 3**: 部署配置（2 天）

### 下周开始（2026-03-21 ~）
1. **Phase 4**: 三端统一（3-5 天）
2. **Phase 5**: 测试与优化（持续）
3. **用户培训**: 内部使用文档

---

## 📈 项目进度追踪

| Phase | 任务 | 开始日期 | 结束日期 | 状态 |
|-------|------|----------|----------|------|
| Phase 0 | 文档体系建设 | 2026-03-14 | 2026-03-14 | ✅ 完成 |
| Phase 1 | 代码重组 (官网 + 门户) | 2026-03-14 | 2026-03-18 | ⏳ 待开始 |
| Phase 2 | 官网优化 | 2026-03-17 | 2026-03-19 | ⏳ 待开始 |
| Phase 3 | 部署配置 | 2026-03-19 | 2026-03-20 | ⏳ 待开始 |
| Phase 4 | 鸿蒙 API 网关改造 | 2026-03-21 | 2026-03-23 | ⏳ 后续 |
| Phase 5 | 全面测试优化 | 2026-03-24 | 持续 | ⏳ 后续 |

### 鸿蒙 APP 状态
| 项目 | 状态 | 说明 |
|------|------|------|
| 鸿蒙前端 | ✅ 不重构 | 50+ 页面 ArkTS 代码保持不变 |
| 鸿蒙后端 | ⏳ Phase 4 改造 | 改为 API 代理，统一认证 |

---

## 🎯 决策点

- [x] 官网展示内部系统入口（已确认）
- [x] 三端统一架构（已确认）
- [x] 一键自动化部署（已确认）
- [x] 文档体系先行（✅ 已完成）
- [ ] 开始实施时间：**立即开始**

---

**版本**: 3.0  
**最后更新**: 2026-03-14  
**下次审查**: Phase 1 完成后  
**维护人**: 渔晓白 ⚙️
