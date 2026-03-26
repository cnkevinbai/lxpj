/**
 * 智能路由引擎 - 核心实现
 * 方案三：任务类型 + 复杂度 + 成本 综合决策
 */

// ==================== 类型定义 ====================

type TaskType = 'code' | 'frontend' | 'backend' | 'architecture' | 'product' | 
                'security' | 'devops' | 'test' | 'review' | 'document' | 'design' | 'general'

type Complexity = 'simple' | 'medium' | 'complex'

type ModelId = 'qwen3-coder-next' | 'qwen3-coder-plus' | 'qwen3-max' | 
               'qwen3.5-plus' | 'glm-5' | 'glm-4.7' | 'kimi-k2.5' | 'MiniMax-M2.5'

type AgentId = 'main' | 'frontend-dev' | 'backend-dev' | 'architect' | 
               'product-manager' | 'security-engineer' | 'devops-engineer' |
               'test-engineer' | 'code-reviewer' | 'database-engineer' | 
               'ui-ux-designer' | 'coordinator'

interface RoutingResult {
  model: ModelId
  agent: AgentId
  taskType: TaskType
  complexity: Complexity
  reason: string
}

// ==================== 关键词定义 ====================

const TASK_KEYWORDS: Record<TaskType, string[]> = {
  code: ['代码', 'code', '函数', 'function', '修复', 'bug', '重构', 'refactor'],
  frontend: ['前端', 'React', 'Vue', 'CSS', '页面', 'UI', '组件', '样式', 'tsx', 'jsx'],
  backend: ['后端', 'NestJS', '数据库', '服务端', 'API', '接口', 'controller', 'service'],
  architecture: ['架构', '设计', '方案', '技术选型', '系统设计', '微服务', '架构图'],
  product: ['需求', '产品', '用户故事', 'PRD', '功能设计', '用户画像', '需求文档'],
  security: ['安全', '漏洞', '权限', '审计', '渗透', '攻击', 'xss', 'sql注入'],
  devops: ['部署', 'Docker', 'CI/CD', 'Kubernetes', '配置', '环境', 'nginx', 'yaml'],
  test: ['测试', 'QA', '用例', '单元测试', 'E2E', 'jest', 'cypress'],
  review: ['审查', 'review', '检查', '优化', '改进', '重构建议'],
  document: ['文档', '报告', '总结', '分析', '图片', 'pdf', '阅读'],
  design: ['设计', 'UI', 'UX', '界面', '交互', '原型', '视觉', '配色', '布局', '组件设计', '用户体验'],
  general: []
}

const COMPLEXITY_INDICATORS = {
  simple: ['简单', '快速', '修改', '配置', '添加', '小', '简单修改', '快速检查'],
  complex: ['复杂', '大型', '重构', '架构', '全面', '系统', '完整', '详细', '深度', '大型项目']
}

// ==================== 路由矩阵 ====================

// 格式: [简单, 中等, 复杂]
const ROUTING_MATRIX: Record<TaskType, { models: [ModelId, ModelId, ModelId], agent: AgentId }> = {
  code: {
    models: ['qwen3.5-plus', 'qwen3-coder-next', 'qwen3-coder-next'],
    agent: 'backend-dev'
  },
  frontend: {
    models: ['qwen3.5-plus', 'qwen3-coder-next', 'qwen3-coder-plus'],
    agent: 'frontend-dev'
  },
  backend: {
    models: ['qwen3.5-plus', 'qwen3-coder-next', 'qwen3-coder-plus'],
    agent: 'backend-dev'
  },
  architecture: {
    models: ['qwen3-max', 'qwen3-max', 'qwen3-max'],
    agent: 'architect'
  },
  product: {
    models: ['glm-5', 'glm-5', 'qwen3-max'],
    agent: 'product-manager'
  },
  security: {
    models: ['qwen3-max', 'qwen3-max', 'qwen3-max'],
    agent: 'security-engineer'
  },
  devops: {
    models: ['qwen3.5-plus', 'qwen3.5-plus', 'qwen3-max'],
    agent: 'devops-engineer'
  },
  test: {
    models: ['qwen3.5-plus', 'qwen3.5-plus', 'qwen3.5-plus'],
    agent: 'test-engineer'
  },
  review: {
    models: ['qwen3.5-plus', 'qwen3-max', 'qwen3-max'],
    agent: 'code-reviewer'
  },
  document: {
    models: ['qwen3.5-plus', 'kimi-k2.5', 'kimi-k2.5'],
    agent: 'coordinator'
  },
  design: {
    models: ['glm-5', 'glm-5', 'qwen3-max'],
    agent: 'ui-ux-designer'
  },
  general: {
    models: ['qwen3.5-plus', 'qwen3.5-plus', 'glm-5'],
    agent: 'main'
  }
}

// ==================== 核心路由函数 ====================

/**
 * 智能路由主函数
 * @param content 用户输入内容
 * @param context 上下文（可选）
 * @returns 路由结果
 */
export function intelligentRoute(content: string, context?: string): RoutingResult {
  // 1. 检测任务类型
  const taskType = detectTaskType(content)
  
  // 2. 评估复杂度
  const complexity = assessComplexity(content, context)
  
  // 3. 获取路由配置
  const config = ROUTING_MATRIX[taskType]
  
  // 4. 选择模型
  const model = config.models[complexity === 'simple' ? 0 : complexity === 'medium' ? 1 : 2]
  
  // 5. 确定 Agent
  let agent = config.agent
  
  // 特殊处理：代码任务区分前端后端
  if (taskType === 'code') {
    agent = detectCodeType(content)
  }
  
  // 6. 生成原因说明
  const reason = generateReason(taskType, complexity, model, agent)
  
  return {
    model,
    agent,
    taskType,
    complexity,
    reason
  }
}

