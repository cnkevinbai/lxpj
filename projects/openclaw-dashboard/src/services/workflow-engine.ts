/**
 * 代理工作流服务 - 多 Agent 协作编排
 * 
 * 功能：
 * - 工作流定义和执行
 * - 多 Agent 协作
 * - 任务分发和结果汇总
 */

// 工作流节点类型
export type WorkflowNodeType = 'agent' | 'condition' | 'parallel' | 'sequential' | 'output';

// 工作流节点
export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  name: string;
  agentId?: string;
  condition?: (input: any) => boolean;
  children?: WorkflowNode[];
  config?: Record<string, any>;
}

// 工作流定义
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  input?: any;
  output?: any;
  createdAt: string;
  updatedAt: string;
}

// 执行上下文
export interface WorkflowContext {
  workflowId: string;
  input: any;
  results: Map<string, any>;
  currentPath: string[];
  errors: Error[];
  startTime: number;
}

// 执行结果
export interface WorkflowResult {
  workflowId: string;
  success: boolean;
  output: any;
  executionTime: number;
  nodeResults: Record<string, any>;
  errors: string[];
}

// 预定义工作流模板
export const WORKFLOW_TEMPLATES: Record<string, Partial<Workflow>> = {
  // 代码开发工作流
  codeDevelopment: {
    name: '代码开发工作流',
    description: '需求分析 -> 架构设计 -> 后端开发 -> 前端开发 -> 测试',
    nodes: [
      { id: 'requirements', type: 'agent', name: '需求分析', agentId: 'product-manager' },
      { id: 'architecture', type: 'agent', name: '架构设计', agentId: 'architect' },
      { 
        id: 'development', 
        type: 'parallel', 
        name: '并行开发',
        children: [
          { id: 'backend', type: 'agent', name: '后端开发', agentId: 'backend-dev' },
          { id: 'frontend', type: 'agent', name: '前端开发', agentId: 'frontend-dev' },
        ]
      },
      { id: 'test', type: 'agent', name: '测试验证', agentId: 'test-engineer' },
      { id: 'review', type: 'agent', name: '代码审查', agentId: 'code-reviewer' },
    ],
  },

  // 安全审计工作流
  securityAudit: {
    name: '安全审计工作流',
    description: '代码审查 -> 安全分析 -> 漏洞修复 -> 验证',
    nodes: [
      { id: 'review', type: 'agent', name: '代码审查', agentId: 'code-reviewer' },
      { id: 'security', type: 'agent', name: '安全分析', agentId: 'security-engineer' },
      { id: 'fix', type: 'agent', name: '漏洞修复', agentId: 'backend-dev' },
      { id: 'verify', type: 'agent', name: '安全验证', agentId: 'test-engineer' },
    ],
  },

  // 快速原型工作流
  quickPrototype: {
    name: '快速原型工作流',
    description: '设计 -> 前端实现 -> 测试',
    nodes: [
      { id: 'design', type: 'agent', name: 'UI设计', agentId: 'ui-ux-designer' },
      { id: 'implement', type: 'agent', name: '前端实现', agentId: 'frontend-dev' },
      { id: 'test', type: 'agent', name: '功能测试', agentId: 'test-engineer' },
    ],
  },
};

