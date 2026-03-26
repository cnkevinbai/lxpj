/**
 * 智能路由服务 - 主Agent协调专业Agent
 * 
 * 核心流程：
 * 1. 用户与主Agent（渔晓白）对话
 * 2. 主Agent分析任务，决定是否需要专业Agent
 * 3. 支持并行分配多个专业Agent
 * 4. 专业Agent创建任务窗口执行
 * 5. 结果汇总回主对话
 */

import { matchAgent, getAllMatchingAgents, AgentRouteConfig } from './agent-router';

// 任务分析结果
export interface TaskAnalysis {
  needsSpecialist: boolean;          // 是否需要专业Agent
  taskType: 'single' | 'parallel' | 'sequential';  // 任务类型
  tasks: SpecialistTask[];           // 子任务列表
  summary: string;                   // 主Agent的总结
  estimatedTime?: number;            // 预估时间（秒）
}

// 专业任务
export interface SpecialistTask {
  id: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  taskDescription: string;           // 任务描述
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];            // 依赖的任务ID
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;                   // 执行结果
  windowId?: string;                 // 任务窗口ID
}

// 并行任务组
export interface ParallelTaskGroup {
  groupId: string;
  tasks: SpecialistTask[];
  status: 'pending' | 'running' | 'completed' | 'partial';
  createdAt: Date;
  completedAt?: Date;
}

// 任务监听器
type TaskGroupListener = (group: ParallelTaskGroup) => void;

// Agent配置
const AGENT_CONFIG: Record<string, { name: string; avatar: string; color: string }> = {
  main: { name: '渔晓白', avatar: '🦞', color: '#06B6D4' },
  architect: { name: 'Morgan', avatar: '🏛️', color: '#8B5CF6' },
  'backend-dev': { name: 'Ryan', avatar: '💻', color: '#10B981' },
  'frontend-dev': { name: 'Chloe', avatar: '🎨', color: '#F59E0B' },
  'database-engineer': { name: 'Diana', avatar: '🗄️', color: '#EC4899' },
  'devops-engineer': { name: 'Sam', avatar: '🚀', color: '#EF4444' },
  'security-engineer': { name: 'Sophia', avatar: '🔐', color: '#6366F1' },
  'test-engineer': { name: 'Taylor', avatar: '🧪', color: '#14B8A6' },
  'code-reviewer': { name: 'Blake', avatar: '👁️', color: '#F97316' },
  'ui-ux-designer': { name: 'Maya', avatar: '✨', color: '#A855F7' },
  'product-manager': { name: 'Alex', avatar: '📊', color: '#0EA5E9' },
  coordinator: { name: 'Casey', avatar: '🎯', color: '#84CC16' },
};

class SmartRouterService {
  private taskGroups: Map<string, ParallelTaskGroup> = new Map();
  private listeners: Set<TaskGroupListener> = new Set();
  private taskCounter = 0;

  /**
   * 分析用户输入，决定任务分配
   * 主Agent调用此方法分析任务
   */
  analyzeTask(userInput: string): TaskAnalysis {
    // 获取所有匹配的Agent
    const matches = getAllMatchingAgents(userInput);
    
    // 判断是否需要专业Agent
    const needsSpecialist = matches.length > 0 && matches[0].agent.id !== 'main';
    
    if (!needsSpecialist) {
      // 普通对话，主Agent直接处理
      return {
        needsSpecialist: false,
        taskType: 'single',
        tasks: [],
        summary: '这是一个普通对话，我来直接回答。',
      };
    }

    // 分析任务复杂度
    const taskType = this.determineTaskType(userInput, matches);
    
    // 生成子任务
    const tasks = this.generateSpecialistTasks(userInput, matches, taskType);
    
    // 生成主Agent总结
    const summary = this.generateSummary(tasks);

    return {
      needsSpecialist: true,
      taskType,
      tasks,
      summary,
      estimatedTime: tasks.length * 30, // 预估每个任务30秒
    };
  }

  /**
   * 创建并行任务组
   */
  createParallelTaskGroup(tasks: SpecialistTask[]): ParallelTaskGroup {
    const groupId = `group-${Date.now()}-${++this.taskCounter}`;
    
    const group: ParallelTaskGroup = {
      groupId,
      tasks,
      status: 'pending',
      createdAt: new Date(),
    };

    this.taskGroups.set(groupId, group);
    this.notifyListeners(group);

    return group;
  }

  /**
   * 更新任务状态
   */
  updateTaskStatus(
    groupId: string,
    taskId: string,
    status: SpecialistTask['status'],
    result?: string,
    windowId?: string
  ): void {
    const group = this.taskGroups.get(groupId);
    if (!group) return;

    const task = group.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = status;
    if (result) task.result = result;
    if (windowId) task.windowId = windowId;

    // 更新组状态
    this.updateGroupStatus(group);
    this.notifyListeners(group);
  }

  /**
   * 完成任务
   */
  completeTask(groupId: string, taskId: string, result: string): void {
    this.updateTaskStatus(groupId, taskId, 'completed', result);
  }

  /**
   * 获取任务组
   */
  getTaskGroup(groupId: string): ParallelTaskGroup | undefined {
    return this.taskGroups.get(groupId);
  }

  /**
   * 获取所有活跃任务组
   */
  getActiveTaskGroups(): ParallelTaskGroup[] {
    return Array.from(this.taskGroups.values())
      .filter(g => g.status !== 'completed');
  }