/**
 * 检测任务类型
 */
function detectTaskType(content: string): TaskType {
  const lowerContent = content.toLowerCase()
  
  // 按优先级检测（顺序很重要）
  // 1. 架构设计（优先级最高）
  if (containsAny(lowerContent, TASK_KEYWORDS.architecture)) {
    return 'architecture'
  }
  
  // 2. 安全相关
  if (containsAny(lowerContent, TASK_KEYWORDS.security)) {
    return 'security'
  }
  
  // 3. UI/UX 设计
  if (containsAny(lowerContent, TASK_KEYWORDS.design)) {
    return 'design'
  }
  
  // 4. 产品需求
  if (containsAny(lowerContent, TASK_KEYWORDS.product)) {
    return 'product'
  }
  
  // 5. 前端开发
  if (containsAny(lowerContent, TASK_KEYWORDS.frontend)) {
    return 'frontend'
  }
  
  // 6. 后端开发
  if (containsAny(lowerContent, TASK_KEYWORDS.backend)) {
    return 'backend'
  }
  
  // 7. 代码通用
  if (containsAny(lowerContent, TASK_KEYWORDS.code)) {
    return 'code'
  }
  
  // 8. 测试
  if (containsAny(lowerContent, TASK_KEYWORDS.test)) {
    return 'test'
  }
  
  // 9. 代码审查
  if (containsAny(lowerContent, TASK_KEYWORDS.review)) {
    return 'review'
  }
  
  // 10. 部署运维
  if (containsAny(lowerContent, TASK_KEYWORDS.devops)) {
    return 'devops'
  }
  
  // 11. 文档处理
  if (containsAny(lowerContent, TASK_KEYWORDS.document)) {
    return 'document'
  }
  
  // 默认：通用任务
  return 'general'
}

/**
 * 评估复杂度
 */
function assessComplexity(content: string, context?: string): Complexity {
  const fullText = (content + ' ' + (context || '')).toLowerCase()
  
  // 检测复杂指标
  const complexCount = countKeywords(fullText, COMPLEXITY_INDICATORS.complex)
  const simpleCount = countKeywords(fullText, COMPLEXITY_INDICATORS.simple)
  
  // 文本长度也是复杂度指标
  const textLength = fullText.length
  const isLongText = textLength > 500
  
  // 多任务组合
  const hasMultipleTasks = (content.match(/和|以及|同时|另外|还有/g) || []).length > 1
  
  // 判断逻辑
  if (complexCount > simpleCount || isLongText || hasMultipleTasks) {
    return 'complex'
  }
  
  if (simpleCount > 0 || textLength < 100) {
    return 'simple'
  }
  
  return 'medium'
}

/**
 * 检测代码类型（前端/后端）
 */
function detectCodeType(content: string): AgentId {
  const lowerContent = content.toLowerCase()
  
  // 前端关键词
  const frontendKeywords = ['前端', 'react', 'vue', 'css', '页面', 'ui', '组件', 
                            '样式', 'tsx', 'jsx', 'dom', '浏览器']
  
  // 后端关键词
  const backendKeywords = ['后端', 'api', '接口', '数据库', 'nest', 'server',
                           'controller', 'service', 'sql', 'redis']
  
  const frontendScore = countKeywords(lowerContent, frontendKeywords)
  const backendScore = countKeywords(lowerContent, backendKeywords)
  
  if (frontendScore > backendScore) {
    return 'frontend-dev'
  }
  
  return 'backend-dev'
}

/**
 * 生成路由原因
 */
function generateReason(
  taskType: TaskType, 
  complexity: Complexity, 
  model: ModelId, 
  agent: AgentId
): string {
  const typeNames: Record<TaskType, string> = {
    code: '代码开发',
    frontend: '前端开发',
    backend: '后端开发',
    architecture: '架构设计',
    product: '产品需求',
    security: '安全审计',
    devops: '部署运维',
    test: '测试任务',
    review: '代码审查',
    document: '文档处理',
    design: 'UI/UX设计',
    general: '通用任务'
  }
  
  const complexityNames: Record<Complexity, string> = {
    simple: '简单',
    medium: '中等',
    complex: '复杂'
  }
  
  return `${complexityNames[complexity]}复杂度的${typeNames[taskType]}任务，使用 ${model} + ${agent}`
}

// ==================== 辅助函数 ====================

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some(k => text.includes(k.toLowerCase()))
}

function countKeywords(text: string, keywords: string[]): number {
  return keywords.reduce((count, k) => {
    const matches = text.match(new RegExp(k.toLowerCase(), 'g'))
    return count + (matches ? matches.length : 0)
  }, 0)
}

// ==================== 导出 ====================

export default intelligentRoute

// 使用示例
/*
const result = intelligentRoute('帮我开发一个用户登录组件')
console.log(result)
// {
//   model: 'qwen3-coder-next',
//   agent: 'frontend-dev',
//   taskType: 'frontend',
//   complexity: 'medium',
//   reason: '中等复杂度的前端开发任务，使用 qwen3-coder-next + frontend-dev'
// }
*/