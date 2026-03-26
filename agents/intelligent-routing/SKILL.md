# 智能路由引擎

## 🎯 功能

根据任务内容自动分配最优模型和 Agent，实现质量与成本的最佳平衡。

---

## 📊 模型能力矩阵

| 模型 | 代码 | 推理 | 中文 | 长文本 | 成本 | 最适合 |
|-----|------|------|------|--------|------|--------|
| qwen3-coder-next | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 中 | 代码开发 |
| qwen3-coder-plus | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中 | 大型代码库 |
| qwen3-max | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中高 | 架构/推理 |
| qwen3.5-plus | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 极低 | 日常/快速 |
| GLM-5 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 低 | 中文/需求 |
| kimi-k2.5 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中 | 长文档/多模态 |

---

## 🔄 路由决策流程

```
用户输入
    ↓
1️⃣ 任务类型识别
    ├── 代码开发 → 检测前端/后端
    ├── 架构设计 → 复杂度评估
    ├── 产品需求 → 文档长度评估
    ├── 安全审计 → 复杂度评估
    ├── 部署运维 → 配置复杂度
    ├── 测试任务 → 用例数量
    └── 文档处理 → 长度检测
    ↓
2️⃣ 复杂度评估
    ├── 简单 → 性价比模型
    ├── 中等 → 专业模型
    └── 复杂 → 高级模型
    ↓
3️⃣ 模型选择
    ↓
4️⃣ Agent 分配
    ↓
执行任务
```

---

## 📋 完整分配矩阵

### 💻 代码开发类

| 任务 | 简单 | 中等 | 复杂 | Agent |
|-----|------|------|------|-------|
| 前端开发 | qwen3.5-plus | qwen3-coder-next | qwen3-coder-plus | frontend-dev |
| 后端开发 | qwen3.5-plus | qwen3-coder-next | qwen3-coder-plus | backend-dev |
| 代码重构 | qwen3-coder-next | qwen3-coder-next | qwen3-coder-plus | code-reviewer |
| Bug修复 | qwen3.5-plus | qwen3-coder-next | qwen3-coder-next | backend-dev |

### 🏗️ 架构设计类

| 任务 | 简单 | 中等 | 复杂 | Agent |
|-----|------|------|------|-------|
| 系统架构 | qwen3-max | qwen3-max | qwen3-max | architect |
| API设计 | qwen3-max | qwen3-max | qwen3-max | architect |
| 数据库设计 | qwen3-max | qwen3-max | qwen3-max | database-engineer |
| 技术选型 | qwen3-max | qwen3-max | qwen3-max | architect |

### 📋 产品需求类

| 任务 | 简单 | 中等 | 复杂 | Agent |
|-----|------|------|------|-------|
| 需求分析 | GLM-5 | GLM-5 | qwen3-max | product-manager |
| 用户故事 | GLM-5 | GLM-5 | GLM-5 | product-manager |
| 文档编写 | GLM-5 | GLM-5 | kimi-k2.5 | coordinator |

### 🔒 安全运维类

| 任务 | 简单 | 中等 | 复杂 | Agent |
|-----|------|------|------|-------|
| 安全审计 | qwen3-max | qwen3-max | qwen3-max | security-engineer |
| 权限配置 | qwen3.5-plus | qwen3-max | qwen3-max | security-engineer |
| 部署配置 | qwen3.5-plus | qwen3.5-plus | qwen3-max | devops-engineer |
| CI/CD配置 | qwen3.5-plus | qwen3.5-plus | qwen3.5-plus | devops-engineer |

### 🧪 测试质量类

| 任务 | 简单 | 中等 | 复杂 | Agent |
|-----|------|------|------|-------|
| 测试用例 | qwen3.5-plus | qwen3.5-plus | qwen3.5-plus | test-engineer |
| 代码审查 | qwen3.5-plus | qwen3-max | qwen3-max | code-reviewer |
| 质量报告 | GLM-5 | GLM-5 | kimi-k2.5 | coordinator |

### 📚 文档长文本类

| 任务 | 简单 | 中等 | 复杂 | Agent |
|-----|------|------|------|-------|
| 文档分析 | qwen3.5-plus | kimi-k2.5 | kimi-k2.5 | coordinator |
| 图片理解 | kimi-k2.5 | kimi-k2.5 | kimi-k2.5 | coordinator |
| 报告生成 | GLM-5 | kimi-k2.5 | kimi-k2.5 | coordinator |

### ⚡ 快速响应类

| 任务 | 所有复杂度 | Agent |
|-----|----------|-------|
| 日常问答 | qwen3.5-plus | main |
| 快速检查 | qwen3.5-plus | main |
| 简单查询 | qwen3.5-plus | main |

---

## 🔧 关键词触发规则

```typescript
// 任务类型识别关键词
const TASK_KEYWORDS = {
  code: ['代码', 'code', '函数', 'function', '组件', 'component', 
          'API', '接口', '修复', 'bug', '重构', 'refactor'],
  frontend: ['前端', 'React', 'Vue', 'CSS', '页面', 'UI', '组件', '样式'],
  backend: ['后端', 'NestJS', '数据库', '服务端', 'API'],
  architecture: ['架构', '设计', '方案', '技术选型', '系统设计', '微服务'],
  product: ['需求', '产品', '用户故事', 'PRD', '功能设计'],
  security: ['安全', '漏洞', '权限', '审计', '渗透', '攻击'],
  devops: ['部署', 'Docker', 'CI/CD', 'Kubernetes', '配置', '环境'],
  test: ['测试', 'QA', '用例', '单元测试', 'E2E'],
  review: ['审查', 'review', '检查', '优化'],
  document: ['文档', '报告', '总结', '分析', '图片']
}

// 复杂度评估指标
const COMPLEXITY_INDICATORS = {
  simple: ['简单', '快速', '修改', '配置', '添加', '小'],
  complex: ['复杂', '大型', '重构', '架构', '全面', '系统', '完整', '详细']
}
```

---

## 💡 使用示例

```bash
# 示例1：前端开发（中等复杂度）
用户: "帮我开发一个用户登录组件"
路由: qwen3-coder-next + frontend-dev

# 示例2：架构设计（复杂）
用户: "设计一个高可用的微服务架构方案"
路由: qwen3-max + architect

# 示例3：需求文档（中等复杂度）
用户: "写一份用户管理模块的产品需求文档"
路由: GLM-5 + product-manager

# 示例4：代码审查（复杂）
用户: "全面审查这个模块的代码质量"
路由: qwen3-max + code-reviewer

# 示例5：快速检查（简单）
用户: "快速检查这个函数有没有明显问题"
路由: qwen3.5-plus + main
```

---

## ⚙️ 配置应用

此路由策略已集成到 OpenClaw 的 Agent 系统中，自动生效。