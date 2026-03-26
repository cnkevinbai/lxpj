/**
 * Agent 智能路由服务
 * 
 * 功能：
 * 1. 根据用户输入关键词匹配最合适的 Agent
 * 2. 支持优先级排序
 * 3. 支持多关键词匹配
 */

// Agent 路由配置
export interface AgentRouteConfig {
  id: string;
  name: string;
  avatar: string;
  keywords: string[];
  taskTypes: string[];
  priority: number;
}

// 预定义的 Agent 路由规则
export const AGENT_ROUTES: AgentRouteConfig[] = [
  {
    id: 'main',
    name: '渔晓白',
    avatar: '🤖',
    keywords: ['总体', '协调', '文档', '规划', '总结', '帮助', '问题', '什么', '怎么'],
    taskTypes: ['general', 'coordination', 'documentation'],
    priority: 10,
  },
  {
    id: 'architect',
    name: 'Morgan',
    avatar: '🏗️',
    keywords: ['架构', '设计', '微服务', '系统设计', '技术选型', '模块划分', '整体方案', '技术方案', '架构图'],
    taskTypes: ['architecture-design', 'technical-design', 'system-design'],
    priority: 9,
  },
  {
    id: 'backend-dev',
    name: 'Ryan',
    avatar: '💻',
    keywords: ['后端', 'API', '接口', '服务端', 'NestJS', '数据库', '控制器', '服务', 'Repository', 'DTO', 'Entity', '接口文档'],
    taskTypes: ['backend-development', 'api-development', 'service-implementation'],
    priority: 8,
  },
  {
    id: 'frontend-dev',
    name: 'Chloe',
    avatar: '🎨',
    keywords: ['前端', 'React', '页面', '组件', 'UI组件', '状态管理', 'Hooks', '样式', 'CSS', 'Ant Design', 'Tailwind', 'Vite'],
    taskTypes: ['frontend-development', 'component-development', 'page-development'],
    priority: 8,
  },
  {
    id: 'database-engineer',
    name: 'Diana',
    avatar: '💾',
    keywords: ['数据库', 'SQL', '表结构', '索引', 'Prisma', '迁移', '数据模型', 'ER图', '查询优化', '存储过程', 'PostgreSQL', 'MySQL'],
    taskTypes: ['database-design', 'sql-development', 'migration', 'query-optimization'],
    priority: 7,
  },
  {
    id: 'devops-engineer',
    name: 'Sam',
    avatar: '🚀',
    keywords: ['部署', 'Docker', 'K8s', 'CI/CD', '运维', '容器', 'Nginx', '监控', '日志', '自动化部署', 'Kubernetes'],
    taskTypes: ['deployment', 'infrastructure', 'ci-cd', 'monitoring'],
    priority: 6,
  },
  {
    id: 'security-engineer',
    name: 'Sophia',
    avatar: '🛡️',
    keywords: ['安全', '认证', '授权', '权限', 'JWT', 'OAuth', '加密', '漏洞', '审计', '防护', '密码'],
    taskTypes: ['security-design', 'authentication', 'authorization', 'security-audit'],
    priority: 7,
  },
  {
    id: 'test-engineer',
    name: 'Taylor',
    avatar: '✅',
    keywords: ['测试', '单元测试', '集成测试', 'E2E', '测试用例', 'Jest', 'Playwright', '覆盖率', 'QA', '测试报告'],
    taskTypes: ['testing', 'unit-testing', 'integration-testing', 'e2e-testing'],
    priority: 6,
  },
  {
    id: 'code-reviewer',
    name: 'Blake',
    avatar: '📝',
    keywords: ['代码审查', '重构', '代码质量', '最佳实践', '优化', '代码规范', 'PR审查', 'Code Review', '代码优化'],
    taskTypes: ['code-review', 'refactoring', 'optimization'],
    priority: 5,
  },
  {
    id: 'ui-ux-designer',
    name: 'Maya',
    avatar: '🖌️',
    keywords: ['UI设计', '用户体验', 'UX', '原型', 'Figma', '交互', '界面', '设计规范', '视觉', '布局', '配色'],
    taskTypes: ['ui-design', 'ux-design', 'prototype', 'design-system'],
    priority: 6,
  },
  {
    id: 'product-manager',
    name: 'Alex',
    avatar: '📋',
    keywords: ['产品', '需求', 'PRD', '规划', '用户故事', '需求分析', '功能设计', '优先级', '路线图', '迭代'],
    taskTypes: ['product-planning', 'requirements-analysis', 'prd-writing'],
    priority: 5,
  },
  {
    id: 'coordinator',
    name: 'Casey',
    avatar: '🤝',
    keywords: ['协调', '沟通', '安排', '组织', '调度', '进度', '汇总', '报告', '任务分配'],
    taskTypes: ['coordination', 'task-management', 'scheduling'],
    priority: 4,
  },
];

/**
 * 智能路由匹配
 * 根据输入内容匹配最合适的 Agent
 */
export function matchAgent(input: string): AgentRouteConfig | null {
  if (!input || input.trim().length === 0) {
    return null;
  }

  const normalizedInput = input.toLowerCase();
  
  // 计算每个 Agent 的匹配分数
  const scores: { agent: AgentRouteConfig; score: number; matchedKeywords: string[] }[] = [];
  
  for (const agent of AGENT_ROUTES) {
    let score = 0;
    const matchedKeywords: string[] = [];
    
    // 关键词匹配
    for (const keyword of agent.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        score += 1;
        matchedKeywords.push(keyword);
      }
    }
    
    // 如果有匹配，加入候选
    if (score > 0) {
      // 加入优先级权重
      score = score * 10 + agent.priority;
      scores.push({ agent, score, matchedKeywords });
    }
  }
  
  // 按分数排序
  scores.sort((a, b) => b.score - a.score);
  
  // 返回最高分
  return scores.length > 0 ? scores[0].agent : null;
}

/**
 * 获取所有匹配的 Agent（按分数排序）
 */
export function getAllMatchingAgents(input: string): { agent: AgentRouteConfig; score: number; matchedKeywords: string[] }[] {
  if (!input || input.trim().length === 0) {
    return [];
  }

  const normalizedInput = input.toLowerCase();
  const results: { agent: AgentRouteConfig; score: number; matchedKeywords: string[] }[] = [];
  
  for (const agent of AGENT_ROUTES) {
    let score = 0;
    const matchedKeywords: string[] = [];
    
    for (const keyword of agent.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        score += 1;
        matchedKeywords.push(keyword);
      }
    }
    
    if (score > 0) {
      score = score * 10 + agent.priority;
      results.push({ agent, score, matchedKeywords });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * 获取 Agent 信息
 */
export function getAgentById(agentId: string): AgentRouteConfig | undefined {
  return AGENT_ROUTES.find(a => a.id === agentId);
}

/**
 * 获取所有 Agent
 */
export function getAllAgents(): AgentRouteConfig[] {
  return AGENT_ROUTES;
}