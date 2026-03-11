import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { ForeignCustomer } from '../foreign-customer/entities/foreign-customer.entity'

/**
 * 外贸订单实体
 * 支持国际贸易流程
 */
@Entity('foreign_orders')
export class ForeignOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100, unique: true })
  orderNo: string // 订单编号

  @Column({ length: 100, nullable: true })
  proformaInvoiceNo: string // PI 编号

  @Column({ length: 100, nullable: true })
  commercialInvoiceNo: string // CI 编号

  @ManyToOne(() => ForeignCustomer)
  @JoinColumn({ name: 'customer_id' })
  customer: ForeignCustomer

  @Column({ length: 100 })
  customerId: string

  @Column({ type: 'text' })
  products: string // 产品详情 (JSON)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number // 数量

  @Column({ length: 50 })
  unit: string // 单位

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number // 单价

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number // 总金额

  @Column({ length: 50 })
  currency: string // 货币：USD, EUR, GBP

  @Column({ length: 50 })
  tradeTerm: string // 贸易术语：FOB, CIF, EXW

  @Column({ length: 100, nullable: true })
  loadingPort: string // 装运港

  @Column({ length: 100, nullable: true })
  destinationPort: string // 目的港

  @Column({ length: 50, nullable: true })
  paymentTerm: string // 付款方式：T/T, L/C

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  depositRate?: number // 定金比例

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  depositAmount?: number // 定金金额

  @Column({ nullable: true })
  deliveryDate?: Date // 交货期

  @Column({ length: 50, default: 'pending' })
  status: string // pending, deposit_paid, production, ready, shipped, completed

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number // 已付金额

  @Column({ nullable: true })
  shippedAt?: Date // 发货时间

  @Column({ length: 100, nullable: true })
  trackingNo?: string // 物流单号

  @Column({ type: 'text', nullable: true })
  shippingDocs: string // 货运单据 (JSON)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @Column({ length: 100, nullable: true })
  ownerId: string

  @Column({ type: 'text', nullable: true })
  remarks: string // 备注

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
