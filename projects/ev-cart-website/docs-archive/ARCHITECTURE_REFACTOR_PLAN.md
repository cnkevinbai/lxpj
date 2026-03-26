# 道达智能门户架构重构方案 v2

**创建时间**: 2026-03-13  
**更新时间**: 2026-03-13  
**状态**: 待实施  
**优先级**: 高

## 🎯 核心原则

1. **统一部署**：所有系统一键自动化部署，不分开部署
2. **官网展示**：对外官网需要展示公司实力和内部系统入口（彰显正规化、规模化）
3. **三端统一**：Web 门户 + 手机 APP + HarmonyOS APP，共享同一套后端和权限体系

---

## 🏗️ 目标架构（三端统一）

```
┌─────────────────────────────────────────────────────────────┐
│                    对外官网 (Public)                         │
│  Domain: www.ddzn.com                                        │
│  技术栈：Next.js 14 (SSR + SEO) 或 现有 React               │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 首页 │ 产品中心 │ 解决方案 │ 经销商 │ 服务 │ 关于我们 │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   🏆 道达智能 - 行业领先的车联网解决方案提供商           │  │
│  │                                                        │  │
│  │   [产品展示]  [客户案例]  [新闻动态]                   │  │
│  │                                                        │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │   🚀 强大的业务管理系统 - 彰显公司实力                  │  │
│  │                                                        │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │   │  CRM     │ │  ERP     │ │  财务    │             │  │
│  │   │  客户管理 │ │  企业资源 │ │  管理    │             │  │
│  │   │  系统    │ │  系统    │ │  系统    │             │  │
│  │   └──────────┘ └──────────┘ └──────────┘             │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │   │  售后    │ │  渠道    │ │  人力    │             │  │
│  │   │  服务    │ │  管理    │ │  资源    │             │  │
│  │   │  系统    │ │  系统    │ │  系统    │             │  │
│  │   └──────────┘ └──────────┘ └──────────┘             │  │
│  │                                                        │  │
│  │   💼 企业客户专属入口                                  │  │
│  │   [登录业务管理系统] → /portal/login                  │  │
│  │   📱 移动端                                            │  │
│  │   [App Store] [华为应用市场] [扫码下载]                │  │
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
│ /finance      │   │ 财务         │   │ 财务         │
│ /service      │   │ 售后         │   │ 售后         │
│               │   │               │   │              │
│ 统一认证 JWT   │   │ 统一认证 JWT   │   │ 统一认证 JWT   │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │          统一后端 API (Node.js)          │
        │                                         │
        │  /api/auth/*      认证授权              │
        │  /api/crm/*       CRM 功能              │
        │  /api/erp/*       ERP 功能              │
        │  /api/finance/*   财务功能              │
        │  /api/service/*   售后功能              │
        │  /api/common/*    公共功能              │
        │                                         │
        │  JWT 验证 + 角色权限控制                 │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │       数据库 (PostgreSQL)                │
        │                                         │
        │  users          用户表                  │
        │  roles          角色表                  │
        │  permissions    权限表                  │
        │  crm_*          CRM 数据                │
        │  erp_*          ERP 数据                │
        │  finance_*      财务数据                │
        │  service_*      售后数据                │
        └─────────────────────────────────────────┘
```

---

## 📐 关键设计决策

### 1. 官网定位

**功能**：
- ✅ 公司形象展示（正规化、规模化）
- ✅ 产品展示和介绍
- ✅ 经销商加盟入口
- ✅ **展示内部系统实力**（给客户信心）
- ✅ 提供内部系统登录入口（彰显专业性）

**技术选择**：
- **方案 A**：保持现有 React 实现（简单，代码复用）
- **方案 B**：独立 Next.js 项目（SEO 更好，但需要单独维护）

**推荐**：方案 A - 保持现有 React，因为：
- 代码已经在现有项目中
- 统一部署，无需额外维护
- SEO 可以通过 SSR 优化

### 2. 三端关系

