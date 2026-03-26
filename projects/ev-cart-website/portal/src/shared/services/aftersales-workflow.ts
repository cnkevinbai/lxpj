import { workflowEngineService } from './workflow-engine'
import { serviceTicketService, type ServiceTicket } from './service-ticket'
import api from './api'

/**
 * 售后工作流引擎
 */
export const afterSalesWorkflowEngine = {
  // ==================== 工单自动流转 ====================
  
  /**
   * 工单创建后自动流转
   */
  async onTicketCreated(ticket: ServiceTicket) {
    // 根据工单类型和优先级自动流转
    switch (ticket.type) {
      case 'installation':
        // 安装工单：自动派单
        await this.autoAssignTicket(ticket.id)
        break
      
      case 'repair':
        // 维修工单：根据优先级处理
        if (ticket.priority === 'urgent' || ticket.priority === 'high') {
          // 紧急/高优先级：立即派单
          await this.autoAssignTicket(ticket.id)
        } else {
          // 普通/低优先级：等待调度员分配
          await this.notifyDispatcher(ticket.id)
        }
        break
      
      case 'complaint':
        // 投诉工单：升级处理
        await this.escalateToManager(ticket.id)
        break
      
      case 'consultation':
        // 咨询工单：分配客服
        await this.assignToCustomerService(ticket.id)
        break
    }
  },

  /**
   * 自动派单
   */
  async autoAssignTicket(ticketId: string) {
    // 1. 获取工单详情
    const ticket = await serviceTicketService.getTicketById(ticketId)
    
    // 2. 查找合适的工程师
    const availableEngineers = await this.findAvailableEngineers(
      ticket.type,
      ticket.scheduledTime
    )
    
    if (availableEngineers.length > 0) {
      // 3. 选择最优工程师
      const bestEngineer = this.selectBestEngineer(availableEngineers, ticket)
      
      // 4. 分配工单
      await serviceTicketService.assignTicket(ticketId, bestEngineer.id, '系统自动派单')
      
      // 5. 通知工程师
      await this.notifyEngineer(ticketId, bestEngineer.id)
    } else {
      // 无可用工程师，通知调度员
      await this.notifyDispatcher(ticketId)
    }
  },

  /**
   * 查找可用工程师
   */
  async findAvailableEngineers(ticketType: string, scheduledTime?: Date) {
    const params = {
      skill: ticketType,
      availableTime: scheduledTime,
      status: 'available',
    }
    return api.get('/service/engineers/available', { params })
  },

  /**
   * 选择最优工程师
   */
  selectBestEngineer(engineers: any[], ticket: ServiceTicket) {
    // 评分算法
    return engineers
      .map(engineer => ({
        ...engineer,
        score: this.calculateEngineerScore(engineer, ticket),
      }))
      .sort((a, b) => b.score - a.score)[0]
  },

  /**
   * 工程师评分
   */
  calculateEngineerScore(engineer: any, ticket: ServiceTicket): number {
    let score = 0
    
    // 技能匹配（40 分）
    if (engineer.skills.includes(ticket.type)) {
      score += 40
    }
    
    // 距离远近（30 分）
    const distance = this.calculateDistance(engineer.location, ticket.customerLocation)
    score += Math.max(0, 30 - distance * 3)
    
    // 工作量（20 分）
    score += Math.max(0, 20 - engineer.currentTickets * 5)
    
    // 客户评分（10 分）
    score += engineer.rating * 2
    
    return score
  },

  /**
   * 计算距离
   */
  calculateDistance(loc1: any, loc2: any): number {
    // TODO: 实现距离计算
    return 0
  },

  // ==================== SLA 管理 ====================
  
  /**
   * 检查 SLA
   */
  async checkSla(ticketId: string) {
    const sla = await serviceTicketService.checkSla(ticketId)
    
    // SLA 预警
    if (sla.remainingTime < 3600000) { // 剩余时间<1 小时
      await this.sendSlaWarning(ticketId, 'urgent')
    } else if (sla.remainingTime < 7200000) { // 剩余时间<2 小时
      await this.sendSlaWarning(ticketId, 'warning')
    }
    
    // SLA 超时
    if (sla.isOverdue) {
      await this.onSlaOverdue(ticketId)
    }
  },

  /**
   * SLA 超时处理
   */
  async onSlaOverdue(ticketId: string) {
    // 1. 升级工单
    await serviceTicketService.escalateTicket(ticketId, 'SLA 超时', 1)
    
    // 2. 通知主管
    await this.notifySupervisor(ticketId, 'SLA 超时')
    
    // 3. 记录日志
    await this.logEvent(ticketId, 'sla_overdue')
  },

  // ==================== 配件联动 ====================
  
  /**
   * 领用配件
   */
  async useParts(ticketId: string, parts: any[]) {
    // 1. 检查库存
    const stockCheck = await this.checkPartsStock(parts)
    
    // 2. 库存不足时自动创建采购申请
    const insufficientParts = stockCheck.filter(p => p.insufficient)
    if (insufficientParts.length > 0) {
      await this.autoCreatePurchaseRequest(insufficientParts)
    }
    
    // 3. 扣减库存
    await serviceTicketService.useParts(ticketId, parts)
    
    // 4. 记录日志
    await this.logEvent(ticketId, 'parts_used', { parts })
  },

  /**
   * 检查配件库存
   */
  async checkPartsStock(parts: any[]) {
    const partIds = parts.map(p => p.partId)
    return api.get('/inventory/parts/check', { params: { partIds } })
  },

  /**
   * 自动创建采购申请
   */
  async autoCreatePurchaseRequest(parts: any[]) {
    return api.post('/purchase/requests/auto', {
      type: 'service_parts',
      parts,
      priority: 'urgent',
    })
  },

  // ==================== 费用结算 ====================
  
  /**
   * 完成工单并结算
   */
  async completeAndSettle(ticketId: string, data: any) {
    // 1. 完成工单
    await serviceTicketService.completeTicket(ticketId, data)
    
    // 2. 计算费用
    const fee = await serviceTicketService.calculateFee(ticketId)
    
    // 3. 结算费用
    await serviceTicketService.settleFee(ticketId, {
      laborFee: data.laborHours * 100, // 工时费
      partsFee: data.partsUsed.reduce((sum: number, p: any) => sum + p.totalPrice, 0),
      travelExpense: data.travelExpense || 0,
      otherFee: 0,
      discount: 0,
      totalAmount: fee.totalAmount,
    })
    
    // 4. 生成财务凭证
    await this.createFinanceVoucher(ticketId, fee)
    
    // 5. 邀请客户评价
    await this.requestRating(ticketId)
  },

  /**
   * 生成财务凭证
   */
  async createFinanceVoucher(ticketId: string, fee: any) {
    return api.post('/finance/vouchers/from-service', {
      businessType: 'service',
      businessId: ticketId,
      amount: fee.totalAmount,
      type: 'service_revenue',
    })
  },

  // ==================== 通知 ====================
  
  /**
   * 通知工程师
   */
  async notifyEngineer(ticketId: string, engineerId: string) {
    return api.post('/notifications/send', {
      userId: engineerId,
      type: 'ticket_assigned',
      data: { ticketId },
      channels: ['app', 'sms'],
    })
  },

  /**
   * 通知调度员
   */
  async notifyDispatcher(ticketId: string) {
    return api.post('/notifications/send', {
      role: 'dispatcher',
      type: 'ticket_pending',
      data: { ticketId },
      channels: ['app'],
    })
  },

  /**
   * 通知主管
   */
  async notifySupervisor(ticketId: string, reason: string) {
    return api.post('/notifications/send', {
      role: 'supervisor',
      type: 'ticket_escalated',
      data: { ticketId, reason },
      channels: ['app', 'sms'],
    })
  },

  /**
   * 发送 SLA 预警
   */
  async sendSlaWarning(ticketId: string, level: 'warning' | 'urgent') {
    return api.post('/notifications/send', {
      userId: 'assignee', // 当前处理人
      type: 'sla_warning',
      data: { ticketId, level },
      channels: level === 'urgent' ? ['app', 'sms', 'phone'] : ['app'],
    })
  },

  /**
   * 邀请客户评价
   */
  async requestRating(ticketId: string) {
    return api.post('/notifications/send', {
      userId: 'customer',
      type: 'request_rating',
      data: { ticketId },
      channels: ['sms'],
    })
  },

  // ==================== 日志 ====================
  
  /**
   * 记录事件
   */
  async logEvent(ticketId: string, event: string, data?: any) {
    return api.post('/service/tickets/logs', {
      ticketId,
      event,
      data,
    })
  },
}

export default afterSalesWorkflowEngine
