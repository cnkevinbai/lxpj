import api from './api'
import type { WorkflowTask, WorkflowDefinition } from '../types/workflow'

/**
 * 审批流服务
 */
export const approvalFlowService = {
  // ==================== 审批模板管理 ====================
  
  /**
   * 创建审批模板
   */
  createTemplate: async (data: {
    name: string
    description?: string
    workflowDefinitionKey: string
    businessType: string
    conditions?: ApprovalCondition[]
  }) => {
    return api.post('/approval/templates', data)
  },

  /**
   * 获取审批模板列表
   */
  getTemplates: async (params?: {
    page?: number
    pageSize?: number
    businessType?: string
  }) => {
    return api.get('/approval/templates', { params })
  },

  /**
   * 更新审批模板
   */
  updateTemplate: async (id: string, data: Partial<any>) => {
    return api.put(`/approval/templates/${id}`, data)
  },

  /**
   * 删除审批模板
   */
  deleteTemplate: async (id: string) => {
    return api.delete(`/approval/templates/${id}`)
  },

  // ==================== 审批配置 ====================
  
  /**
   * 创建审批配置
   */
  createApprovalConfig: async (data: {
    businessType: string
    workflowDefinitionKey: string
    conditions: ApprovalCondition[]
    priority: number
    enabled: boolean
  }) => {
    return api.post('/approval/configs', data)
  },

  /**
   * 获取审批配置
   */
  getApprovalConfigs: async (businessType: string) => {
    return api.get(`/approval/configs/${businessType}`)
  },

  /**
   * 更新审批配置
   */
  updateApprovalConfig: async (id: string, data: Partial<any>) => {
    return api.put(`/approval/configs/${id}`, data)
  },

  // ==================== 审批任务 ====================
  
  /**
   * 获取我的待办审批
   */
  getMyApprovals: async (params?: {
    page?: number
    pageSize?: number
    status?: 'pending' | 'completed'
  }) => {
    return api.get('/approval/my', { params })
  },

  /**
   * 获取待我审批的数量
   */
  getPendingApprovalCount: async () => {
    return api.get('/approval/pending-count')
  },

  /**
   * 审批通过
   */
  approve: async (taskId: string, comment?: string) => {
    return api.post(`/approval/tasks/${taskId}/approve`, { comment })
  },

  /**
   * 审批拒绝
   */
  reject: async (taskId: string, comment?: string, rejectToNodeId?: string) => {
    return api.post(`/approval/tasks/${taskId}/reject`, {
      comment,
      rejectToNodeId,
    })
  },

  /**
   * 审批转交
   */
  transfer: async (taskId: string, newAssignee: string, comment?: string) => {
    return api.post(`/approval/tasks/${taskId}/transfer`, {
      newAssignee,
      comment,
    })
  },

  /**
   * 审批委托
   */
  delegate: async (taskId: string, delegateToUserId: string, comment?: string) => {
    return api.post(`/approval/tasks/${taskId}/delegate`, {
      delegateToUserId,
      comment,
    })
  },

  /**
   * 审批加签
   */
  addApprover: async (taskId: string, userId: string, type: 'before' | 'after', comment?: string) => {
    return api.post(`/approval/tasks/${taskId}/add-approver`, {
      userId,
      type,
      comment,
    })
  },

  /**
   * 批量审批
   */
  batchApprove: async (taskIds: string[], comment?: string) => {
    return api.post('/approval/batch-approve', {
      taskIds,
      comment,
    })
  },

  // ==================== 审批历史 ====================
  
  /**
   * 获取审批历史
   */
  getApprovalHistory: async (businessType: string, businessId: string) => {
    return api.get(`/approval/history/${businessType}/${businessId}`)
  },

  /**
   * 获取我的审批历史
   */
  getMyApprovalHistory: async (params?: {
    page?: number
    pageSize?: number
  }) => {
    return api.get('/approval/my-history', { params })
  },

  // ==================== 审批统计 ====================
  
  /**
   * 获取审批统计
   */
  getApprovalStatistics: async (params?: {
    startTime?: string
    endTime?: string
    userId?: string
    departmentId?: string
  }) => {
    return api.get('/approval/statistics', { params })
  },

  /**
   * 获取审批效率分析
   */
  getApprovalEfficiency: async (params?: {
    definitionId?: string
    startTime?: string
    endTime?: string
  }) => {
    return api.get('/approval/efficiency', { params })
  },
}

/**
 * 审批条件
 */
export interface ApprovalCondition {
  field: string
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contains' | 'starts_with' | 'ends_with'
  value: any
  and?: ApprovalCondition[]
  or?: ApprovalCondition[]
}

/**
 * 审批流程快捷方法
 */
export const approvalFlow = {
  /**
   * 提交采购订单审批
   */
  submitPurchaseOrder: async (orderId: string, amount: number) => {
    return approvalFlowService.createApprovalConfig({
      businessType: 'purchase_order',
      workflowDefinitionKey: 'purchase_approval',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: 10000,
          and: [
            { field: 'type', operator: '==', value: 'equipment' }
          ]
        }
      ],
      priority: 1,
      enabled: true,
    })
  },

  /**
   * 提交费用报销审批
   */
  submitExpenseReimbursement: async (expenseId: string, amount: number) => {
    return approvalFlowService.createApprovalConfig({
      businessType: 'expense_reimbursement',
      workflowDefinitionKey: 'expense_approval',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: 5000,
        }
      ],
      priority: 1,
      enabled: true,
    })
  },

  /**
   * 提交合同审批
   */
  submitContractApproval: async (contractId: string, amount: number) => {
    return approvalFlowService.createApprovalConfig({
      businessType: 'contract',
      workflowDefinitionKey: 'contract_approval',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: 100000,
        }
      ],
      priority: 1,
      enabled: true,
    })
  },

  /**
   * 提交请假审批
   */
  submitLeaveApproval: async (leaveId: string, days: number) => {
    return approvalFlowService.createApprovalConfig({
      businessType: 'leave',
      workflowDefinitionKey: 'leave_approval',
      conditions: [
        {
          field: 'days',
          operator: '>',
          value: 3,
        }
      ],
      priority: 1,
      enabled: true,
    })
  },
}

export default approvalFlowService
