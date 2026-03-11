import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { ForeignCustomer } from '../foreign-customer/entities/foreign-customer.entity'

/**
 * 外贸询盘实体
 * 管理外贸客户的询盘信息
 */
@Entity('foreign_inquiries')
export class ForeignInquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  inquiryNo: string // 询盘编号

  @ManyToOne(() => ForeignCustomer)
  @JoinColumn({ name: 'customer_id' })
  customer: ForeignCustomer

  @Column({ length: 100 })
  customerId: string

  @Column({ type: 'text' })
  subject: string // 询盘主题

  @Column({ type: 'text' })
  content: string // 询盘内容

  @Column({ type: 'text', nullable: true })
  products: string // 产品详情 (JSON)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantity?: number // 数量

  @Column({ length: 50, nullable: true })
  unit?: string // 单位

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  targetPrice?: number // 目标价格

  @Column({ length: 50, nullable: true })
  currency: string // 货币

  @Column({ length: 50, nullable: true })
  tradeTerm: string // 贸易术语

  @Column({ length: 100, nullable: true })
  destinationPort: string // 目的港

  @Column({ type: 'text', nullable: true })
  requirements: string // 特殊要求

  @Column({ length: 50, nullable: true })
  source: string // 来源：Alibaba, GlobalSources, Website, Email

  @Column({ length: 50, default: 'new' })
  status: string // new, reading, quoted, negotiated, won, lost

  @Column({ nullable: true })
  quotedAt?: Date // 报价时间

  @Column({ nullable: true })
  wonAt?: Date // 成交时间

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  finalAmount?: number // 最终金额

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
