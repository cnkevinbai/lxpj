# 错误恢复技能

## 📋 技能说明

处理子 Agent 执行失败，实现重试、降级和回滚策略。

---

## 🎯 错误类型

| 错误类型 | 说明 | 恢复策略 |
|---------|------|---------|
| `timeout` | 执行超时 | 重试、换模型 |
| `error` | 执行错误 | 重试、换 Agent |
| `quality` | 质量不达标 | 重做、人工审核 |
| `dependency` | 依赖失败 | 等待、跳过 |

---

## 📝 恢复策略

### 重试策略

```typescript
const RETRY_POLICY = {
  maxRetries: 2,
  backoff: 'exponential',  // 指数退避
  initialDelay: 1000,      // 初始延迟 1s
  maxDelay: 10000          // 最大延迟 10s
}

async function retryWithBackoff(
  task: Task,
  policy: RetryPolicy
): Promise<Result> {
  let lastError
  
  for (let i = 0; i <= policy.maxRetries; i++) {
    try {
      return await executeTask(task)
    } catch (error) {
      lastError = error
      
      if (i < policy.maxRetries) {
        const delay = Math.min(
          policy.initialDelay * Math.pow(2, i),
          policy.maxDelay
        )
        await sleep(delay)
      }
    }
  }
  
  throw lastError
}
```

### 降级策略

```typescript
const FALLBACK_STRATEGY = {
  // 模型降级
  model: {
    'qwen3-max': 'glm-5',
    'qwen3-coder-next': 'qwen3.5-plus',
    'glm-5': 'qwen3.5-plus'
  },
  
  // Agent 降级
  agent: {
    'architect': 'backend-dev',  // 架构师不可用，后端代理
    'security-engineer': 'code-reviewer'
  }
}

async function fallback(task: Task): Promise<Result> {
  // 1. 尝试备用模型
  const fallbackModel = FALLBACK_STRATEGY.model[task.model]
  if (fallbackModel) {
    return executeWithModel(task, fallbackModel)
  }
  
  // 2. 尝试备用 Agent
  const fallbackAgent = FALLBACK_STRATEGY.agent[task.agent]
  if (fallbackAgent) {
    return executeWithAgent(task, fallbackAgent)
  }
  
  // 3. 降级到通用处理
  return handleWithMain(task)
}
```

### 回滚策略

```typescript
async function rollback(executedSteps: Step[]): Promise<void> {
  // 逆序回滚
  for (const step of executedSteps.reverse()) {
    if (step.canRollback) {
      await step.rollback()
    }
  }
}
```

---

## 📝 错误处理流程

```
执行任务
    │
    ├── 成功 → 返回结果
    │
    └── 失败
         │
         ├── 重试（最多 2 次）
         │    │
         │    ├── 成功 → 返回结果
         │    │
         │    └── 失败
         │         │
         │         ├── 尝试备用模型
         │         │
         │         ├── 尝试备用 Agent
         │         │
         │         └── 降级处理
         │
         └── 通知用户
```

---

## ✅ 恢复检查

- [ ] 错误类型正确识别
- [ ] 重试次数合理
- [ ] 降级策略执行
- [ ] 用户已通知

---

## 📚 相关元技能

- `task-routing` - 任务路由
- `result-aggregation` - 结果聚合