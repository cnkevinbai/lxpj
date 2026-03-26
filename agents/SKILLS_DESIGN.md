# Agent 技能体系设计

## 🎯 设计原则

1. **专业化** - 每个 Agent 有明确的专业技能
2. **可组合** - 技能可以组合使用
3. **可扩展** - 方便添加新技能
4. **标准化** - 统一的输出格式

---

## 📋 Agent - 技能映射表

### 💻 前端开发 Chloe (frontend-dev)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `react-component` | React 组件开发 | 函数组件、Hooks、状态管理 |
| `typescript` | TypeScript 开发 | 类型定义、泛型、装饰器 |
| `css-styling` | CSS 样式开发 | Tailwind、CSS Modules、响应式 |
| `state-management` | 状态管理 | Redux、Zustand、Context |
| `testing-frontend` | 前端测试 | Jest、Testing Library |
| `performance` | 性能优化 | 懒加载、虚拟列表、缓存 |

### ⚙️ 后端开发 Ryan (backend-dev)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `nestjs-api` | NestJS API 开发 | Controller、Service、DTO |
| `prisma-orm` | Prisma 数据库 | Schema、查询、事务 |
| `auth-security` | 认证授权 | JWT、OAuth、权限控制 |
| `api-design` | API 设计 | REST、GraphQL、规范 |
| `testing-backend` | 后端测试 | 单元测试、集成测试 |
| `performance-db` | 数据库优化 | 索引、查询优化、缓存 |

### 🏗️ 架构师 Morgan (architect)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `system-design` | 系统设计 | 微服务、单体、事件驱动 |
| `api-architecture` | API 架构 | 网关、版本控制、契约 |
| `database-arch` | 数据库架构 | 分库分表、读写分离 |
| `security-arch` | 安全架构 | 零信任、纵深防御 |
| `tech-selection` | 技术选型 | 框架对比、决策矩阵 |

### 📋 产品经理 Alex (product-manager)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `requirement-analysis` | 需求分析 | 用户故事、用例图 |
| `prd-writing` | PRD 文档 | 产品需求文档编写 |
| `user-research` | 用户研究 | 用户画像、用户旅程 |
| `data-analysis` | 数据分析 | 指标定义、A/B 测试 |

### 🔒 安全工程师 Sophia (security-engineer)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `security-audit` | 安全审计 | 代码审计、配置检查 |
| `penetration-test` | 渗透测试 | 漏洞扫描、攻击模拟 |
| `auth-review` | 认证审查 | 权限模型、会话管理 |
| `owasp` | OWASP 检查 | Top 10 漏洞检测 |

### 🧪 测试工程师 Taylor (test-engineer)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `unit-test` | 单元测试 | Jest、Vitest、Pytest |
| `e2e-test` | E2E 测试 | Cypress、Playwright |
| `api-test` | API 测试 | Postman、Supertest |
| `test-coverage` | 测试覆盖率 | 报告、阈值检查 |

### 🚀 DevOps 工程师 Sam (devops-engineer)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `docker` | Docker 容器 | Dockerfile、Compose |
| `cicd` | CI/CD 流水线 | GitHub Actions、GitLab CI |
| `kubernetes` | K8s 部署 | Deployment、Service |
| `monitoring` | 监控告警 | Prometheus、Grafana |

### 👀 代码审查员 Blake (code-reviewer)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `code-quality` | 代码质量 | 可读性、可维护性 |
| `best-practices` | 最佳实践 | 设计模式、代码规范 |
| `performance-review` | 性能审查 | 算法、资源使用 |
| `security-review` | 安全审查 | 漏洞、权限检查 |

### 🗄️ 数据库工程师 Diana (database-engineer)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `schema-design` | Schema 设计 | 表结构、关系设计 |
| `query-optimization` | 查询优化 | 索引、执行计划 |
| `data-migration` | 数据迁移 | 版本控制、迁移脚本 |
| `redis-cache` | Redis 缓存 | 缓存策略、数据结构 |

### 📚 协调员 Casey (coordinator)

| 技能 ID | 技能名称 | 说明 |
|---------|---------|------|
| `task-routing` | 任务路由 | 分配任务给合适 Agent |
| `progress-tracking` | 进度跟踪 | 任务状态、依赖管理 |
| `report-generation` | 报告生成 | 汇总报告、状态更新 |
| `document-analysis` | 文档分析 | 长文档处理、多模态 |

---

## 🔧 技能调用方式

### 方式一：显式调用

```bash
# 调用前端开发的 React 组件技能
/frontend-dev:react-component 创建一个用户登录组件

# 调用后端开发的 API 设计技能
/backend-dev:nestjs-api 设计用户登录 API

# 调用架构师的系统设计技能
/architect:system-design 设计用户认证系统架构
```

### 方式二：自动识别

系统根据任务内容自动选择技能：

```
用户: "帮我开发一个 React 登录组件"
系统: 自动调用 frontend-dev 的 react-component 技能

用户: "设计用户系统架构"
系统: 自动调用 architect 的 system-design 技能
```

### 方式三：技能组合

多个技能协同工作：

```
用户: "实现用户登录功能的完整开发"

系统并行调用:
├── architect:system-design → 架构设计
├── frontend-dev:react-component → 前端组件
├── backend-dev:nestjs-api → 后端 API
├── database-engineer:schema-design → 数据库设计
├── test-engineer:unit-test → 单元测试
└── security-engineer:auth-review → 安全审查
```

---

## 📁 技能文件结构

```
~/.openclaw/workspace/agents/
├── frontend-dev/
│   ├── SKILL.md                    # Agent 主技能描述
│   └── skills/
│       ├── react-component.md      # React 组件开发
│       ├── typescript.md           # TypeScript 开发
│       ├── css-styling.md          # CSS 样式
│       ├── state-management.md     # 状态管理
│       └── testing-frontend.md     # 前端测试
│
├── backend-dev/
│   ├── SKILL.md
│   └── skills/
│       ├── nestjs-api.md
│       ├── prisma-orm.md
│       ├── auth-security.md
│       └── api-design.md
│
├── architect/
│   ├── SKILL.md
│   └── skills/
│       ├── system-design.md
│       ├── api-architecture.md
│       └── tech-selection.md
│
└── ... (其他 Agent)
```

---

## ✅ 实施建议

### 第一阶段：核心技能（立即实施）

| Agent | 优先实现的技能 |
|-------|--------------|
| frontend-dev | react-component, typescript |
| backend-dev | nestjs-api, prisma-orm |
| architect | system-design |
| code-reviewer | code-quality |

### 第二阶段：扩展技能

为每个 Agent 补充 2-3 个常用技能

### 第三阶段：高级技能

添加自动化、优化、高级分析等技能

---

要我开始为每个 Agent 创建具体的技能文件吗？