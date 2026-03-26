# 主 Agent 元技能体系

## 🎯 概述

元技能（Meta-Skills）是主 Agent 用于**分析、规划、调度和协调**其他 Agent 的核心能力。

---

## 📊 元技能架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Agent (渔晓白)                       │
│                      Meta-Skills                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 任务理解    │  │ 任务规划    │  │ 任务路由    │        │
│  │ Task        │  │ Task        │  │ Task        │        │
│  │ Analysis    │  │ Planning    │  │ Routing     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 任务分解    │  │ 结果聚合    │  │ 错误恢复    │        │
│  │ Task        │  │ Result      │  │ Error       │        │
│  │ Decompose   │  │ Aggregate   │  │ Recovery    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 上下文管理  │  │ 质量保证    │  │ 学习优化    │        │
│  │ Context     │  │ Quality     │  │ Learning    │        │
│  │ Management  │  │ Assurance   │  │ Optimizing  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │         专业 Agent 池              │
        │  frontend-dev | backend-dev | ... │
        └───────────────────────────────────┘
```

---

## 📋 元技能列表

| 元技能 | 英文名 | 说明 |
|-------|--------|------|
| 任务理解 | Task Analysis | 分析用户意图和任务类型 |
| 任务规划 | Task Planning | 制定执行计划和策略 |
| 任务路由 | Task Routing | 选择最优 Agent 和模型 |
| 任务分解 | Task Decomposition | 拆分复杂任务为子任务 |
| 结果聚合 | Result Aggregation | 汇总多个结果并整合 |
| 错误恢复 | Error Recovery | 处理失败和重试策略 |
| 上下文管理 | Context Management | 管理会话状态和历史 |
| 质量保证 | Quality Assurance | 验证输出质量 |
| 学习优化 | Learning Optimizing | 持续优化路由策略 |

---

## 🔧 详细设计

### 1. 任务理解 (Task Analysis)

**输入**: 用户消息
**输出**: 任务类型、复杂度、紧急程度

```typescript
interface TaskAnalysis {
  // 任务类型
  type: 'code' | 'design' | 'analysis' | 'query' | 'workflow' | 'mixed'
  
  // 子类型
  subtype: string  // 如 'frontend', 'backend', 'security'
  
  // 复杂度
  complexity: 'simple' | 'medium' | 'complex'
  
  // 紧急程度
  urgency: 'low' | 'normal' | 'high'
  
  // 可并行性
  parallelizable: boolean
  
  // 依赖关系
  dependencies?: string[]
  
  // 估算时间
  estimatedTime: number  // 分钟
}
```

---

### 2. 任务规划 (Task Planning)

**输入**: 任务分析结果
**输出**: 执行计划

```typescript
interface ExecutionPlan {
  // 任务 ID
  taskId: string
  
  // 执行步骤
  steps: ExecutionStep[]
  
  // 执行模式
  mode: 'sequential' | 'parallel' | 'hybrid'
  
  // 预期输出
  expectedOutput: string
  
  // 成功标准
  successCriteria: string[]
}

interface ExecutionStep {
  stepId: string
  agent: AgentId
  skill: string
  input: any
  dependsOn?: string[]  // 依赖的前置步骤
}
```

---

### 3. 任务路由 (Task Routing)

**输入**: 单个任务
**输出**: Agent + 模型 + 技能

```typescript
interface RoutingDecision {
  // 选择的 Agent
  agent: AgentId
  
  // 选择的模型
  model: ModelId
  
  // 调用的技能
  skill: string
  
  // 选择理由
  reason: string
  
  // 备选方案
  fallback?: {
    agent: AgentId
    model: ModelId
  }
}
```

**路由决策矩阵**:

```typescript
const ROUTING_MATRIX = {
  // 任务类型 → [简单, 中等, 复杂] → Agent
  code: {
    models: ['qwen3.5-plus', 'qwen3-coder-next', 'qwen3-coder-plus'],
    agent: 'backend-dev'
  },
  design: {
    models: ['glm-5', 'glm-5', 'qwen3-max'],
    agent: 'ui-ux-designer'
  },
  architecture: {
    models: ['qwen3-max', 'qwen3-max', 'qwen3-max'],
    agent: 'architect'
  },
  // ...
}
```

---

### 4. 任务分解 (Task Decomposition)

**输入**: 复杂任务
**输出**: 子任务列表

```typescript
// 分解规则
const DECOMPOSITION_RULES = {
  // 多模块任务 → 按模块分解
  'multi-module': (task) => {
    return task.modules.map(m => ({
      type: m.type,
      agent: getAgentForModule(m),
      input: m.spec
    }))
  },
  
  // 全栈任务 → 前后端分解
  'fullstack': (task) => [
    { type: 'frontend', agent: 'frontend-dev', input: task.frontend },
    { type: 'backend', agent: 'backend-dev', input: task.backend }
  ],
  
  // 完整开发流程 → 多阶段分解
  'dev-workflow': (task) => [
    { type: 'design', agent: 'architect' },
    { type: 'frontend', agent: 'frontend-dev' },
    { type: 'backend', agent: 'backend-dev' },
    { type: 'test', agent: 'test-engineer' },
    { type: 'review', agent: 'code-reviewer' }
  ]
}
```

---

### 5. 结果聚合 (Result Aggregation)

**输入**: 多个子 Agent 结果
**输出**: 整合后的最终结果

```typescript
interface AggregatedResult {
  // 任务 ID
  taskId: string
  
