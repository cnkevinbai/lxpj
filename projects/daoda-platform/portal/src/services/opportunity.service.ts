/**
 * 商机服务
 * 处理商机管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type OpportunityStage = 
  | 'INITIAL' 
  | 'REQUIREMENT' 
  | 'QUOTATION' 
  | 'NEGOTIATION' 
  | 'CONTRACT' 
  | 'CLOSED_WON' 
  | 'CLOSED_LOST'

export interface Opportunity {
  id: string
  name: string
  stage: OpportunityStage
  amount: number
  probability: number
  expectedCloseDate: string | null
  customerId: string
  customerName: string
  contact: string | null
  phone: string | null
  userId: string | null
  userName: string | null
  source: string | null
  description: string | null
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateOpportunityDto {
  name: string
  customerId: string
  amount: number
  stage?: OpportunityStage
  probability?: number
  expectedCloseDate?: string
  contact?: string
  phone?: string
  source?: string
  description?: string
  remark?: string
}

export interface UpdateOpportunityDto {
  name?: string
  stage?: OpportunityStage
  amount?: number
  probability?: number
  expectedCloseDate?: string
  contact?: string
  phone?: string
  source?: string
  description?: string
  remark?: string
}

export interface OpportunityQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  stage?: OpportunityStage
  customerId?: string
  startDate?: string
  endDate?: string
}

// 商机阶段映射
export const stageMap: Record<OpportunityStage, { color: string; text: string }> = {
  INITIAL: { color: 'blue', text: '初步接触' },
  REQUIREMENT: { color: 'cyan', text: '需求确认' },
  QUOTATION: { color: 'green', text: '报价中' },
  NEGOTIATION: { color: 'orange', text: '谈判中' },
  CONTRACT: { color: 'purple', text: '合同阶段' },
  CLOSED_WON: { color: 'green', text: '赢单' },
  CLOSED_LOST: { color: 'red', text: '输单' },
}

// ==================== 商机服务 ====================

export const opportunityService = {
  /**
   * 获取商机列表
   */
  getList(params: OpportunityQueryParams): Promise<PaginatedResponse<Opportunity>> {
    return request.get<PaginatedResponse<Opportunity>>('/opportunities', { params })
  },

  /**
   * 获取商机详情
   */
  getOne(id: string): Promise<Opportunity> {
    return request.get<Opportunity>(`/opportunities/${id}`)
  },

  /**
   * 创建商机
   */
  create(dto: CreateOpportunityDto): Promise<Opportunity> {
    return request.post<Opportunity>('/opportunities', dto)
  },

  /**
   * 更新商机
   */
  update(id: string, dto: UpdateOpportunityDto): Promise<Opportunity> {
    return request.put<Opportunity>(`/opportunities/${id}`, dto)
  },

  /**
   * 删除商机
   */
  delete(id: string): Promise<void> {
    return request.delete(`/opportunities/${id}`)
  },

  /**
   * 更新商机阶段
   */
  updateStage(id: string, stage: OpportunityStage): Promise<Opportunity> {
    return request.put(`/opportunities/${id}/stage`, { stage })
  },

  /**
   * 赢单
   */
  win(id: string): Promise<Opportunity> {
    return request.post(`/opportunities/${id}/win`)
  },

  /**
   * 输单
   */
  lose(id: string): Promise<Opportunity> {
    return request.post(`/opportunities/${id}/lose`)
  },

  /**
   * 转移商机
   */
  transfer(id: string, userId: string): Promise<Opportunity> {
    return request.post(`/opportunities/${id}/transfer`, { userId })
  },
}

export default opportunityService
