/**
 * 项目上下文管理
 * 
 * 功能：
 * 1. 自动检测项目目录
 * 2. 管理当前项目上下文
 * 3. 项目上下文持久化到会话
 */

export interface ProjectContext {
  projectId: string;
  projectName: string;
  projectPath: string;
  description?: string;
  lastDiscussedAt?: string;
  lastTaskId?: string;
  lastTaskTitle?: string;
}

// 已知项目配置
export const KNOWN_PROJECTS: ProjectContext[] = [
  {
    projectId: 'openclaw-dashboard',
    projectName: 'OpenClaw 控制面板',
    projectPath: '/home/3844778_wy/.openclaw/workspace/projects/openclaw-dashboard',
    description: 'OpenClaw 智能控制面板，多Agent协作系统',
  },
  {
    projectId: 'daoda-platform',
    projectName: '道达智能数字化平台',
    projectPath: '/home/3844778_wy/.openclaw/workspace/projects/daoda-platform',
    description: '道达智能数字化平台 (DAOD Digital Platform)',
  },
  {
    projectId: 'ev-cart-website',
    projectName: '电动车网站项目',
    projectPath: '/home/3844778_wy/.openclaw/workspace/projects/ev-cart-website',
    description: '电动车网站项目（官网 + 门户 + 鸿蒙APP）',
  },
  {
    projectId: 'DAOD',
    projectName: '道达智能车辆管理平台',
    projectPath: '/home/3844778_wy/.openclaw/workspace/projects/DAOD',
    description: '道达智能车辆管理平台 (DAOD iov-platform)',
  },
  {
    projectId: 'workspace',
    projectName: '工作空间',
    projectPath: '/home/3844778_wy/.openclaw/workspace',
    description: 'OpenClaw 主工作空间',
  },
];

// 项目服务
export const projectService = {
  /**
   * 根据消息内容自动识别项目
   */
  detectProject(message: string): ProjectContext | null {
    const lowerMessage = message.toLowerCase();
    
    for (const project of KNOWN_PROJECTS) {
      const keywords = [
        project.projectId,
        project.projectName.toLowerCase(),
        ...project.projectPath.split('/').filter(Boolean),
      ];
      
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return project;
        }
      }
    }
    
    // 特殊关键词匹配
    if (lowerMessage.includes('控制面板') || lowerMessage.includes('openclaw')) {
      return KNOWN_PROJECTS[0];
    }
    if (lowerMessage.includes('道达') || lowerMessage.includes('数字化平台')) {
      return KNOWN_PROJECTS[1];
    }
    if (lowerMessage.includes('电动车') || lowerMessage.includes('官网')) {
      return KNOWN_PROJECTS[2];
    }
    if (lowerMessage.includes('车辆管理') || lowerMessage.includes('iov')) {
      return KNOWN_PROJECTS[3];
    }
    
    return null;
  },

  /**
   * 获取所有项目
   */
  getAllProjects(): ProjectContext[] {
    return KNOWN_PROJECTS;
  },

  /**
   * 根据ID获取项目
   */
  getProjectById(id: string): ProjectContext | undefined {
    return KNOWN_PROJECTS.find(p => p.projectId === id);
  },

  /**
   * 生成项目上下文提示
   */
  generateContextPrompt(project: ProjectContext): string {
    return `
当前项目上下文：
- 项目名称：${project.projectName}
- 项目路径：${project.projectPath}
- 项目描述：${project.description || '暂无'}
${project.lastTaskTitle ? `- 最近任务：${project.lastTaskTitle}` : ''}

请基于以上项目上下文进行回答。
`.trim();
  },
};

export default projectService;