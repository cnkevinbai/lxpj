/**
 * 服务模块服务
 * 处理售后服务、工单、合同、配件相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 工单类型定义 ====================

export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
export type TicketStatus = 'PENDING' | 'ASSIGNED' | 'PROCESSING' | 'COMPLETED' | 'CLOSED'
export type TicketType = 'REPAIR' | 'MAINTENANCE' | 'INSTALLATION' | 'CONSULTATION' | 'COMPLAINT'

export interface ServiceTicket {
  id: string
  ticketNo: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  title: string
  description: string
  solution: string | null
  images: string[] | null
  customerId: string
  customerName: string
  contactPhone: string | null
  assigneeId: string | null
  assigneeName: string | null
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

export interface CreateTicketDto {
  customerId: string
  type: TicketType
  priority?: TicketPriority
  title: string
  description: string
  images?: string[]
}

export interface UpdateTicketDto {
  type?: TicketType
  priority?: TicketPriority
  status?: TicketStatus
  title?: string
  description?: string
  solution?: string
  images?: string[]
}

export interface TicketQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: TicketStatus
  priority?: TicketPriority
  type?: TicketType
  customerId?: string
  assigneeId?: string
}

export interface TicketStatistics {
  total: number
  pending: number
  processing: number
  completed: number
  todayCount: number
  avgResolutionTime: number
}

// ==================== 合同类型定义 ====================

export type ContractStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL' | 'TERMINATED'

export interface ServiceContract {
  id: string
  contractNo: string
  customerId: string
  customerName: string
  contactPhone: string | null
  startDate: string
  endDate: string
  status: ContractStatus
  amount: number
  serviceScope: string
  attachmentUrls: string[] | null
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateContractDto {
  customerId: string
  startDate: string
  endDate: string
  amount: number
  serviceScope: string
  remark?: string
}

export interface UpdateContractDto {
  startDate?: string
  endDate?: string
  status?: ContractStatus
  amount?: number
  serviceScope?: string
  remark?: string
}

export interface ContractQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: ContractStatus
  customerId?: string
}

export interface ContractStatistics {
  total: number
  active: number
  expiringSoon: number
  expired: number
}

// ==================== 配件类型定义 ====================

export type PartStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'

export interface Part {
  id: string
  code: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  status: PartStatus
  unit: string
  supplier: string | null
  imageUrl: string | null
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePartDto {
  code: string
  name: string
  category: string
  price: number
  stock: number
  minStock?: number
  unit?: string
  supplier?: string
  remark?: string
}

export interface UpdatePartDto {
  name?: string
  category?: string
  price?: number
  stock?: number
  minStock?: number
  status?: PartStatus
  unit?: string
  supplier?: string
  remark?: string
}

export interface PartQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  status?: PartStatus
  lowStock?: boolean
}

export interface PartStatistics {
  total: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
}

export interface PartCategory {
  id: string
  name: string
  code: string
  parentId: string | null
}

// ==================== 服务工单服务 ====================

export const ticketService = {
  /**
   * 获取工单列表
   */
  getList(params: TicketQueryParams): Promise<PaginatedResponse<ServiceTicket>> {
    return request.get<PaginatedResponse<ServiceTicket>>('/service/tickets', { params })
  },

  /**
   * 获取工单详情
   */
  getOne(id: string): Promise<ServiceTicket> {
    return request.get<ServiceTicket>(`/service/tickets/${id}`)
  },

  /**
   * 创建工单
   */
  create(dto: CreateTicketDto): Promise<ServiceTicket> {
    return request.post<ServiceTicket>('/service/tickets', dto)
  },

  /**
   * 更新工单
   */
  update(id: string, dto: UpdateTicketDto): Promise<ServiceTicket> {
    return request.put<ServiceTicket>(`/service/tickets/${id}`, dto)
  },

  /**
   * 删除工单
   */
  delete(id: string): Promise<void> {
    return request.delete(`/service/tickets/${id}`)
  },

  /**
   * 分配工单
   */
  assign(id: string, assigneeId: string): Promise<ServiceTicket> {
    return request.post<ServiceTicket>(`/service/tickets/${id}/assign`, { assigneeId })
  },

  /**
   * 开始处理工单
   */
  startProcessing(id: string): Promise<ServiceTicket> {
    return request.post<ServiceTicket>(`/service/tickets/${id}/start`)
  },

  /**
   * 完成工单
   */
  complete(id: string, solution: string): Promise<ServiceTicket> {
    return request.post<ServiceTicket>(`/service/tickets/${id}/complete`, { solution })
  },

  /**
   * 关闭工单
   */
  close(id: string): Promise<ServiceTicket> {
    return request.post<ServiceTicket>(`/service/tickets/${id}/close`)
  },

  /**
   * 获取工单统计
   */
  getStatistics(): Promise<TicketStatistics> {
    return request.get<TicketStatistics>('/service/tickets/statistics')
  },

  /**
   * 获取工单类型列表
   */
  getTypes(): Promise<TicketType[]> {
    return request.get<TicketType[]>('/service/tickets/types')
  },
}