  /**
   * 监听任务组变化
   */
  onTaskGroupChange(listener: TaskGroupListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 汇总任务结果
   */
  aggregateResults(groupId: string): string {
    const group = this.taskGroups.get(groupId);
    if (!group) return '';

    const completedTasks = group.tasks.filter(t => t.status === 'completed');
    const failedTasks = group.tasks.filter(t => t.status === 'failed');

    let summary = '## 📋 任务执行汇总\n\n';
    
    if (completedTasks.length > 0) {
      summary += '### ✅ 已完成任务\n\n';
      for (const task of completedTasks) {
        summary += `**${task.agentAvatar} ${task.agentName}**\n`;
        summary += `- 任务: ${task.taskDescription.slice(0, 50)}...\n`;
        if (task.result) {
          summary += `- 结果: ${task.result.slice(0, 100)}...\n`;
        }
        summary += '\n';
      }
    }

    if (failedTasks.length > 0) {
      summary += '### ❌ 失败任务\n\n';
      for (const task of failedTasks) {
        summary += `- ${task.agentAvatar} ${task.agentName}: ${task.taskDescription.slice(0, 30)}...\n`;
      }
    }

    summary += `\n**总计**: ${completedTasks.length}/${group.tasks.length} 任务完成`;

    return summary;
  }

  // ========== 私有方法 ==========

  /**
   * 判断任务类型
   */
  private determineTaskType(
    userInput: string,
    matches: { agent: AgentRouteConfig; score: number; matchedKeywords: string[] }[]
  ): 'single' | 'parallel' | 'sequential' {
    const parallelKeywords = ['同时', '并行', '一起', '都', '并且', '以及'];
    const sequentialKeywords = ['然后', '接着', '之后', '再', '依次', '顺序'];

    const lowerInput = userInput.toLowerCase();

    // 检查是否包含并行关键词
    if (parallelKeywords.some(kw => lowerInput.includes(kw))) {
      return 'parallel';
    }

    // 检查是否包含顺序关键词
    if (sequentialKeywords.some(kw => lowerInput.includes(kw))) {
      return 'sequential';
    }

    // 根据匹配数量判断
    if (matches.length > 1) {
      return 'parallel'; // 多个匹配默认并行
    }

    return 'single';
  }

  /**
   * 生成专业任务列表
   */
  private generateSpecialistTasks(
    userInput: string,
    matches: { agent: AgentRouteConfig; score: number; matchedKeywords: string[] }[],
    taskType: 'single' | 'parallel' | 'sequential'
  ): SpecialistTask[] {
    const tasks: SpecialistTask[] = [];

    // 根据任务类型选择要分配的Agent
    const selectedMatches = taskType === 'single' 
      ? [matches[0]] 
      : matches.slice(0, 3); // 最多并行3个

    selectedMatches.forEach((match, index) => {
      const config = AGENT_CONFIG[match.agent.id] || AGENT_CONFIG.main;
      
      const task: SpecialistTask = {
        id: `task-${Date.now()}-${index}`,
        agentId: match.agent.id,
        agentName: config.name,
        agentAvatar: config.avatar,
        taskDescription: this.extractTaskDescription(userInput, match.matchedKeywords),
        priority: this.determinePriority(match.score),
        dependencies: taskType === 'sequential' && index > 0 
          ? [tasks[index - 1].id] 
          : [],
        status: 'pending',
      };

      tasks.push(task);
    });

    return tasks;
  }

  /**
   * 提取任务描述
   */
  private extractTaskDescription(userInput: string, keywords: string[]): string {
    // 截取输入中与任务相关的部分
    if (userInput.length <= 100) {
      return userInput;
    }

    // 尝试找到关键词所在的句子
    const sentences = userInput.split(/[。！？\n]/);
    for (const sentence of sentences) {
      if (keywords.some(kw => sentence.includes(kw))) {
        return sentence.trim().slice(0, 100);
      }
    }

    return userInput.slice(0, 100) + '...';
  }

  /**
   * 确定优先级
   */
  private determinePriority(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 30) return 'critical';
    if (score >= 20) return 'high';
    if (score >= 10) return 'medium';
    return 'low';
  }

  /**
   * 生成主Agent总结
   */
  private generateSummary(tasks: SpecialistTask[]): string {
    if (tasks.length === 1) {
      const task = tasks[0];
      return `我将创建任务窗口，由 ${task.agentAvatar} ${task.agentName} 来处理这个${task.priority === 'high' ? '高优先级' : ''}任务。`;
    }

    const agentNames = tasks.map(t => `${t.agentAvatar} ${t.agentName}`).join('、');
    return `我将分配 ${tasks.length} 个并行任务给 ${agentNames}，他们将在各自的窗口中并行执行。`;
  }

  /**
   * 更新组状态
   */
  private updateGroupStatus(group: ParallelTaskGroup): void {
    const allCompleted = group.tasks.every(t => t.status === 'completed');
    const anyFailed = group.tasks.some(t => t.status === 'failed');
    const anyRunning = group.tasks.some(t => t.status === 'running');

    if (allCompleted) {
      group.status = 'completed';
      group.completedAt = new Date();
    } else if (anyFailed && !anyRunning) {
      group.status = 'partial';
    } else if (anyRunning) {
      group.status = 'running';
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(group: ParallelTaskGroup): void {
    this.listeners.forEach(listener => {
      try {
        listener(group);
      } catch (e) {
        console.error('[SmartRouter] 监听器错误:', e);
      }
    });
  }
}

// 单例导出
export const smartRouter = new SmartRouterService();
export default smartRouter;