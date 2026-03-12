/**
 * 服务投诉实体
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

export type ComplaintType =
  | 'quality'        // 产品质量
  | 'attitude'       // 服务态度
  | 'timeliness'     // 服务时效
  | 'charge'         // 收费问题
  | 'other'          // 其他

export type ComplaintStatus =
  | 'pending'        // 待处理
  | 'processing'     // 处理中
  | 'resolved'       // 已解决
  | 'closed'         // 已关闭

@Entity('service_complaints')
export class ServiceComplaint {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 30, unique: true })
  @Index()
  complaintNo: string

  @Column({ type: 'varchar', length: 30 })
  type: ComplaintType

  @Column({ type: 'varchar', length: 30 })
  status: ComplaintStatus

  @Column({ type: 'uuid' })
  @Index()
  customerId: string

  @Column({ type: 'varchar', length: 100 })
  customerName: string

  @Column({ type: 'varchar', length: 20 })
  customerPhone: string

  @Column({ type: 'uuid', nullable: true })
  ticketId?: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'text', nullable: true })
  solution?: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  images?: string

  @Column({ type: 'integer', nullable: true })
  satisfaction?: number

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
