import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'

/**
 * 外贸线索实体
 * 支持多语言、多时区、多通讯工具
 */
@Entity('foreign_leads')
export class ForeignLead {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 100, nullable: true })
  companyName: string

  @Column({ length: 100, nullable: true })
  country: string // 国家

  @Column({ length: 100, nullable: true })
  region: string // 地区/州

  @Column({ length: 50, nullable: true })
  timezone: string // 时区

  @Column({ length: 50, nullable: true })
  language: string // 语言偏好

  @Column({ length: 100, nullable: true })
  whatsapp?: string // WhatsApp

  @Column({ length: 100, nullable: true })
  wechat?: string // 微信

  @Column({ length: 100, nullable: true })
  skype?: string // Skype

  @Column({ length: 100, nullable: true })
  email: string

  @Column({ length: 50, nullable: true })
  source: string // 来源：Alibaba, GlobalSources, Made-in-China, Google, Exhibition 等

  @Column({ type: 'text', nullable: true })
  productInterest: string // 意向产品

  @Column({ length: 50, nullable: true })
  inquiryType: string // 询盘类型：RFQ, Sample, Bulk Order

  @Column({ type: 'text', nullable: true })
  requirements: string // 详细需求

  @Column({ length: 50, nullable: true })
  currency: string // 货币偏好：USD, EUR, GBP 等

  @Column({ length: 50, nullable: true })
  tradeTerm: string // 贸易术语：FOB, CIF, EXW 等

  @Column({ length: 100, nullable: true })
  status: string // new, contacted, qualified, quoted, negotiated, won, lost

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedValue?: number // 预估金额

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @Column({ length: 100, nullable: true })
  ownerId: string

  @Column({ default: 'domestic' })
  businessType: string // 'domestic' or 'foreign'

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
