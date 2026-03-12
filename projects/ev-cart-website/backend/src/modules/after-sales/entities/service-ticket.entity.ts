/**
 * 服务工单实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

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

@Entity('service_tickets')
export class ServiceTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 30, unique: true })
  @Index()
  ticketNo: string

  @Column({ type: 'varchar', length: 30 })
  @Index()
  type: TicketType

  @Column({ type: 'varchar', length: 30 })
  @Index()
  status: TicketStatus

  @Column({ type: 'varchar', length: 20 })
  priority: Priority

  @Column({ type: 'uuid' })
  @Index()
  customerId: string

  @Column({ type: 'varchar', length: 100 })
  customerName: string

  @Column({ type: 'varchar', length: 20 })
  customerPhone: string

  @Column({ type: 'uuid', nullable: true })
  orderId?: string

  @Column({ type: 'uuid', nullable: true })
  productId?: string

  @Column({ type: 'varchar', length: 200 })
  productName: string

  @Column({ type: 'text' })
  problemDescription: string

  @Column({ type: 'text', nullable: true })
  images?: string  // JSON 数组，图片 URL

  @Column({ type: 'varchar', length: 300 })
  serviceAddress: string

  @Column({ type: 'varchar', length: 100 })
  contactPerson: string

  @Column({ type: 'varchar', length: 20 })
  contactPhone: string

  @Column({ type: 'timestamp', nullable: true })
  appointmentTime?: Date

  @Column({ type: 'uuid', nullable: true })
  @Index()
  technicianId?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  technicianName?: string

  @Column({ type: 'text', nullable: true })
  solution?: string

  @Column({ type: 'jsonb', nullable: true })
  parts?: ServicePart[]  // 使用的备件

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  partsFee: number

  @Column({ type: 'boolean', default: false })
  isWarranty: boolean  // 是否保修

  @Column({ type: 'integer', nullable: true })
  satisfaction?: number  // 满意度 1-5

  @Column({ type: 'text', nullable: true })
  comment?: string  // 客户评价

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export interface ServicePart {
  partId: string
  partName: string
  quantity: number
  unitPrice: number
  amount: number
}