```
┌─────────────────────────────────────────────┐
│              三端统一核心                    │
├─────────────────────────────────────────────┤
│                                             │
│  同一套后端 API                              │
│  ├─ /api/auth/*    (认证)                   │
│  ├─ /api/crm/*     (CRM 功能)               │
│  ├─ /api/erp/*     (ERP 功能)               │
│  └─ ...                                      │
│                                             │
│  同一个数据库                                │
│  ├─ users (用户统一)                         │
│  ├─ roles (角色统一)                         │
│  └─ 业务数据 (共享)                          │
│                                             │
│  同一套权限体系                              │
│  ├─ JWT Token (统一认证)                     │
│  ├─ 角色权限 (统一控制)                      │
│  └─ 数据权限 (统一模型)                      │
│                                             │
│  三端差异                                    │
│  ├─ Web 门户：功能最全，管理操作             │
│  ├─ 手机 APP：移动办公，审批，查看           │
│  └─ HarmonyOS：与手机 APP 功能类似            │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. 官网如何展示内部系统

**官网页面结构**：
```
首页 (/)
├── 产品中心 (/products)
├── 解决方案 (/solutions)
├── 经销商加盟 (/dealer)
├── 服务支持 (/service)
├── 关于我们 (/about)
├── 联系我们 (/contact)
└── 业务管理系统入口 (/portal) ← 新增
    ├── 系统介绍（展示实力）
    ├── 功能模块介绍
    └── [登录] 按钮
