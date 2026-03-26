# 任务理解技能

## 📋 技能说明

分析用户输入，识别任务类型、复杂度和意图，为后续路由提供决策依据。

---

## 🎯 输出结构

```typescript
interface TaskAnalysis {
  // 任务类型
  type: TaskType
  
  // 子类型
  subtype: string
  
  // 复杂度
  complexity: 'simple' | 'medium' | 'complex'
  
  // 紧急程度
  urgency: 'low' | 'normal' | 'high'
  
  // 可并行性
  parallelizable: boolean
  
  // 置信度
  confidence: number  // 0-1
}
```

---

## 📝 任务类型识别

### 关键词匹配

```typescript
const TASK_PATTERNS = {
  // 代码开发
  code: {
    keywords: ['代码', '开发', '实现', '编写', '函数', '组件', 'API'],
    subtypes: ['frontend', 'backend', 'database', 'fullstack']
  },
  
  // 架构设计
  architecture: {
    keywords: ['架构', '设计', '方案', '系统设计', '技术选型'],
    subtypes: ['system', 'api', 'database', 'security']
  },
  
  // 产品需求
  product: {
    keywords: ['需求', '产品', '用户故事', 'PRD', '功能'],
    subtypes: ['analysis', 'document', 'roadmap']
  },
  
  // UI/UX 设计
  design: {
    keywords: ['设计', 'UI', 'UX', '界面', '原型', '交互'],
    subtypes: ['visual', 'interaction', 'prototype']
  },
  
  // 测试
  test: {
    keywords: ['测试', 'QA', '用例', '单元测试', 'E2E'],
    subtypes: ['unit', 'integration', 'e2e']
  },
  
  // 安全
  security: {
    keywords: ['安全', '漏洞', '审计', '渗透', '权限'],
    subtypes: ['audit', 'pentest', 'review']
  },
  
  // 部署运维
  devops: {
    keywords: ['部署', 'Docker', 'Kubernetes', 'CI/CD', '环境'],
    subtypes: ['deploy', 'config', 'monitor']
  },
  
  // 文档处理
  document: {
    keywords: ['文档', '报告', '总结', '分析'],
    subtypes: ['read', 'write', 'analyze']
  },
  
  // 代码审查
  review: {
    keywords: ['审查', 'review', '检查', '优化'],
    subtypes: ['quality', 'security', 'performance']
  }
}
```

---

## 📝 复杂度评估

### 评估维度

```typescript
function assessComplexity(input: string): Complexity {
  let score = 0
  
  // 1. 文本长度
  if (input.length > 1000) score += 2
  else if (input.length > 300) score += 1
  
  // 2. 关键词
  if (containsAny(input, ['复杂', '大型', '完整', '系统', '全面'])) score += 2
  if (containsAny(input, ['简单', '快速', '小', '修改'])) score -= 1
  
  // 3. 多任务
  if (input.includes('和') || input.includes('以及')) score += 1
  
  // 4. 技术深度
  if (containsAny(input, ['架构', '优化', '重构', '设计'])) score += 1
  
  // 映射到等级
  if (score >= 3) return 'complex'
  if (score >= 1) return 'medium'
  return 'simple'
}
```

---

## 📝 意图识别

### 意图类型

| 意图 | 说明 | 示例 |
|-----|------|------|
| `create` | 创建新内容 | "帮我创建一个组件" |
| `modify` | 修改现有内容 | "修改这个函数" |
| `analyze` | 分析评估 | "分析这段代码" |
| `query` | 查询信息 | "什么是 React Hooks" |
| `debug` | 调试问题 | "为什么报错" |
| `optimize` | 优化改进 | "优化性能" |
| `review` | 审查检查 | "审查代码质量" |

---

## ✅ 检查清单

- [ ] 任务类型识别准确
- [ ] 复杂度评估合理
- [ ] 意图判断正确
- [ ] 子类型识别

---

## 📚 相关元技能

- `task-routing` - 任务路由
- `task-planning` - 任务规划