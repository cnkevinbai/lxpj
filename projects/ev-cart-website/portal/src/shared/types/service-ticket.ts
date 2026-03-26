// 售后工单类型定义

export type TicketStatus = 
  | 'pending_reception'      // 待接待
  | 'pending_assessment'     // 待评估
  | 'onsite_service'         // 现场服务
  | 'mail_service'           // 寄件服务
  | 'remote_support'         // 远程指导
  | 'waiting_parts'          // 等待配件
  | 'waiting_customer'       // 等待客户确认
  | 'completed'              // 已完成
  | 'closed'                 // 已关闭
  | 'cancelled'              // 已取消

export type TicketType = 'installation' | 'maintenance' | 'repair' | 'complaint' | 'consultation'
export type TicketSource = 'customer' | 'sales' | 'hotline' | 'online' | 'wechat' | 'email'
export type TicketPriority = 'urgent' | 'high' | 'normal' | 'low'
export type ServiceType = 'onsite' | 'mail' | 'remote'
export type TechnicalDifficulty = 'simple' | 'normal' | 'complex' | 'expert'
export type ProductCondition = 'good' | 'normal' | 'damaged' | 'unknown'

/**
 * 售后服务工单
 */
export interface ServiceTicket {
  // 基础信息
  id: string
  ticketNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  
  // 产品信息
  productId?: string
  productName?: string
  productModel?: string
  serialNumber?: string
  warrantyStatus: boolean
  warrantyExpiryDate?: Date
  purchaseDate?: Date
  
  // 服务请求
  type: TicketType
  source: TicketSource
  priority: TicketPriority
  subject: string
  problemDescription: string
  problemPhotos: string[]
  expectedResolution?: string
  
  // 客服接待
  receivedBy: string           // 客服 ID
  receivedByName: string       // 客服姓名
  receivedAt: Date
  preliminaryAssessment?: string
  
  // 主管评估
  assessedBy?: string          // 主管 ID
  assessedByName?: string      // 主管姓名
  assessedAt?: Date
  technicalDifficulty?: TechnicalDifficulty
  requiredSkills?: string[]
  productCondition?: ProductCondition
  needParts?: boolean
  estimatedParts?: Part[]
  estimatedHours?: number
  estimatedCost?: number
  assessmentNotes?: string
  
  // 服务方式决策
  serviceType?: ServiceType
  serviceTypeReason?: string
  decidedBy?: string
  decidedAt?: Date
  
  // 现场服务相关
  assigneeId?: string
  assigneeName?: string
  scheduledTime?: Date
  actualArrivalTime?: Date
  actualCompletionTime?: Date
  travelDistance?: number
  travelExpense?: number
  
  // 寄件服务相关
  mailInfo?: MailService
  
  // 远程指导相关
  remoteSupport?: RemoteSupport
  
  // 配件使用
  partsUsed?: Part[]
  
  // 费用结算
  laborFee?: number
  partsFee?: number
  otherFee?: number
  discount?: number
  totalAmount?: number
  paymentStatus?: 'unpaid' | 'partial' | 'paid'
  
  // 客户确认
  customerConfirmed?: boolean
  confirmedAt?: Date
  confirmedBy?: string
  
  // 客户评价
  rating?: number
  serviceAttitudeRating?: number
  technicalSkillRating?: number
  responseSpeedRating?: number
  ratingComment?: string
  ratingTags?: string[]
  ratedAt?: Date
  
  // 状态
  status: TicketStatus
  slaDeadline?: Date
  completedAt?: Date
  closedAt?: Date
  closedBy?: string
  closedReason?: string
  
  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * 配件
 */
export interface Part {
  partId: string
  partName: string
  partNumber: string
  quantity: number
  unitPrice: number
  totalPrice: number
  used: boolean
  returned: boolean
  condition: 'new' | 'refurbished' | 'used'
}

/**
 * 邮寄服务
 */
export interface MailService {
  // 邮寄信息
  mailId: string
  parts: Part[]
  
  // 发货信息
  courierCompany: string
  trackingNumber: string
  shippedAt?: Date
  estimatedDelivery?: Date
  shippingCost?: number
  
  // 收货信息
  receivedAt?: Date
  receivedBy?: string
  
  // 旧件回收
  returnRequired: boolean
  returnTrackingNumber?: string
  returnShippedAt?: Date
  returnReceivedAt?: Date
  
  // 状态
  status: 'preparing' | 'shipped' | 'delivered' | 'completed'
}

/**
 * 远程指导
 */
export interface RemoteSupport {
  // 指导方式
  supportType: 'phone' | 'video' | 'chat' | 'screen_share'
  
  // 指导记录
  sessions: RemoteSession[]
  
  // 指导结果
  resolved: boolean
  resolutionNotes?: string
  
  // 客户反馈
  customerSatisfaction?: number
}

/**
 * 远程指导会话
 */
export interface RemoteSession {
  id: string
  startTime: Date
  endTime: Date
  method: string
  notes: string
  screenshots?: string[]
  recording?: string
  engineerId: string
  engineerName: string
}

/**
 * 工单日志
 */
export interface TicketLog {
  id: string
  ticketId: string
  type: 'system' | 'user' | 'customer' | 'error'
  action: string
  userId?: string
  userName?: string
  userType?: 'customer_service' | 'supervisor' | 'engineer' | 'customer' | 'warehouse'
  oldValue?: any
  newValue?: any
  message: string
  timestamp: Date
}

/**
 * 工单统计
 */
export interface TicketStatistics {
  totalTickets: number
  ticketsByStatus: Record<TicketStatus, number>
  ticketsByType: Record<TicketType, number>
  ticketsByServiceType: Record<ServiceType, number>
  ticketsByPriority: Record<TicketPriority, number>
  
  avgResponseTime: number
  avgCompletionTime: number
  avgResolutionTime: number
  
  onsiteServiceCount: number
  mailServiceCount: number
  remoteSupportCount: number
  
  totalRevenue: number
  avgTicketValue: number
  
  customerSatisfactionRate: number
  firstTimeResolutionRate: number
  slaComplianceRate: number
}

/**
 * 工程师工作量
 */
export interface EngineerWorkload {
  engineerId: string
  engineerName: string
  totalTickets: number
  completedTickets: number
  pendingTickets: number
  avgCompletionTime: number
  customerSatisfactionRate: number
  totalRevenue: number
  totalTravelDistance: number
}
