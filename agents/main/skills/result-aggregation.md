# 结果聚合技能

## 📋 技能说明

汇总多个子 Agent 的执行结果，整合为最终输出。

---

## 🎯 聚合流程

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Agent A  │   │ Agent B  │   │ Agent C  │
│ 结果 1   │   │ 结果 2   │   │ 结果 3   │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │    结果聚合引擎      │
         │  - 验证完整性        │
         │  - 合并数据          │
         │  - 生成摘要          │
         └──────────┬──────────┘
                    │
                    ▼
              最终输出
```

---

## 📝 聚合策略

### 代码聚合

```typescript
function aggregateCode(results: SubResult[]): AggregatedResult {
  return {
    status: 'success',
    result: {
      // 合并代码
      files: mergeFiles(results.map(r => r.code)),
      // 合并依赖
      dependencies: mergeDependencies(results.map(r => r.dependencies))
    },
    summary: generateCodeSummary(results)
  }
}
```

### 报告聚合

```typescript
function aggregateReport(results: SubResult[]): AggregatedResult {
  return {
    status: 'success',
    result: {
      sections: results.map(r => ({
        title: r.agent,
        content: r.output
      }))
    },
    summary: generateOverview(results)
  }
}
```

### 分析聚合

```typescript
function aggregateAnalysis(results: SubResult[]): AggregatedResult {
  return {
    status: 'success',
    result: {
      findings: results.flatMap(r => r.findings),
      recommendations: deduplicate(results.flatMap(r => r.recommendations)),
      metrics: aggregateMetrics(results.map(r => r.metrics))
    },
    summary: generateAnalysisSummary(results)
  }
}
```

---

## 📝 聚合模板

### 开发任务聚合

```markdown
## 📋 开发完成报告

### 任务概述
- 任务：[任务名称]
- 耗时：[总耗时]
- 状态：✅ 完成

### 完成内容

#### 后端 API
[backend-dev 的输出摘要]

#### 前端组件
[frontend-dev 的输出摘要]

#### 数据库变更
[database-engineer 的输出摘要]

### 文件变更
| 文件 | 变更类型 | 说明 |
|-----|---------|------|

### 测试覆盖
- 单元测试：[test-engineer 输出]
- 覆盖率：XX%

### 后续建议
[code-reviewer 的建议]
```

---

## ✅ 聚合检查

- [ ] 所有子任务结果已收集
- [ ] 数据一致性验证
- [ ] 冲突检测和解决
- [ ] 摘要准确反映内容

---

## 📚 相关元技能

- `task-decomposition` - 任务分解
- `error-recovery` - 错误恢复