```

**官网底部展示**：
```
┌─────────────────────────────────────────────┐
│  🏢 道达智能 - 完整的业务管理体系             │
│                                             │
│  [CRM] [ERP] [财务] [售后] [渠道] [人力]    │
│                                             │
│  企业客户 [登录系统] | [下载 APP]            │
└─────────────────────────────────────────────┘
```

---

## 📱 三端详细设计

### Web 门户（主战场）

**技术栈**：
- React 18 + Vite
- Ant Design 5
- React Router v6
- JWT 认证

**模块结构**：
```
src/
├── modules/
│   ├── portal/        # 门户工作台（入口）
│   │   ├── Dashboard.tsx
│   │   ├── AppLauncher.tsx
│   │   └── NotificationCenter.tsx
│   ├── crm/          # CRM 模块
│   │   ├── pages/
│   │   ├── components/
│   │   └── routes.tsx
│   ├── erp/          # ERP 模块
│   ├── finance/      # 财务模块
│   ├── aftersales/   # 售后模块
│   ├── hr/           # 人力模块
│   └── admin/        # 系统管理
├── layout/
│   ├── MainLayout.tsx    # 内部系统布局
│   └── WebsiteLayout.tsx # 官网布局
├── shared/           # 共享组件
└── App.tsx          # 统一路由
```

**路由设计**：
```typescript
// App.tsx
<Routes>
  {/* 官网路由 */}
  <Route path="/" element={<WebsiteLayout />}>
    <Route index element={<Home />} />
    <Route path="products" element={<Products />} />
    <Route path="solutions" element={<Solutions />} />
    <Route path="dealer" element={<Dealer />} />
    <Route path="service" element={<Service />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="portal" element={<PortalIntro />} /> {/* 系统介绍页 */}
  </Route>

  {/* 内部系统路由 */}
  <Route path="/portal" element={<MainLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="crm/*" element={<CRMModule />} />
    <Route path="erp/*" element={<ERPModule />} />
    <Route path="finance/*" element={<FinanceModule />} />
    <Route path="service/*" element={<ServiceModule />} />
    <Route path="admin/*" element={<AdminModule />} />
  </Route>

  {/* 登录页 */}
  <Route path="/login" element={<Login />} />
</Routes>
```

---

### 手机 APP（移动端）

**技术栈**：
- React Native（与 Web 共享业务逻辑）
- 或 现有 Capacitor 方案

**与 Web 关系**：
```
┌─────────────────────────────────────────┐
│           代码共享策略                   │
├─────────────────────────────────────────┤
│                                         │
│  共享层 (packages/shared)                │
│  ├─ api/         API 调用               │
│  ├─ utils/       工具函数               │
│  ├─ hooks/       自定义 Hooks           │
│  ├─ types/       TypeScript 类型        │
│  └─ constants/   常量配置               │
│                                         │
│  Web 专用          移动端专用            │
│  ├─ Ant Design   ├─ React Native UI    │
│  ├─ React Router ├─ React Navigation   │
│  └─ 桌面布局     └─ 移动布局            │
│                                         │
└─────────────────────────────────────────┘
```

**功能定位**：
- **移动办公**：审批、查看、通知
- **外勤场景**：销售拜访、售后服务
- **即时通知**：推送提醒

**核心功能**：
```
首页
├── 待办审批
├── 数据看板
├── 快捷入口
│   ├── 客户查询 (CRM)
│   ├── 订单管理 (ERP)
│   ├── 服务工单 (售后)
│   └── 消息通知
└── 个人中心
```

---

### HarmonyOS APP

**定位**：与手机 APP 功能类似，适配华为生态

**技术栈**：
- 现有方案保持不变
- 与 React Native 共享业务逻辑

**特殊能力**：
- 华为推送
- 华为账号登录（可选）
- 鸿蒙系统特性

---

## 🚀 一键部署方案

### Docker Compose（完整版）

```yaml
version: '3.8'

services:
  # ==================== 数据库 ====================
  postgres:
    image: postgres:14-alpine
    container_name: daoda-db
    environment:
      POSTGRES_DB: daoda
      POSTGRES_USER: daoda
      POSTGRES_PASSWORD: ${DB_PASSWORD:-Daoda@2026}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U daoda"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - daoda-network

  # ==================== 后端 API ====================
  api-server:
    build:
      context: ./api-server
      dockerfile: Dockerfile
    container_name: daoda-api
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://daoda:${DB_PASSWORD}@postgres:5432/daoda
      JWT_SECRET: ${JWT_SECRET:-your-secret-key-change-in-production}
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./api-server:/app
      - /app/node_modules
    networks:
      - daoda-network

  # ==================== 前端（统一门户 + 官网） ====================
  frontend:
    build:
      context: ./crm  # 重构后的统一前端
      dockerfile: Dockerfile
    container_name: daoda-frontend
    environment:
      REACT_APP_API_URL: /api
      REACT_APP_VERSION: ${VERSION:-latest}
    ports:
      - "80:80"
    depends_on:
      - api-server
    volumes:
      - ./crm:/app
      - /app/node_modules
    networks:
      - daoda-network

  # ==================== Nginx 反向代理 ====================
  nginx:
    image: nginx:alpine
    container_name: daoda-nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - api-server
    networks:
      - daoda-network

  # ==================== Redis (缓存 + 会话) ====================
  redis:
    image: redis:7-alpine
    container_name: daoda-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - daoda-network

volumes:
  postgres_data:
  redis_data:

networks:
  daoda-network:
    driver: bridge
```

### 部署脚本

```bash
#!/bin/bash
# deploy.sh - 一键部署脚本

echo "🚀 道达智能系统 - 一键部署"
echo "================================"

# 1. 检查环境
echo "📋 检查环境..."
docker --version || { echo "❌ Docker 未安装"; exit 1; }
docker-compose --version || { echo "❌ Docker Compose 未安装"; exit 1; }

# 2. 加载环境变量
echo "⚙️  加载配置..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  .env 文件已创建，请修改配置后重新运行"
  exit 0
fi

# 3. 构建镜像
echo "🔨 构建镜像..."
docker-compose build

# 4. 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 5. 健康检查
echo "🏥 健康检查..."
sleep 10
docker-compose ps

# 6. 显示访问信息
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

### 使用方式

```bash
# 首次部署
chmod +x deploy.sh
./deploy.sh

# 更新部署
docker-compose pull
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend

# 停止服务
docker-compose down
```

---

## 📋 实施步骤

### Phase 1: 架构整理（1 周）

**目标**：将现有代码重组为模块化结构

**任务**：
1. [ ] 创建模块目录结构
2. [ ] 移动现有代码到对应模块
3. [ ] 统一路由配置
4. [ ] 统一权限模型
5. [ ] 创建门户工作台首页

**交付物**：
- 模块化代码结构
- 统一路由系统
- 门户工作台

---

### Phase 2: 官网优化（3-5 天）

**目标**：在官网展示公司实力和系统入口

**任务**：
1. [ ] 创建"业务管理系统"介绍页
2. [ ] 在官网首页添加系统入口展示
3. [ ] 在官网底部添加系统导航
4. [ ] 优化官网 UI/UX
5. [ ] 添加 APP 下载入口

**交付物**：
- 官网系统展示区
- 登录入口
- APP 下载引导

---

### Phase 3: 三端统一（1 周）

**目标**：Web、APP、HarmonyOS 共享后端和权限

**任务**：
1. [ ] 统一 API 接口规范
2. [ ] 统一 JWT 认证
3. [ ] 统一权限模型
4. [ ] APP 适配新架构
5. [ ] HarmonyOS 适配新架构

**交付物**：
- 统一 API 文档
- 三端认证打通
- 权限体系统一

---

### Phase 4: 一键部署（2-3 天）

**目标**：Docker Compose 一键部署

**任务**：
1. [ ] 编写 Dockerfile（前端、后端）
2. [ ] 编写 docker-compose.yml
3. [ ] 编写 nginx 配置
4. [ ] 编写部署脚本
5. [ ] 测试部署流程

**交付物**：
- Docker 配置文件
- 一键部署脚本
- 部署文档

---

### Phase 5: 错误修复与优化（持续）

**目标**：修复当前错误，持续优化

**任务**：
1. [ ] 修复 Jobs 重复声明错误
2. [ ] 运行全面测试
3. [ ] 性能优化
4. [ ] 用户体验优化

---

## 📊 技术选型对比

| 组件 | 原方案 | 调整后方案 | 说明 |
|------|--------|------------|------|
| **前端框架** | React + Vite | React + Vite | ✅ 保持不变 |
| **UI 库** | Ant Design 5 | Ant Design 5 | ✅ 保持不变 |
| **路由** | React Router | React Router v6 | ✅ 升级版本 |
| **认证** | 会话 +JWT | 统一 JWT | ✅ 简化 |
| **部署** | 手动部署 | Docker Compose | ✅ 自动化 |
| **官网** | 混合在项目中 | 项目中独立模块 | ✅ 统一维护 |
| **APP** | Capacitor | React Native(推荐) | 🔄 可升级 |
| **数据库** | PostgreSQL | PostgreSQL | ✅ 保持不变 |

---

## ✅ 成功标准

### 功能性
- [ ] 官网展示公司实力和系统入口
- [ ] 内部系统通过统一门户访问
- [ ] 三端共享同一套后端和权限
- [ ] 所有现有功能正常迁移

### 部署
- [ ] 一键部署成功（docker-compose up -d）
- [ ] 所有服务健康运行
- [ ] 回滚方案可行

### 性能
- [ ] 官网加载 < 2s
- [ ] 门户加载 < 3s
- [ ] API 响应 < 500ms

### 用户体验
- [ ] 官网彰显公司实力
- [ ] 内部系统易用
- [ ] 三端体验一致

---

## 📚 参考文档

- [企业门户架构技能](../../../.agents/skills/enterprise-portal-architecture/SKILL.md)
- [部署指南](../../../.agents/skills/enterprise-portal-architecture/references/deployment-guide.md)
- [现有项目文档](./README.md)

---

## 🚀 下一步行动

### 立即执行（今天）
1. **修复当前错误**（Jobs 重复声明）
2. **确认架构方案**（主人审批）
3. **开始模块重组**

### 本周完成
1. **模块划分**：CRM、ERP、财务等
2. **门户工作台**：统一入口
3. **官网优化**：添加系统展示
4. **部署配置**：Docker Compose

### 下周开始
1. **三端统一**：API、认证、权限
2. **功能完善**：渐进式优化
3. **用户培训**：内部使用文档

---

**决策点**:
- [x] 官网展示内部系统入口（已确认）
- [x] 三端统一架构（已确认）
- [x] 一键自动化部署（已确认）
- [ ] 开始实施时间：**立即开始**

---

**最后更新**: 2026-03-13  
**下次审查**: 实施完成后
