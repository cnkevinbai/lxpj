/**
 * 售后服务类型定义
 * 渔晓白 ⚙️ · 专业交付
 */

export type TicketType =
  | 'installation'   // 安装
  | 'repair'         // 维修
  | 'maintenance'    // 保养
  | 'return'         // 退换货
  | 'consultation'   // 咨询
  | 'complaint'      // 投诉

export type TicketStatus =
  | 'pending'        // 待受理
  | 'accepted'       // 已受理
  | 'assigned'       // 已分配
  | 'processing'     // 处理中
  | 'waiting_confirm'// 待确认
  | 'completed'      // 已完成
  | 'closed'         // 已关闭
  | 'cancelled'      // 已取消

export type Priority =
  | 'normal'         // 普通
  | 'urgent'         // 紧急
  | 'critical'       // 特急

export interface ServiceTicket {
  id: string
  ticketNo: string
  type: TicketType
  status: TicketStatus
  priority: Priority
  customerId: string
  customerName: string
  customerPhone: string
  orderId?: string
  productId?: string
  productName: string
  problemDescription: string
  images?: string[]
  serviceAddress: string
  contactPerson: string
  contactPhone: string
  appointmentTime?: string
  technicianId?: string
  technicianName?: string
  solution?: string
  parts?: ServicePart[]
  serviceFee?: number
  partsFee?: number
  isWarranty?: boolean
  satisfaction?: number
  comment?: string
  createdAt: string
  acceptedAt?: string
  assignedAt?: string
  completedAt?: string
  closedAt?: string
}

export interface ServicePart {
  partId: string
  partName: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface ServiceComplaint {
  id: string
  complaintNo: string
  type: string
  status: string
  customerId: string
  customerName: string
  customerPhone: string
  ticketId?: string
  content: string
  solution?: string
  images?: string[]
  satisfaction?: number
  createdAt: string
  resolvedAt?: string
}

export interface ServiceCenter {
  id: string
  name: string
  type: 'self' | 'authorized'
  province: string
  city: string
  address: string
  phone: string
  manager: string
  managerPhone: string
  serviceScope?: string[]
  workingHours: string
  longitude: number
  latitude: number
  technicianCount: number
  isActive: boolean
}

export interface ServiceContract {
  id: string
  contractNo: string
  type: 'warranty' | 'extended' | 'maintenance' | 'full'
  status: 'active' | 'expiring' | 'expired' | 'terminated'
  customerId: string
  customerName: string
  productId?: string
  productName: string
  startDate: string
  endDate: string
  serviceDays: number
  contractAmount: number
  serviceContent?: string
  terms?: string
  createdAt: string
}
