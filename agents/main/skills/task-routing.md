# 任务路由技能

## 📋 技能说明

根据任务分析结果，选择最优的 Agent 和模型组合。

---

## 🎯 路由决策

### 核心逻辑

```typescript
function routeTask(analysis: TaskAnalysis): RoutingDecision {
  const { type, subtype, complexity } = analysis
  
  // 1. 获取路由配置
  const config = ROUTING_MATRIX[type]
  
  // 2. 选择模型（基于复杂度）
  const modelIndex = complexity === 'simple' ? 0 : complexity === 'medium' ? 1 : 2
  const model = config.models[modelIndex]
  
  // 3. 选择 Agent（基于子类型）
  const agent = selectAgent(type, subtype)
  
  // 4. 选择技能
  const skill = selectSkill(agent, subtype)
  
  return { agent, model, skill, reason: generateReason(analysis) }
}
```

---

## 📝 路由矩阵

```typescript
const ROUTING_MATRIX = {
  // 代码开发
  code: {
    models: ['qwen3.5-plus', 'qwen3-coder-next', 'qwen3-coder-plus'],
    agents: {
      frontend: 'frontend-dev',
      backend: 'backend-dev',
      database: 'database-engineer',
      fullstack: ['frontend-dev', 'backend-dev']
    }
  },
  
  // 架构设计
  architecture: {
    models: ['qwen3-max', 'qwen3-max', 'qwen3-max'],
    agents: {
      system: 'architect',
      api: 'architect',
      database: 'database-engineer',
      security: 'security-engineer'
    }
  },
  
  // 产品需求
  product: {
    models: ['glm-5', 'glm-5', 'qwen3-max'],
    agents: {
      analysis: 'product-manager',
      document: 'product-manager',
      roadmap: 'product-manager'
    }
  },
  
  // UI/UX 设计
  design: {
    models: ['glm-5', 'glm-5', 'qwen3-max'],
    agents: {
      visual: 'ui-ux-designer',
      interaction: 'ui-ux-designer',
      prototype: 'ui-ux-designer'
    }
  },
  
  // 测试
  test: {
    models: ['qwen3.5-plus', 'qwen3.5-plus', 'qwen3.5-plus'],
    agents: {
      unit: 'test-engineer',
      integration: 'test-engineer',
      e2e: 'test-engineer'
    }
  },
  
  // 安全
  security: {
    models: ['qwen3-max', 'qwen3-max', 'qwen3-max'],
    agents: {
      audit: 'security-engineer',
      pentest: 'security-engineer',
      review: 'security-engineer'
    }
  },
  
  // 部署运维
  devops: {
    models: ['qwen3.5-plus', 'qwen3.5-plus', 'qwen3-max'],
    agents: {
      deploy: 'devops-engineer',
      config: 'devops-engineer',
      monitor: 'devops-engineer'
    }
  },
  
  // 文档
  document: {
    models: ['qwen3.5-plus', 'kimi-k2.5', 'kimi-k2.5'],
    agents: {
      read: 'coordinator',
      write: 'coordinator',
      analyze: 'coordinator'
    }
  },
  
  // 审查
  review: {
    models: ['qwen3.5-plus', 'qwen3-max', 'qwen3-max'],
    agents: {
      quality: 'code-reviewer',
      security: 'security-engineer',
      performance: 'code-reviewer'
    }
  }
}
```

---

## 📝 并行路由

当任务可并行时：

```typescript
function parallelRoute(tasks: SubTask[]): RoutingDecision[] {
  return tasks.map(task => routeTask(task))
}

// 示例：全栈开发并行
const parallelAgents = ['frontend-dev', 'backend-dev']

// 并行执行
await Promise.all(
  parallelAgents.map(agent => spawnAgent(agent, task))
)
```

---

## ✅ 路由原则

1. **最小成本** - 简单任务用性价比模型
2. **最优质量** - 复杂任务用高级模型
3. **专业匹配** - 任务类型匹配 Agent 专长
4. **负载均衡** - 避免单个 Agent 过载

---

## 📚 相关元技能

- `task-analysis` - 任务理解
- `task-decomposition` - 任务分解