# 任务路由技能

## 📋 技能说明

将任务智能分配给合适的 Agent 处理。

---

## 🎯 适用场景

- 任务分发
- Agent 选择
- 并行调度

---

## 📝 路由决策

```typescript
function routeTask(content: string) {
  // 1. 分析任务类型
  const type = detectType(content)
  
  // 2. 评估复杂度
  const complexity = assessComplexity(content)
  
  // 3. 选择最优 Agent
  const agent = selectAgent(type, complexity)
  
  // 4. 返回路由结果
  return { agent, model: getModel(agent) }
}
```

---

## 📝 任务类型映射

| 任务类型 | Agent | 模型 |
|---------|-------|------|
| 代码开发 | frontend-dev/backend-dev | qwen3-coder |
| 架构设计 | architect | qwen3-max |
| 产品需求 | product-manager | glm-5 |
| 安全审计 | security-engineer | qwen3-max |
| 测试用例 | test-engineer | qwen3.5-plus |

---

## ✅ 检查清单

- [ ] 任务类型识别准确
- [ ] Agent 选择合理
- [ ] 复杂度评估正确

---

## 📚 相关技能

- `report-generation` - 报告生成