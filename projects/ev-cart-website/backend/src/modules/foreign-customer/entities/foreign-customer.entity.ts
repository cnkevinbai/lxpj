import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'

/**
 * 外贸客户实体
 * 支持多语言、多时区、多通讯工具、国际贸易
 */
@Entity('foreign_customers')
export class ForeignCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  name: string // 客户名称

  @Column({ length: 200, nullable: true })
  companyName: string // 公司名称

  @Column({ length: 100 })
  country: string // 国家

  @Column({ length: 100, nullable: true })
  region: string // 地区/州

  @Column({ length: 50, nullable: true })
  city: string // 城市

  @Column({ type: 'text', nullable: true })
  address: string // 详细地址

  @Column({ length: 50, nullable: true })
  timezone: string // 时区

  @Column({ length: 50, nullable: true })
  language: string // 语言偏好

  // 通讯方式
  @Column({ length: 100, nullable: true })
  whatsapp?: string

  @Column({ length: 100, nullable: true })
  wechat?: string

  @Column({ length: 100, nullable: true })
  skype?: string

  @Column({ length: 100, nullable: true })
  telegram?: string

  @Column({ length: 100, nullable: true })
  email: string

  @Column({ length: 50, nullable: true })
  phone?: string

  @Column({ length: 200, nullable: true })
  website?: string

  // 业务信息
  @Column({ length: 50, nullable: true })
  customerType: string // Distributor, Importer, Retailer, End User

  @Column({ length: 50, nullable: true })
  industry: string // 行业

  @Column({ type: 'text', nullable: true })
  mainProducts: string // 主营产品

  @Column({ length: 50, nullable: true })
  currency: string // 货币偏好

  @Column({ length: 50, nullable: true })
  paymentTerm: string // 付款方式：T/T, L/C, Western Union, PayPal

  @Column({ length: 50, nullable: true })
  tradeTerm: string // 贸易术语：FOB, CIF, EXW, DDP

  @Column({ length: 50, nullable: true })
  shippingPort: string // 目的港口

  // 客户等级
  @Column({ length: 10, default: 'C' })
  level: string // A/B/C

  @Column({ length: 50, default: 'potential' })
  status: string // potential, active, inactive, lost

  // 业务员绑定
  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @Column({ length: 100, nullable: true })
  ownerId: string

  // 统计信息
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalOrders: number // 总订单数

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number // 总金额

  @Column({ nullable: true })
  lastOrderDate?: Date // 最后订单日期

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
