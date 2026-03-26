/**
 * 任务分配服务 - 主 Agent 自动分配任务给专业 Agent
 * 
 * 功能：
 * 1. 分析任务内容，识别任务类型
 * 2. 自动分配给最合适的专业 Agent
 * 3. 自动创建任务窗口
 * 4. 追踪任务状态
 */

import { matchAgent, getAllMatchingAgents, AgentRouteConfig } from './agent-router';
import { windowService } from './window-manager';

// 任务状态
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';

// 任务定义
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedAgent: AgentRouteConfig | null;
  status: TaskStatus;
  windowId: string | null;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
}

// 任务分配结果
export interface TaskAssignmentResult {
  success: boolean;
  task: Task | null;
  windowId: string | null;
  message: string;
}

// 任务监听器
type TaskListener = (tasks: Task[]) => void;

class TaskDispatcher {
  private tasks: Map<string, Task> = new Map();
  private listeners: Set<TaskListener> = new Set();
  private taskCounter: number = 0;

  /**
   * 分析并分配任务
   * 主 Agent 调用此方法自动分配任务
   */
  async dispatchTask(input: string, autoOpenWindow: boolean = true): Promise<TaskAssignmentResult> {
    // 1. 匹配最适合的 Agent
    const matches = getAllMatchingAgents(input);
    
    if (matches.length === 0) {
      return {
        success: false,
        task: null,
        windowId: null,
        message: '无法识别任务类型，建议在主窗口继续对话',
      };
    }

    // 选择最高分的 Agent
    const bestMatch = matches[0];
    
    // 2. 创建任务
    const taskId = this.generateTaskId();
    const task: Task = {
      id: taskId,
      title: this.generateTaskTitle(input, bestMatch.agent),
      description: input,
      assignedAgent: bestMatch.agent,
      status: 'assigned',
      windowId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: this.determinePriority(input, bestMatch),
      keywords: bestMatch.matchedKeywords,
    };

    this.tasks.set(taskId, task);
    this.notifyListeners();

    // 3. 自动创建任务窗口（如果需要）
    let windowId: string | null = null;
    if (autoOpenWindow) {
      try {
        windowId = windowService.openTaskWindow({
          agentId: bestMatch.agent.id,
          title: task.title,
        });
        
        task.windowId = windowId;
        task.status = 'in_progress';
        this.tasks.set(taskId, task);
        this.notifyListeners();
      } catch (error) {
        console.error('[TaskDispatcher] 创建窗口失败:', error);
        task.status = 'pending';
        this.tasks.set(taskId, task);
        this.notifyListeners();
      }
    }

    console.log(`[TaskDispatcher] 任务已分配: ${taskId} -> ${bestMatch.agent.name}`);

    return {
      success: true,
      task,
      windowId,
      message: `任务已分配给 ${bestMatch.agent.avatar} ${bestMatch.agent.name}，关键词匹配: ${bestMatch.matchedKeywords.join(', ')}`,
    };
  }

  /**
   * 批量分配任务
   * 将复杂任务拆分并分配给多个 Agent
   */
  async dispatchMultipleTasks(inputs: string[]): Promise<TaskAssignmentResult[]> {
    const results: TaskAssignmentResult[] = [];
    
    for (const input of inputs) {
      const result = await this.dispatchTask(input, false);
      results.push(result);
    }

    // 批量创建窗口（避免同时打开太多）
    for (const result of results) {
      if (result.success && result.task) {
        try {
          const windowId = windowService.openTaskWindow({
            agentId: result.task.assignedAgent!.id,
            title: result.task.title,
          });
          result.windowId = windowId;
          result.task.windowId = windowId;
          result.task.status = 'in_progress';
          this.tasks.set(result.task.id, result.task);
        } catch (error) {
          console.error('[TaskDispatcher] 批量创建窗口失败:', error);
        }
      }
    }

    this.notifyListeners();
    return results;
  }

  /**
   * 更新任务状态
   */
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date();
      this.tasks.set(taskId, task);
      this.notifyListeners();
    }
  }

  /**
   * 完成任务
   */
  completeTask(taskId: string): void {
    this.updateTaskStatus(taskId, 'completed');
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * 获取活跃任务
   */
  getActiveTasks(): Task[] {
    return this.getAllTasks().filter(t => t.status === 'in_progress' || t.status === 'assigned');
  }

  /**
   * 获取任务统计
   */
  getTaskStats(): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
  } {
    const all = this.getAllTasks();
    return {
      total: all.length,
      pending: all.filter(t => t.status === 'pending').length,
      inProgress: all.filter(t => t.status === 'in_progress').length,
      completed: all.filter(t => t.status === 'completed').length,
      failed: all.filter(t => t.status === 'failed').length,
    };
  }

  /**
   * 监听任务变化
   */
  onTasksChange(listener: TaskListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 清理已完成任务
   */
  clearCompletedTasks(): void {
    for (const [id, task] of this.tasks) {
      if (task.status === 'completed') {
        this.tasks.delete(id);
      }
    }
    this.notifyListeners();
  }

  // ========== 私有方法 ==========

  private generateTaskId(): string {
    return `task-${Date.now()}-${++this.taskCounter}`;
  }

  private generateTaskTitle(input: string, agent: AgentRouteConfig): string {
    // 截取输入的前20个字符作为标题
    const shortDesc = input.length > 20 ? input.slice(0, 20) + '...' : input;
    return `${agent.avatar} ${shortDesc}`;
  }

  private determinePriority(input: string, match: { agent: AgentRouteConfig; score: number; matchedKeywords: string[] }): 'low' | 'medium' | 'high' | 'critical' {
    const criticalKeywords = ['紧急', '立即', '马上', 'critical', 'urgent', ' ASAP'];
    const highKeywords = ['重要', '尽快', '今天', 'high'];
    
    const lowerInput = input.toLowerCase();
    
    if (criticalKeywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
      return 'critical';
    }
    if (highKeywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
      return 'high';
    }
    if (match.score >= 30) {
      return 'high';
    }
    if (match.score >= 20) {
      return 'medium';
    }
    return 'low';
  }

  private notifyListeners(): void {
    const tasks = this.getAllTasks();
    this.listeners.forEach(listener => listener(tasks));
  }
}

// 导出单例
export const taskDispatcher = new TaskDispatcher();

/**
 * React Hook: 使用任务分配
 */
export function useTaskDispatcher() {
  return taskDispatcher;
}

/**
 * React Hook: 获取任务列表
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    setTasks(taskDispatcher.getAllTasks());
    return taskDispatcher.onTasksChange(setTasks);
  }, []);
  
  return tasks;
}

// Import React hooks at the module level
import { useState, useEffect } from 'react';