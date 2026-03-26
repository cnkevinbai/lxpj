# 多 Agent 配置

## 📋 Agent 列表

| Agent ID | 名称 | 推荐模型 | 用途 |
|----------|------|---------|------|
| `main` | 渔晓白 (主) | glm-5 | 主会话、通用任务 |
| `product-manager` | 产品经理 Alex | qwen3-max | 需求分析 |
| `architect` | 架构师 Morgan | qwen3-max | 架构设计 |
| `frontend-dev` | 前端开发 Chloe | qwen3-coder-next | 前端开发 |
| `backend-dev` | 后端开发 Ryan | qwen3-coder-next | 后端开发 |
| `database-engineer` | 数据库工程师 Diana | qwen3-max | 数据库设计 |
| `test-engineer` | 测试工程师 Taylor | qwen3.5-plus | 测试用例 |
| `devops-engineer` | DevOps 工程师 Sam | qwen3.5-plus | 部署配置 |
| `security-engineer` | 安全工程师 Sophia | qwen3-max | 安全审计 |
| `code-reviewer` | 代码审查员 Blake | qwen3-max | 代码审查 |
| `coordinator` | 协调员 Casey | qwen3-max | 团队协调 |

## 🔧 配置方法

### 1. 在 openclaw.json 中配置

```json
{
  "agents": {
    "list": [
      { "id": "main", "model": "bailian/glm-5" },
      { "id": "product-manager", "model": "bailian/qwen3-max-2026-01-23" },
      { "id": "architect", "model": "bailian/qwen3-max-2026-01-23" },
      { "id": "frontend-dev", "model": "bailian/qwen3-coder-next" },
      { "id": "backend-dev", "model": "bailian/qwen3-coder-next" },
      { "id": "database-engineer", "model": "bailian/qwen3-max-2026-01-23" },
      { "id": "test-engineer", "model": "bailian/qwen3.5-plus" },
      { "id": "devops-engineer", "model": "bailian/qwen3.5-plus" },
      { "id": "security-engineer", "model": "bailian/qwen3-max-2026-01-23" },
      { "id": "code-reviewer", "model": "bailian/qwen3-max-2026-01-23" },
      { "id": "coordinator", "model": "bailian/qwen3-max-2026-01-23" }
    ]
  }
}
```

### 2. 使用方式

```bash
# 在聊天中指定 Agent
/coordinator 分析这个需求的任务分解
/frontend-dev 创建登录页面组件
/backend-dev 实现用户登录API
/code-reviewer 审查这段代码
```

### 3. 子代理调用

通过 `sessions_spawn` 调用特定 Agent：

```json
{
  "task": "设计用户认证系统的架构",
  "agentId": "architect",
  "runtime": "subagent"
}
```

## 🚀 并行协作示例

```typescript
// 同时启动前后端开发
await sessions_spawn({
  task: "实现用户登录前端页面",
  agentId: "frontend-dev",
  runtime: "subagent"
})

await sessions_spawn({
  task: "实现用户登录后端API",
  agentId: "backend-dev",
  runtime: "subagent"
})
```

## 📂 文件结构

```
~/.openclaw/workspace/agents/
├── product-manager/
│   └── SKILL.md
├── architect/
│   └── SKILL.md
├── frontend-dev/
│   └── SKILL.md
├── backend-dev/
│   └── SKILL.md
├── database-engineer/
│   └── SKILL.md
├── test-engineer/
│   └── SKILL.md
├── devops-engineer/
│   └── SKILL.md
├── security-engineer/
│   └── SKILL.md
├── code-reviewer/
│   └── SKILL.md
├── coordinator/
│   └── SKILL.md
└── README.md
```