// 工作流引擎
class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private runningContexts: Map<string, WorkflowContext> = new Map();

  /**
   * 创建工作流
   */
  createWorkflow(definition: Partial<Workflow>): Workflow {
    const workflow: Workflow = {
      id: definition.id || `workflow-${Date.now()}`,
      name: definition.name || '未命名工作流',
      description: definition.description,
      nodes: definition.nodes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  /**
   * 从模板创建工作流
   */
  createFromTemplate(templateName: string, customConfig?: Partial<Workflow>): Workflow {
    const template = WORKFLOW_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`模板 ${templateName} 不存在`);
    }

    return this.createWorkflow({
      ...template,
      ...customConfig,
      id: customConfig?.id || `${templateName}-${Date.now()}`,
    });
  }

  /**
   * 执行工作流
   */
  async execute(workflowId: string, input: any): Promise<WorkflowResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`工作流 ${workflowId} 不存在`);
    }

    const context: WorkflowContext = {
      workflowId,
      input,
      results: new Map(),
      currentPath: [],
      errors: [],
      startTime: Date.now(),
    };

    this.runningContexts.set(workflowId, context);

    try {
      // 执行所有节点
      for (const node of workflow.nodes) {
        await this.executeNode(node, context);
      }

      // 汇总结果
      const output = this.aggregateResults(context);

      return {
        workflowId,
        success: context.errors.length === 0,
        output,
        executionTime: Date.now() - context.startTime,
        nodeResults: Object.fromEntries(context.results),
        errors: context.errors.map(e => e.message),
      };
    } finally {
      this.runningContexts.delete(workflowId);
    }
  }

  /**
   * 执行单个节点
   */
  private async executeNode(node: WorkflowNode, context: WorkflowContext): Promise<any> {
    context.currentPath.push(node.id);

    try {
      let result: any;

      switch (node.type) {
        case 'agent':
          result = await this.executeAgentNode(node, context);
          break;

        case 'parallel':
          result = await this.executeParallelNode(node, context);
          break;

        case 'sequential':
          result = await this.executeSequentialNode(node, context);
          break;

        case 'condition':
          result = await this.executeConditionNode(node, context);
          break;

        case 'output':
          result = node.config?.value || context.results.get('output');
          break;

        default:
          throw new Error(`未知节点类型: ${node.type}`);
      }

      context.results.set(node.id, result);
      return result;
    } finally {
      context.currentPath.pop();
    }
  }

  /**
   * 执行 Agent 节点 - 调用真实 AI API
   */
  private async executeAgentNode(node: WorkflowNode, context: WorkflowContext): Promise<any> {
    if (!node.agentId) {
      throw new Error(`节点 ${node.id} 缺少 agentId`);
    }

    // 获取前一个节点的输出作为输入
    const previousResults = Array.from(context.results.values());
    const input = previousResults.length > 0 
      ? previousResults[previousResults.length - 1] 
      : context.input;

    console.log(`[Workflow] 执行 Agent: ${node.agentId}, 节点: ${node.name}`);
    
    try {
      // 调用真实 AI API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/stream/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: typeof input === 'string' ? input : JSON.stringify(input),
          agentId: node.agentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      // 读取流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let output = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.data?.content) {
                output += data.data.content;
              }
            } catch (e) {}
          }
        }
      }

      return {
        agentId: node.agentId,
        nodeName: node.name,
        input: typeof input === 'string' ? input : JSON.stringify(input),
        output,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`[Workflow] Agent 执行失败:`, error);
      throw error;
    }
  }

  /**
   * 执行并行节点
   */
  private async executeParallelNode(node: WorkflowNode, context: WorkflowContext): Promise<any> {
    if (!node.children || node.children.length === 0) {
      return null;
    }

    // 并行执行所有子节点
    const results = await Promise.all(
      node.children.map(child => this.executeNode(child, context))
    );

    return {
      type: 'parallel',
      results: results.map((r, i) => ({
        nodeId: node.children![i].id,
        result: r,
      })),
    };
  }

  /**
   * 执行顺序节点
   */
  private async executeSequentialNode(node: WorkflowNode, context: WorkflowContext): Promise<any> {
    if (!node.children || node.children.length === 0) {
      return null;
    }

    // 顺序执行所有子节点
    const results: any[] = [];
    for (const child of node.children) {
      const result = await this.executeNode(child, context);
      results.push(result);
    }

    return {
      type: 'sequential',
      results: results.map((r, i) => ({
        nodeId: node.children![i].id,
        result: r,
      })),
    };
  }

  /**
   * 执行条件节点
   */
  private async executeConditionNode(node: WorkflowNode, context: WorkflowContext): Promise<any> {
    if (!node.condition || !node.children) {
      return null;
    }

    const conditionResult = node.condition(context.input);
    
    if (conditionResult && node.children.length > 0) {
      return await this.executeNode(node.children[0], context);
    } else if (!conditionResult && node.children.length > 1) {
      return await this.executeNode(node.children[1], context);
    }

    return null;
  }

  /**
   * 汇总结果
   */
  private aggregateResults(context: WorkflowContext): any {
    const results: Record<string, any> = {};
    
    context.results.forEach((value, key) => {
      results[key] = value;
    });

    return results;
  }

  /**
   * 获取工作流
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * 获取所有工作流
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * 删除工作流
   */
  deleteWorkflow(workflowId: string): boolean {
    return this.workflows.delete(workflowId);
  }
}

// 导出单例
export const workflowEngine = new WorkflowEngine();
export default workflowEngine;