import api from './api'
import type { ServiceTicket, TicketStatistics, EngineerWorkload, TicketLog } from '../types/service-ticket'

/**
 * 售后工单服务
 */
export const serviceTicketService = {
  // ==================== 工单创建 ====================
  
  /**
   * 创建服务工单
   */
  createTicket: async (data: Partial<ServiceTicket>) => {
    return api.post('/service/tickets', data)
  },

  /**
   * 批量创建工单
   */
  createTicketsBatch: async (tickets: Partial<ServiceTicket>[]) => {
    return api.post('/service/tickets/batch', { tickets })
  },

  // ==================== 工单查询 ====================
  
  /**
   * 获取工单列表
   */
  getTickets: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    type?: string
    source?: string
    priority?: string
    serviceType?: string
    assigneeId?: string
    customerId?: string
    receivedBy?: string
    assessedBy?: string
    startDate?: string
    endDate?: string
    keyword?: string
  }) => {
    return api.get('/service/tickets', { params })
  },

  /**
   * 获取工单详情
   */
  getTicketById: async (id: string) => {
    return api.get(`/service/tickets/${id}`)
  },

  /**
   * 获取工单列表（我的）
   */
  getMyTickets: async (params?: {
    page?: number
    pageSize?: number
    role?: 'customer_service' | 'supervisor' | 'engineer'
  }) => {
    return api.get('/service/tickets/my', { params })
  },

  /**
   * 获取工单数量统计
   */
  getTicketCount: async (params?: {
    status?: string
    type?: string
    priority?: string
  }) => {
    return api.get('/service/tickets/count', { params })
  },

  // ==================== 工单更新 ====================
  
  /**
   * 更新工单
   */
  updateTicket: async (id: string, data: Partial<ServiceTicket>) => {
    return api.put(`/service/tickets/${id}`, data)
  },

  /**
   * 删除工单
   */
  deleteTicket: async (id: string) => {
    return api.delete(`/service/tickets/${id}`)
  },

  // ==================== 客服接待 ====================
  
  /**
   * 客服接待登记
   */
  receiveTicket: async (id: string, data: {
    preliminaryAssessment: string
    customerId: string
    customerName: string
    customerPhone: string
    type: string
    priority: string
    subject: string
    problemDescription: string
    problemPhotos?: string[]
  }) => {
    return api.post(`/service/tickets/${id}/receive`, data)
  },

  /**
   * 分配给主管评估
   */
  assignToSupervisor: async (id: string, supervisorId: string) => {
    return api.post(`/service/tickets/${id}/assign-supervisor`, { supervisorId })
  },

  // ==================== 主管评估 ====================
  
  /**
   * 主管评估工单
   */
  assessTicket: async (id: string, data: {
    technicalDifficulty: string
    requiredSkills?: string[]
    productCondition: string
    needParts: boolean
    estimatedParts?: any[]
    estimatedHours: number
    estimatedCost: number
    assessmentNotes?: string
  }) => {
    return api.post(`/service/tickets/${id}/assess`, data)
  },

  /**
   * 决策服务方式
   */
  decideServiceType: async (id: string, data: {
    serviceType: 'onsite' | 'mail' | 'remote'
    serviceTypeReason: string
  }) => {
    return api.post(`/service/tickets/${id}/decide`, data)
  },

  /**
   * 获取智能推荐服务方式
   */
  getRecommendedServiceType: async (id: string) => {
    return api.get(`/service/tickets/${id}/recommend`)
  },

  // ==================== 现场服务 ====================
  
  /**
   * 指派工程师
   */
  assignEngineer: async (id: string, data: {
    assigneeId: string
    scheduledTime: string
    notes?: string
  }) => {
    return api.post(`/service/tickets/${id}/assign-engineer`, data)
  },

  /**
   * 工程师接单
   */
  acceptTicket: async (id: string) => {
    return api.post(`/service/tickets/${id}/accept`)
  },

  /**
   * 工程师拒单
   */
  rejectTicket: async (id: string, reason: string) => {
    return api.post(`/service/tickets/${id}/reject`, { reason })
  },

  /**
   * 开始服务
   */
  startService: async (id: string, data: {
    actualArrivalTime: string
    notes?: string
  }) => {
    return api.post(`/service/tickets/${id}/start`, data)
  },

  /**
   * 完成服务
   */
  completeService: async (id: string, data: {
    resolution: string
    partsUsed?: any[]
    laborHours: number
    travelExpense: number
    notes?: string
  }) => {
    return api.post(`/service/tickets/${id}/complete`, data)
  },

  /**
   * 提交服务报告
   */
  submitServiceReport: async (id: string, data: {
    resolution: string
    partsUsed?: any[]
    laborHours: number
    travelDistance: number
    travelExpense: number
    photos?: string[]
    notes?: string
  }) => {
    return api.post(`/service/tickets/${id}/report`, data)
  },

  // ==================== 寄件服务 ====================
  
  /**
   * 准备配件
   */
  prepareParts: async (id: string, parts: any[]) => {
    return api.post(`/service/tickets/${id}/parts/prepare`, { parts })
  },

  /**
   * 发货
   */
  shipParts: async (id: string, data: {
    courierCompany: string
    trackingNumber: string
    shippingCost: number
  }) => {
    return api.post(`/service/tickets/${id}/ship`, data)
  },

  /**
   * 确认收货
   */
  confirmDelivery: async (id: string) => {
    return api.post(`/service/tickets/${id}/confirm-delivery`)
  },

  /**
   * 旧件寄回
   */
  returnOldParts: async (id: string, data: {
    returnTrackingNumber: string
  }) => {
    return api.post(`/service/tickets/${id}/return-parts`, data)
  },

  // ==================== 远程指导 ====================
  
  /**
   * 开始远程指导
   */
  startRemoteSupport: async (id: string, data: {
    supportType: 'phone' | 'video' | 'chat' | 'screen_share'
  }) => {
    return api.post(`/service/tickets/${id}/remote/start`, data)
  },

  /**
   * 记录指导会话
   */
  recordRemoteSession: async (id: string, data: {
    method: string
    notes: string
    screenshots?: string[]
    recording?: string
  }) => {
    return api.post(`/service/tickets/${id}/remote/session`, data)
  },

  /**
   * 完成远程指导
   */
  completeRemoteSupport: async (id: string, data: {
    resolved: boolean
    resolutionNotes: string
  }) => {
    return api.post(`/service/tickets/${id}/remote/complete`, data)
  },

  // ==================== 客户确认 ====================
  
  /**
   * 客户确认服务
   */
  customerConfirm: async (id: string, data: {
    confirmed: boolean
    notes?: string
  }) => {
    return api.post(`/service/tickets/${id}/customer-confirm`, data)
  },

  // ==================== 客户评价 ====================
  
  /**
   * 提交评价
   */
  submitRating: async (id: string, data: {
    rating: number
    serviceAttitudeRating?: number
    technicalSkillRating?: number
    responseSpeedRating?: number
    comment?: string
    tags?: string[]
  }) => {
    return api.post(`/service/tickets/${id}/rating`, data)
  },

  /**
   * 邀请评价
   */
  requestRating: async (id: string) => {
    return api.post(`/service/tickets/${id}/request-rating`)
  },

  // ==================== 费用结算 ====================
  
  /**
   * 计算费用
   */
  calculateFee: async (id: string) => {
    return api.get(`/service/tickets/${id}/fee`)
  },

  /**
   * 结算费用
   */
  settleFee: async (id: string, data: {
    laborFee: number
    partsFee: number
    travelExpense: number
    otherFee: number
    discount?: number
  }) => {
    return api.post(`/service/tickets/${id}/settle`, data)
  },

  /**
   * 确认收款
   */
  confirmPayment: async (id: string, data: {
    paymentMethod: string
    paymentAmount: number
    paymentDate: string
  }) => {
    return api.post(`/service/tickets/${id}/payment`, data)
  },

  // ==================== 工单关闭 ====================
  
  /**
   * 关闭工单
   */
  closeTicket: async (id: string, data: {
    reason?: string
  }) => {
    return api.post(`/service/tickets/${id}/close`, data)
  },

  /**
   * 重新打开工单
   */
  reopenTicket: async (id: string, data: {
    reason: string
  }) => {
    return api.post(`/service/tickets/${id}/reopen`, data)
  },

  /**
   * 取消工单
   */
  cancelTicket: async (id: string, data: {
    reason: string
  }) => {
    return api.post(`/service/tickets/${id}/cancel`, data)
  },

  // ==================== 工单日志 ====================
  
  /**
   * 获取工单日志
   */
  getTicketLogs: async (id: string, params?: {
    page?: number
    pageSize?: number
    type?: string
  }) => {
    return api.get(`/service/tickets/${id}/logs`, { params })
  },

  /**
   * 添加日志
   */
  addLog: async (id: string, data: {
    type: string
    action: string
    message: string
  }) => {
    return api.post(`/service/tickets/${id}/logs`, data)
  },

  // ==================== 统计分析 ====================
  
  /**
   * 获取工单统计
   */
  getStatistics: async (params?: {
    startDate?: string
    endDate?: string
    type?: string
    serviceType?: string
    assigneeId?: string
  }) => {
    return api.get('/service/statistics', { params })
  },

  /**
   * 获取工程师工作量
   */
  getEngineerWorkload: async (params?: {
    startDate?: string
    endDate?: string
    engineerId?: string
  }) => {
    return api.get('/service/engineer-workload', { params })
  },

  /**
   * 获取客户满意度
   */
  getSatisfactionRate: async (params?: {
    startDate?: string
    endDate?: string
    assigneeId?: string
    serviceType?: string
  }) => {
    return api.get('/service/satisfaction-rate', { params })
  },

  /**
   * 获取 SLA 达标率
   */
  getSlaComplianceRate: async (params?: {
    startDate?: string
    endDate?: string
    type?: string
  }) => {
    return api.get('/service/sla-compliance', { params })
  },
}

export default serviceTicketService
