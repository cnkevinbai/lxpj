import api from './api'
import type {
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowTask,
  WorkflowLog,
  ProcessMonitor,
  WorkflowNode,
  WorkflowEdge,
} from '../types/workflow'

/**
 * 工作流引擎服务
 */
export const workflowEngineService = {
  // ==================== 流程定义管理 ====================
  
  /**
   * 创建流程定义
   */
  createDefinition: async (data: Partial<WorkflowDefinition>) => {
    return api.post('/workflow/definitions', data)
  },

  /**
   * 更新流程定义
   */
  updateDefinition: async (id: string, data: Partial<WorkflowDefinition>) => {
    return api.put(`/workflow/definitions/${id}`, data)
  },

  /**
   * 发布流程定义
   */
  publishDefinition: async (id: string, version?: number) => {
    return api.post(`/workflow/definitions/${id}/publish`, { version })
  },

  /**
   * 获取流程定义列表
   */
  getDefinitions: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    keyword?: string
  }) => {
    return api.get('/workflow/definitions', { params })
  },

  /**
   * 获取流程定义详情
   */
  getDefinitionById: async (id: string) => {
    return api.get(`/workflow/definitions/${id}`)
  },

  /**
   * 删除流程定义
   */
  deleteDefinition: async (id: string) => {
    return api.delete(`/workflow/definitions/${id}`)
  },

  // ==================== 流程实例管理 ====================
  
  /**
   * 启动流程实例
   */
  startInstance: async (definitionId: string, variables: Record<string, any>, businessKey?: string) => {
    return api.post('/workflow/instances', {
      definitionId,
      variables,
      businessKey,
    })
  },

  /**
   * 获取流程实例列表
   */
  getInstances: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    definitionId?: string
    businessKey?: string
    createdBy?: string
  }) => {
    return api.get('/workflow/instances', { params })
  },

  /**
   * 获取流程实例详情
   */
  getInstanceById: async (id: string) => {
    return api.get(`/workflow/instances/${id}`)
  },

  /**
   * 获取流程实例进度
   */
  getInstanceProgress: async (id: string) => {
    return api.get(`/workflow/instances/${id}/progress`)
  },

  /**
   * 暂停流程实例
   */
  suspendInstance: async (id: string) => {
    return api.post(`/workflow/instances/${id}/suspend`)
  },

  /**
   * 恢复流程实例
   */
  resumeInstance: async (id: string) => {
    return api.post(`/workflow/instances/${id}/resume`)
  },

  /**
   * 取消流程实例
   */
  cancelInstance: async (id: string, reason?: string) => {
    return api.post(`/workflow/instances/${id}/cancel`, { reason })
  },

  // ==================== 任务管理 ====================
  
  /**
   * 获取待办任务列表
   */
  getMyTasks: async (params?: {
    page?: number
    pageSize?: number
    status?: string
  }) => {
    return api.get('/workflow/tasks/my', { params })
  },

  /**
   * 获取任务详情
   */
  getTaskById: async (id: string) => {
    return api.get(`/workflow/tasks/${id}`)
  },

  /**
   * 完成任务（审批通过）
   */
  completeTask: async (taskId: string, variables?: Record<string, any>, comment?: string) => {
    return api.post(`/workflow/tasks/${taskId}/complete`, {
      variables,
      comment,
    })
  },

  /**
   * 拒绝任务
   */
  rejectTask: async (taskId: string, comment?: string, rejectToNodeId?: string) => {
    return api.post(`/workflow/tasks/${taskId}/reject`, {
      comment,
      rejectToNodeId,
    })
  },

  /**
   * 委托任务
   */
  delegateTask: async (taskId: string, delegateToUserId: string, comment?: string) => {
    return api.post(`/workflow/tasks/${taskId}/delegate`, {
      delegateToUserId,
      comment,
    })
  },

  /**
   * 转交任务
   */
  transferTask: async (taskId: string, newAssignee: string, comment?: string) => {
    return api.post(`/workflow/tasks/${taskId}/transfer`, {
      newAssignee,
      comment,
    })
  },

  /**
   * 加签
   */
  addApprover: async (taskId: string, userId: string, type: 'before' | 'after') => {
    return api.post(`/workflow/tasks/${taskId}/add-approver`, {
      userId,
      type,
    })
  },

  /**
   * 获取任务可执行操作
   */
  getTaskActions: async (taskId: string) => {
    return api.get(`/workflow/tasks/${taskId}/actions`)
  },

  // ==================== 流程日志 ====================
  
  /**
   * 获取流程日志
   */
  getInstanceLogs: async (instanceId: string, params?: {
    page?: number
    pageSize?: number
    type?: string
  }) => {
    return api.get(`/workflow/instances/${instanceId}/logs`, { params })
  },

  /**
   * 获取任务日志
   */
  getTaskLogs: async (taskId: string) => {
    return api.get(`/workflow/tasks/${taskId}/logs`)
  },

  // ==================== 流程监控 ====================
  
  /**
   * 获取流程监控数据
   */
  getProcessMonitor: async (params?: {
    definitionId?: string
    startTime?: string
    endTime?: string
  }) => {
    return api.get('/workflow/monitor', { params })
  },

  /**
   * 获取流程统计
   */
  getProcessStatistics: async (params?: {
    definitionId?: string
    startTime?: string
    endTime?: string
  }) => {
    return api.get('/workflow/statistics', { params })
  },

  // ==================== 流程设计辅助 ====================
  
  /**
   * 验证流程定义
   */
  validateDefinition: async (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
    return api.post('/workflow/definitions/validate', { nodes, edges })
  },

  /**
   * 导入流程定义
   */
  importDefinition: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/workflow/definitions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * 导出流程定义
   */
  exportDefinition: async (id: string) => {
    return api.get(`/workflow/definitions/${id}/export`, {
      responseType: 'blob',
    })
  },
}

/**
 * 工作流引擎核心类（客户端）
 */
export class WorkflowEngine {
  /**
   * 启动流程
   */
  async startProcess(definitionKey: string, variables: Record<string, any>, businessKey?: string) {
    // 先获取流程定义
    const definitions = await workflowEngineService.getDefinitions({
      status: 'active',
      keyword: definitionKey,
    })
    
    const definition = definitions.data.find((d: WorkflowDefinition) => d.key === definitionKey)
    if (!definition) {
      throw new Error(`流程定义不存在：${definitionKey}`)
    }

    return workflowEngineService.startInstance(definition.id, variables, businessKey)
  }

  /**
   * 评估条件
   */
  evaluateCondition(condition: string, variables: Record<string, any>): boolean {
    // 简单的条件评估（实际应该用更强大的表达式引擎）
    try {
      const fn = new Function('variables', `with(variables) { return ${condition}; }`)
      return !!fn(variables)
    } catch (error) {
      console.error('条件评估失败:', error)
      return false
    }
  }

  /**
   * 获取下一个节点
   */
  getNextNodes(nodes: WorkflowNode[], edges: WorkflowEdge[], currentNodeId: string, variables: Record<string, any>): string[] {
    const outgoingEdges = edges.filter(e => e.sourceNodeId === currentNodeId)
    
    const nextNodeIds: string[] = []
    for (const edge of outgoingEdges) {
      // 如果有条件，评估条件
      if (edge.condition) {
        if (this.evaluateCondition(edge.condition, variables)) {
          nextNodeIds.push(edge.targetNodeId)
        }
      } else {
        // 无条件，直接流转
        nextNodeIds.push(edge.targetNodeId)
      }
    }
    
    return nextNodeIds
  }
}

export default workflowEngineService