// ==================== 服务合同服务 ====================

export const contractService = {
  /**
   * 获取合同列表
   */
  getList(params: ContractQueryParams): Promise<PaginatedResponse<ServiceContract>> {
    return request.get<PaginatedResponse<ServiceContract>>('/service/contracts', { params })
  },

  /**
   * 获取合同详情
   */
  getOne(id: string): Promise<ServiceContract> {
    return request.get<ServiceContract>(`/service/contracts/${id}`)
  },

  /**
   * 创建合同
   */
  create(dto: CreateContractDto): Promise<ServiceContract> {
    return request.post<ServiceContract>('/service/contracts', dto)
  },

  /**
   * 更新合同
   */
  update(id: string, dto: UpdateContractDto): Promise<ServiceContract> {
    return request.put<ServiceContract>(`/service/contracts/${id}`, dto)
  },

  /**
   * 删除合同
   */
  delete(id: string): Promise<void> {
    return request.delete(`/service/contracts/${id}`)
  },

  /**
   * 续约合同
   */
  renew(id: string, endDate: string): Promise<ServiceContract> {
    return request.post<ServiceContract>(`/service/contracts/${id}/renew`, { endDate })
  },

  /**
   * 终止合同
   */
  terminate(id: string, reason: string): Promise<ServiceContract> {
    return request.post<ServiceContract>(`/service/contracts/${id}/terminate`, { reason })
  },

  /**
   * 获取合同统计
   */
  getStatistics(): Promise<ContractStatistics> {
    return request.get<ContractStatistics>('/service/contracts/statistics')
  },

  /**
   * 获取即将到期合同
   */
  getExpiringContracts(days: number): Promise<ServiceContract[]> {
    return request.get<ServiceContract[]>(`/service/contracts/expiring?days=${days}`)
  },
}

// ==================== 配件服务 ====================

export const partService = {
  /**
   * 获取配件列表
   */
  getList(params: PartQueryParams): Promise<PaginatedResponse<Part>> {
    return request.get<PaginatedResponse<Part>>('/service/parts', { params })
  },

  /**
   * 获取配件详情
   */
  getOne(id: string): Promise<Part> {
    return request.get<Part>(`/service/parts/${id}`)
  },

  /**
   * 创建配件
   */
  create(dto: CreatePartDto): Promise<Part> {
    return request.post<Part>('/service/parts', dto)
  },

  /**
   * 更新配件
   */
  update(id: string, dto: UpdatePartDto): Promise<Part> {
    return request.put<Part>(`/service/parts/${id}`, dto)
  },

  /**
   * 删除配件
   */
  delete(id: string): Promise<void> {
    return request.delete(`/service/parts/${id}`)
  },

  /**
   * 调整库存
   */
  adjustStock(id: string, quantity: number, reason: string): Promise<Part> {
    return request.post<Part>(`/service/parts/${id}/stock/adjust`, { quantity, reason })
  },

  /**
   * 获取配件统计
   */
  getStatistics(): Promise<PartStatistics> {
    return request.get<PartStatistics>('/service/parts/statistics')
  },

  /**
   * 获取配件分类
   */
  getCategories(): Promise<PartCategory[]> {
    return request.get<PartCategory[]>('/service/parts/categories')
  },

  /**
   * 获取库存预警配件
   */
  getLowStockParts(): Promise<Part[]> {
    return request.get<Part[]>('/service/parts/low-stock')
  },
}

export default { ticketService, contractService, partService }
