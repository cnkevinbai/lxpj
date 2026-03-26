/**
 * 智能路由配置
 * 基于阿里云百炼模型的自动分配策略
 */

export const routingConfig = {
  // ==================== 模型池定义 ====================
  models: {
    // 代码专用
    'qwen3-coder-next': {
      tier: 'premium',
      strengths: ['代码生成', '代码重构', 'Bug修复', '指令遵循'],
      contextWindow: 262144,
      maxOutput: 65536,
      bestFor: ['前端开发', '后端开发', '代码重构'],
      avoidFor: ['长文档', '日常对话']
    },
    'qwen3-coder-plus': {
      tier: 'premium',
      strengths: ['代码生成', '超长上下文', '大型代码库'],
      contextWindow: 1000000,
      maxOutput: 65536,
      bestFor: ['大型项目重构', '多文件分析'],
      avoidFor: ['简单任务']
    },
    
    // 推理专用
    'qwen3-max': {
      tier: 'premium',
      strengths: ['复杂推理', '架构设计', '逻辑分析', '决策支持'],
      contextWindow: 262144,
      maxOutput: 65536,
      bestFor: ['架构设计', '安全审计', '代码审查', '技术决策'],
      avoidFor: ['简单任务', '快速响应']
    },
    
    // 性价比
    'qwen3.5-plus': {
      tier: 'standard',
      strengths: ['快速响应', '高性价比', '日常任务', '批量处理'],
      contextWindow: 1000000,
      maxOutput: 65536,
      bestFor: ['日常问答', '部署配置', '测试用例', '快速检查'],
      avoidFor: ['复杂推理', '代码重构']
    },
    
    // 中文优化
    'glm-5': {
      tier: 'standard',
      strengths: ['中文理解', '需求分析', '文档生成', '内容创作'],
      contextWindow: 202752,
      maxOutput: 16384,
      bestFor: ['需求文档', '产品规划', '中文写作'],
      avoidFor: ['代码任务']
    },
    'glm-4.7': {
      tier: 'standard',
      strengths: ['平衡稳定', '通用场景'],
      contextWindow: 202752,
      maxOutput: 16384,
      bestFor: ['通用任务', '备用模型'],
      avoidFor: ['极端场景']
    },
    
    // 长文本/多模态
    'kimi-k2.5': {
      tier: 'standard',
      strengths: ['超长文本', '多模态', '文档分析'],
      contextWindow: 262144,
      maxOutput: 32768,
      bestFor: ['长文档分析', '图片理解', '文档总结'],
      avoidFor: ['简单任务', '代码生成']
    },
    
    // 均衡
    'MiniMax-M2.5': {
      tier: 'standard',
      strengths: ['均衡稳定', '通用'],
      contextWindow: 196608,
      maxOutput: 32768,
      bestFor: ['备用', '负载均衡'],
      avoidFor: ['专精场景']
    }
  },

  // ==================== Agent 定义 ====================
  agents: {
    'frontend-dev': {
      name: '前端开发 Chloe',
      model: 'qwen3-coder-next',
      skills: ['React', 'TypeScript', 'CSS', '前端架构'],
      triggers: ['前端', 'React', 'Vue', '页面', '组件', 'UI', 'CSS', '样式']
    },
    'backend-dev': {
      name: '后端开发 Ryan',
      model: 'qwen3-coder-next',
      skills: ['NestJS', 'TypeScript', '数据库', 'API设计'],
      triggers: ['后端', 'API', '接口', '数据库', 'NestJS', '服务端']
    },
    'architect': {
      name: '架构师 Morgan',
      model: 'qwen3-max',
      skills: ['系统设计', '技术选型', '架构模式'],
      triggers: ['架构', '设计', '方案', '技术选型', '系统设计', '微服务']
    },
    'product-manager': {
      name: '产品经理 Alex',
      model: 'glm-5',
      skills: ['需求分析', '产品规划', '用户研究'],
      triggers: ['需求', '产品', '用户故事', 'PRD', '功能设计']
    },
    'database-engineer': {
      name: '数据库工程师 Diana',
      model: 'qwen3-max',
      skills: ['数据建模', 'SQL优化', '数据库设计'],
      triggers: ['数据库', 'SQL', '表设计', '索引', '查询优化']
    },
    'test-engineer': {
      name: '测试工程师 Taylor',
      model: 'qwen3.5-plus',
      skills: ['测试用例', '自动化测试', 'QA'],
      triggers: ['测试', 'QA', '用例', '单元测试', 'E2E']
    },
    'devops-engineer': {
      name: 'DevOps工程师 Sam',
      model: 'qwen3.5-plus',
      skills: ['Docker', 'CI/CD', '部署', '运维'],
      triggers: ['部署', 'Docker', 'CI/CD', 'Kubernetes', '配置']
    },
    'security-engineer': {
      name: '安全工程师 Sophia',
      model: 'qwen3-max',
      skills: ['安全审计', '渗透测试', '权限管理'],
      triggers: ['安全', '漏洞', '权限', '审计', '渗透']
    },
    'code-reviewer': {
      name: '代码审查员 Blake',
      model: 'qwen3-max',
      skills: ['代码审查', '最佳实践', '质量把控'],
      triggers: ['审查', 'review', '检查', 'code review', '优化']
    },
    'coordinator': {
      name: '协调员 Casey',
      model: 'kimi-k2.5',
      skills: ['任务协调', '文档处理', '多模态'],
      triggers: ['协调', '文档', '报告', '总结', '图片']
    }
  },

  // ==================== 路由规则 ====================
  routingRules: [
    // 最高优先级：明确代码任务
    {
      priority: 100,
      condition: { keywords: ['代码', 'code', '函数', 'function', '组件', 'component'] },
      model: 'qwen3-coder-next',
      agent: 'auto-detect-code'
    },
    // 架构设计
    {
      priority: 90,
      condition: { keywords: ['架构', '系统设计', '技术选型'] },
      model: 'qwen3-max',
      agent: 'architect'
    },
    // 安全审计
    {
      priority: 90,
      condition: { keywords: ['安全', '漏洞', '渗透', '权限'] },
      model: 'qwen3-max',
      agent: 'security-engineer'
    },
    // 产品需求
    {
      priority: 80,
      condition: { keywords: ['需求', '产品', '用户故事', 'PRD'] },
      model: 'glm-5',
      agent: 'product-manager'
    },
    // 长文本
    {
      priority: 70,
      condition: { contextLength: { min: 50000 } },
      model: 'kimi-k2.5',
      agent: 'coordinator'
    },
    // 部署运维
    {
      priority: 60,
      condition: { keywords: ['部署', 'Docker', 'CI/CD', 'Kubernetes'] },
      model: 'qwen3.5-plus',
      agent: 'devops-engineer'
    },
    // 测试
    {
      priority: 60,
      condition: { keywords: ['测试', 'QA', '用例'] },
      model: 'qwen3.5-plus',
      agent: 'test-engineer'
    },
    // 代码审查
    {
      priority: 60,
      condition: { keywords: ['审查', 'review', '检查'] },
      model: 'qwen3-max',
      agent: 'code-reviewer'
    },
    // 简单任务
    {
      priority: 10,
      condition: { complexity: 'simple' },
      model: 'qwen3.5-plus',
      agent: 'main'
    }
  ],

  // ==================== 故障转移 ====================
  fallback: {
    // 模型不可用时的备选
    modelFallback: {
      'qwen3-coder-next': ['qwen3-coder-plus', 'qwen3-max'],
      'qwen3-max': ['glm-5', 'qwen3.5-plus'],
      'glm-5': ['glm-4.7', 'qwen3.5-plus'],
      'kimi-k2.5': ['qwen3.5-plus', 'glm-5']
    },
    // 超时重试
    timeout: {
      first: 30000,    // 首次30秒
      retry: 60000,    // 重试60秒
      maxRetries: 2    // 最多重试2次
    }
  },

  // ==================== 成本控制 ====================
  costControl: {
    // 默认使用性价比模型
    defaultModel: 'qwen3.5-plus',
    // 简单任务强制使用性价比模型
    forceEconomyForSimple: true,
    // 后台任务使用性价比模型
    backgroundModel: 'qwen3.5-plus'
  }
}

export type ModelId = keyof typeof routingConfig.models
export type AgentId = keyof typeof routingConfig.agents