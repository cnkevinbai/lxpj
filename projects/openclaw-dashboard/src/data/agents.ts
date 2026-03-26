export const agents = [
  { 
    id: 'main', 
    name: '渔晓白', 
    role: '主代理', 
    status: 'online' as const, 
    avatar: '🤖',
    description: '主代理，负责协调所有任务和对话',
    skills: ['任务协调', '对话管理']
  },
  { 
    id: 'architect', 
    name: 'Morgan', 
    role: '架构师', 
    status: 'online' as const, 
    avatar: '🏗️',
    description: '系统架构设计专家，擅长复杂系统设计',
    skills: ['系统架构', '技术规划']
  },
  { 
    id: 'backend-dev', 
    name: 'Ryan', 
    role: '后端开发', 
    status: 'online' as const, 
    avatar: '💻',
    description: '后端开发专家，精通各种后端技术',
    skills: ['API设计', '数据库']
  },
  { 
    id: 'frontend-dev', 
    name: 'Chloe', 
    role: '前端开发', 
    status: 'online' as const, 
    avatar: '🎨',
    description: '前端开发专家，精通各种前端技术',
    skills: ['UI开发', '用户体验']
  },
  { 
    id: 'database-engineer', 
    name: 'Diana', 
    role: '数据库工程师', 
    status: 'online' as const, 
    avatar: '💾',
    description: '数据库专家，擅长数据管理和查询优化',
    skills: ['数据库优化', '数据建模']
  },
  { 
    id: 'devops-engineer', 
    name: 'Sam', 
    role: 'DevOps工程师', 
    status: 'online' as const, 
    avatar: '🚀',
    description: 'DevOps专家，擅长自动化部署和运维',
    skills: ['CI/CD', '监控告警']
  },
  { 
    id: 'security-engineer', 
    name: 'Sophia', 
    role: '安全工程师', 
    status: 'online' as const, 
    avatar: '🛡️',
    description: '安全专家，擅长系统安全和漏洞检测',
    skills: ['安全审计', '漏洞修复']
  },
  { 
    id: 'test-engineer', 
    name: 'Taylor', 
    role: '测试工程师', 
    status: 'online' as const, 
    avatar: '✅',
    description: '测试专家，擅长自动化测试和质量保证',
    skills: ['自动化测试', '质量保证']
  },
  { 
    id: 'code-reviewer', 
    name: 'Blake', 
    role: '代码审查员', 
    status: 'online' as const, 
    avatar: '📝',
    description: '代码审查专家，擅长代码质量和规范检查',
    skills: ['代码审查', '规范检查']
  },
  { 
    id: 'ui-ux-designer', 
    name: 'Maya', 
    role: 'UI/UX设计师', 
    status: 'online' as const, 
    avatar: '🖌️',
    description: 'UI/UX设计专家，擅长用户体验和界面设计',
    skills: ['界面设计', '用户体验']
  },
  { 
    id: 'product-manager', 
    name: 'Alex', 
    role: '产品经理', 
    status: 'online' as const, 
    avatar: '📋',
    description: '产品经理，擅长产品规划和需求分析',
    skills: ['产品规划', '需求分析']
  },
  { 
    id: 'coordinator', 
    name: 'Casey', 
    role: '协调员', 
    status: 'online' as const, 
    avatar: '🤝',
    description: '协调员，负责任务分配和进度跟踪',
    skills: ['任务协调', '进度跟踪']
  },
];

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  description?: string;
  skills?: string[];
}
