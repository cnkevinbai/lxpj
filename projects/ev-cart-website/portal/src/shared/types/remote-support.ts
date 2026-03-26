// 远程指导类型定义

export type RemoteSupportStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type MessageType = 'text' | 'image' | 'file' | 'voice'
export type MessageSender = 'engineer' | 'customer'

/**
 * 远程指导会话
 */
export interface RemoteSupport {
  id: string
  ticketId: string
  engineerId: string
  engineerName: string
  engineerPhone: string
  customerId: string
  customerName: string
  customerPhone: string
  
  // 状态
  status: RemoteSupportStatus
  startedAt: Date
  completedAt?: Date
  
  // 解决情况
  resolved?: boolean
  resolutionNotes?: string
  
  // 服务时长（分钟）
  duration?: number
  
  // 客户满意度
  customerSatisfaction?: number
  serviceAttitudeRating?: number
  technicalSkillRating?: number
  responseSpeedRating?: number
  ratingComment?: string
  
  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * 远程消息
 */
export interface RemoteMessage {
  id: string
  supportId: string
  ticketId: string
  senderId: string
  senderName: string
  senderType: MessageSender
  type: MessageType
  content: string  // 文字内容或文件 URL
  fileSize?: number
  fileName?: string
  
  // 阅读状态
  read: boolean
  readAt?: Date
  
  // 时间戳
  createdAt: Date
}

/**
 * 电话记录
 */
export interface PhoneCall {
  id: string
  ticketId: string
  supportId?: string
  engineerId: string
  engineerName: string
  customerPhone: string
  
  // 通话时间
  startTime: Date
  endTime?: Date
  duration?: number  // 秒
  
  // 通话记录
  notes: string
  
  // 录音（可选）
  recordingUrl?: string
  recordingDuration?: number
  
  // 时间戳
  createdAt: Date
}

/**
 * 远程指导完成报告
 */
export interface RemoteCompletionReport {
  supportId: string
  ticketId: string
  
  // 解决情况
  resolved: boolean
  resolutionNotes: string
  
  // 服务时长
  totalDuration: number  // 分钟
  phoneCallDuration: number  // 分钟
  messageCount: number
  
  // 使用配件（可选）
  partsUsed?: {
    partId: string
    partName: string
    quantity: number
  }[]
  
  // 客户满意度
  customerSatisfaction: number  // 1-5 星
  serviceAttitudeRating?: number
  technicalSkillRating?: number
  responseSpeedRating?: number
  ratingComment?: string
  ratingTags?: string[]
  
  // 费用（可选）
  serviceFee?: number
  partsFee?: number
  totalFee?: number
  
  // 完成时间
  completedAt: Date
}

/**
 * 远程指导统计
 */
export interface RemoteSupportStatistics {
  totalSessions: number
  completedSessions: number
  resolvedSessions: number
  resolutionRate: number  // 解决率
  
  avgDuration: number  // 平均时长（分钟）
  avgSatisfaction: number  // 平均满意度
  
  phoneCallCount: number
  messageCount: number
  
  byType: {
    text: number
    image: number
    file: number
    voice: number
  }
  
  byEngineer: Array<{
    engineerId: string
    engineerName: string
    sessionCount: number
    resolutionRate: number
    avgSatisfaction: number
  }>
}