  // 整体状态
  status: 'success' | 'partial' | 'failed'
  
  // 整合结果
  result: any
  
  // 各子任务结果
  subResults: SubResult[]
  
  // 摘要
  summary: string
  
  // 建议
  recommendations?: string[]
}

// 聚合策略
const AGGREGATION_STRATEGIES = {
  // 代码任务 → 合并代码
  code: (results) => mergeCode(results),
  
  // 分析任务 → 汇总报告
  analysis: (results) => generateReport(results),
  
  // 多模块 → 按模块组织
  modules: (results) => organizeByModule(results)
}
```

---

### 6. 错误恢复 (Error Recovery)

**策略**:

```typescript
const RECOVERY_STRATEGIES = {
  // 单点失败 → 重试或备用 Agent
  singleFailure: {
    retry: 2,
    fallbackAgent: true,
    escalate: true
  },
  
  // 部分失败 → 继续成功部分，重试失败部分
  partialFailure: {
    continueSuccess: true,
    retryFailed: true
  },
  
  // 完全失败 → 降级处理
  totalFailure: {
    degrade: true,
    notify: true
  }
}
```

---

### 7. 上下文管理 (Context Management)

**管理内容**:

```typescript
interface SessionContext {
  // 会话 ID
  sessionId: string
  
  // 任务历史
  taskHistory: Task[]
  
  // 当前状态
  currentState: 'idle' | 'processing' | 'waiting'
  
  // 活跃子 Agent
  activeAgents: AgentId[]
  
  // 中间结果
  intermediateResults: Map<string, any>
  
  // 用户偏好
  userPreferences: {
    preferredModel?: ModelId
    preferredAgent?: AgentId
    responseStyle: 'concise' | 'detailed'
  }
}
```

---

### 8. 质量保证 (Quality Assurance)

**检查项**:

```typescript
const QUALITY_CHECKS = {
  // 代码任务
  code: [
    'syntax_valid',
    'type_safe',
    'follows_conventions',
    'has_tests'
  ],
  
  // 设计任务
  design: [
    'requirements_met',
    'best_practices',
    'accessibility'
  ],
  
  // 文档任务
  document: [
    'complete',
    'clear',
    'accurate'
  ]
}
```

---

### 9. 学习优化 (Learning Optimizing)

**优化维度**:

```typescript
interface LearningMetrics {
  // 路由准确率
  routingAccuracy: number
  
  // Agent 响应时间
  agentResponseTimes: Map<AgentId, number>
  
  // 任务成功率
  taskSuccessRate: number
  
  // 用户满意度
  userSatisfaction: number
}

// 自动优化
const OPTIMIZATION_RULES = {
  // 响应慢的 Agent → 考虑换模型
  slowResponse: (agent, time) => {
    if (time > THRESHOLD) suggestModelChange(agent)
  },
  
  // 成功率低的 Agent → 分析原因
  lowSuccess: (agent, rate) => {
    if (rate < 0.8) analyzeFailure(agent)
  }
}
```

---

## 🎯 元技能执行流程

```
用户输入
    │
    ▼
┌─────────────────────┐
│ 1. 任务理解         │
│    分析意图/类型     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. 任务规划         │
│    制定执行计划      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. 任务分解         │
│    拆分子任务        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. 任务路由         │
│    分配 Agent/模型   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 5. 执行任务         │
│    调用子 Agent      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 6. 结果聚合         │
│    汇总整合结果      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 7. 质量保证         │
│    验证输出质量      │
└──────────┬──────────┘
           │
           ▼
        输出结果
```

---

## 📊 元技能 vs 专业技能

| 维度 | 元技能 | 专业技能 |
|-----|--------|---------|
| **拥有者** | Main Agent | 专业 Agent |
| **作用** | 协调、调度、管理 | 执行具体任务 |
| **示例** | 任务路由、结果聚合 | React 开发、API 设计 |
| **层级** | 元认知层 | 执行层 |
| **复用性** | 跨所有任务 | 特定领域 |

---

## ✅ 下一步

要我为这些元技能创建具体的技能文件吗？