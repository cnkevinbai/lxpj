# 代理智能路由系统

> **版本**: v1.0  
> **配置日期**: 2026-03-18  
> **配置文件**: ~/.openclaw/openclaw.json  
> **服务实现**: ~/workspace/scripts/smart-router.ts

---

## 一、当前状态

| 项目 | 状态 | 说明 |
|------|------|------|
| 代理数量 | ✅ 12个 | 已配置完整 |
| 技能标签 (skills) | ✅ 已配置 | 每个代理有专属技能标签 |
| 智能路由 (params.autoRoute) | ✅ 已配置 | 包含关键词、任务类型、优先级 |
| 配置保存 | ✅ 成功 | openclaw.json 已更新 |
| 网关重启 | ✅ 完成 | 配置已生效 |
| 路由服务 | ✅ 已创建 | smart-router.ts |

---

## 二、已配置的代理列表

| # | ID | 名称 | 模型 | 优先级 |
|---|-----|------|------|--------|
| 1 | main | 渔晓白 | glm-5 | 10 (默认) |
| 2 | architect | 架构师 Morgan | qwen3-max | 9 |
| 3 | backend-dev | 后端开发 Ryan | qwen3-coder-next | 8 |
| 4 | frontend-dev | 前端开发 Chloe | qwen3-coder-next | 8 |
| 5 | database-engineer | 数据库工程师 Diana | qwen3-max | 7 |
| 6 | security-engineer | 安全工程师 Sophia | qwen3-max | 7 |
| 7 | ui-ux-designer | UI/UX设计师 Maya | glm-5 | 6 |
| 8 | devops-engineer | DevOps工程师 Sam | qwen3.5-plus | 6 |
| 9 | test-engineer | 测试工程师 Taylor | qwen3.5-plus | 6 |
| 10 | code-reviewer | 代码审查员 Blake | qwen3-max | 5 |
| 11 | product-manager | 产品经理 Alex | glm-5 | 5 |
| 12 | coordinator | 协调员 Casey | kimi-k2.5 | 4 |

---

## 二、智能路由规则

### 2.1 关键词匹配规则

```
任务关键词 → 自动分配代理

架构、微服务、系统设计、技术选型      → architect (架构师 Morgan)
后端、API、接口、NestJS、服务端       → backend-dev (后端开发 Ryan)
前端、React、组件、页面、Ant Design   → frontend-dev (前端开发 Chloe)
数据库、SQL、表结构、Prisma、迁移     → database-engineer (数据库工程师 Diana)
安全、认证、授权、JWT、OAuth         → security-engineer (安全工程师 Sophia)
测试、单元测试、E2E、Jest            → test-engineer (测试工程师 Taylor)
部署、Docker、K8s、CI/CD             → devops-engineer (DevOps工程师 Sam)
UI设计、用户体验、原型、Figma        → ui-ux-designer (UI/UX设计师 Maya)
代码审查、重构、代码质量              → code-reviewer (代码审查员 Blake)
产品、需求、PRD、用户故事             → product-manager (产品经理 Alex)
协调、安排、进度、汇总                → coordinator (协调员 Casey)
```

### 2.2 代理详细配置

#### 架构师 Morgan (architect)
```json
{
  "skills": ["architecture", "system-design", "microservices", "ddd", "technical-design"],
  "domains": ["erp", "mes", "service", "crm"],
  "autoRoute": {
    "keywords": ["架构", "设计", "微服务", "系统设计", "技术选型", "模块划分", "整体方案", "技术方案"],
    "taskTypes": ["architecture-design", "technical-design", "system-design", "module-design"],
    "priority": 9
  }
}
```

#### 后端开发 Ryan (backend-dev)
```json
{
  "skills": ["backend", "nestjs", "typescript", "api", "database", "prisma", "postgresql", "redis"],
  "domains": ["erp", "mes", "service", "crm"],
  "autoRoute": {
    "keywords": ["后端", "API", "接口", "服务端", "NestJS", "数据库", "控制器", "服务", "Repository", "DTO", "Entity"],
    "taskTypes": ["backend-development", "api-development", "database-operation", "service-implementation"],
    "priority": 8
  }
}
```

#### 前端开发 Chloe (frontend-dev)
```json
{
  "skills": ["frontend", "react", "typescript", "antd", "state-management", "hooks", "components"],
  "domains": ["erp", "mes", "service", "crm"],
  "autoRoute": {
    "keywords": ["前端", "React", "页面", "组件", "UI组件", "状态管理", "Hooks", "样式", "CSS", "Ant Design"],
    "taskTypes": ["frontend-development", "component-development", "page-development", "ui-implementation"],
    "priority": 8
  }
}
```

#### 数据库工程师 Diana (database-engineer)
```json
{
  "skills": ["database", "postgresql", "sql", "prisma", "indexing", "migration", "optimization", "data-modeling"],
  "domains": ["erp", "mes", "service", "crm"],
  "autoRoute": {
    "keywords": ["数据库", "SQL", "表结构", "索引", "Prisma", "迁移", "数据模型", "ER图", "查询优化", "存储过程"],
    "taskTypes": ["database-design", "sql-development", "migration", "data-modeling", "query-optimization"],
    "priority": 7
  }
}
```

---

## 三、使用方式

### 3.1 自动路由

当用户发送任务时，系统会自动分析关键词并分配给最合适的代理：

```
用户: "帮我设计一个微服务架构"
系统: 自动分配给 architect (架构师 Morgan)

用户: "写一个客户管理的API接口"
系统: 自动分配给 backend-dev (后端开发 Ryan)

用户: "优化这个SQL查询"
系统: 自动分配给 database-engineer (数据库工程师 Diana)
```

### 3.2 手动指定代理

也可以显式指定代理：

```
用户: "@architect 帮我设计系统架构"
系统: 直接使用 architect 代理

用户: "@backend-dev 实现用户登录API"
系统: 直接使用 backend-dev 代理
```

### 3.3 通过 sessions_spawn 调用

```typescript
// 使用 sessions_spawn 工具
sessions_spawn({
  task: "实现客户管理模块的后端API",
  runtime: "subagent",
  agentId: "backend-dev"  // 指定代理
})
```

---

## 四、路由优先级

当多个代理匹配时，按优先级选择：

1. **手动指定** (@代理名) - 最高优先级
2. **关键词匹配** - 按配置的 priority 字段排序
3. **默认代理** - main (渔晓白)

---

## 五、扩展配置

如需添加新的代理或修改路由规则：

1. 编辑配置文件：`~/.openclaw/openclaw.json`
2. 在 `agents.list` 中添加/修改代理配置
3. 重启网关：`openclaw gateway restart` 或通过 gateway 工具

---

*文档维护：渔晓白*  
*最后更新：2026-03-18*