# 任务分解技能

## 📋 技能说明

将复杂任务拆分为可独立执行的子任务，支持并行处理和依赖管理。

---

## 🎯 分解策略

### 按模块分解

```typescript
// 示例：开发用户管理模块
const decomposition = {
  task: '开发用户管理功能',
  subtasks: [
    { id: 'T1', type: 'database', agent: 'database-engineer', desc: '设计用户表结构' },
    { id: 'T2', type: 'backend', agent: 'backend-dev', desc: '实现用户 API', depends: ['T1'] },
    { id: 'T3', type: 'frontend', agent: 'frontend-dev', desc: '开发用户界面', depends: ['T2'] },
    { id: 'T4', type: 'test', agent: 'test-engineer', desc: '编写测试用例', depends: ['T2', 'T3'] }
  ]
}
```

---

## 📝 分解模式

### 模式 1：顺序依赖

```
T1 (架构设计) → T2 (后端开发) → T3 (前端开发) → T4 (测试)
```

### 模式 2：并行独立

```
     ┌→ T1 (前端开发) ─┐
T0 → ├→ T2 (后端开发) ─┼→ T4 (整合测试)
     └→ T3 (数据库) ──┘
```

### 模式 3：混合模式

```
T1 (架构设计)
    ├── T2 (前端开发) ─┐
    ├── T3 (后端开发) ─┼→ T5 (集成测试)
    └── T4 (数据库) ───┘
```

---

## 📝 分解规则

```typescript
const DECOMPOSITION_RULES = {
  // 完整开发流程
  'full-dev-workflow': {
    pattern: 'sequential',
    steps: [
      { agent: 'architect', task: '架构设计' },
      { agent: 'database-engineer', task: '数据库设计' },
      { agent: 'backend-dev', task: '后端开发' },
      { agent: 'frontend-dev', task: '前端开发' },
      { agent: 'test-engineer', task: '测试编写' },
      { agent: 'code-reviewer', task: '代码审查' }
    ]
  },
  
  // 前后端并行
  'parallel-frontend-backend': {
    pattern: 'parallel',
    branches: [
      { agent: 'frontend-dev', task: '前端开发' },
      { agent: 'backend-dev', task: '后端开发' }
    ],
    merge: { agent: 'test-engineer', task: '集成测试' }
  },
  
  // 安全审计流程
  'security-audit': {
    pattern: 'parallel',
    branches: [
      { agent: 'security-engineer', task: '安全审计' },
      { agent: 'code-reviewer', task: '代码审查' }
    ],
    merge: { agent: 'coordinator', task: '生成报告' }
  }
}
```

---

## ✅ 分解检查

- [ ] 子任务粒度适中
- [ ] 依赖关系清晰
- [ ] 无循环依赖
- [ ] 可并行任务已识别

---

## 📚 相关元技能

- `task-analysis` - 任务理解
- `task-routing` - 任务路由