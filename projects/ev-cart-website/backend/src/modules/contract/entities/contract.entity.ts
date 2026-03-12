/**
 * 合同实体 - 支持电子化
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm'

export type ContractType =
  | 'sales'          // 销售合同
  | 'purchase'       // 采购合同
  | 'service'        // 服务合同
  | 'employment'     // 劳动合同
  | 'partnership'    // 合作协议
  | 'other'          // 其他

export type ContractStatus =
  | 'draft'          // 草稿
  | 'pending'        // 待审批
  | 'approving'      // 审批中
  | 'approved'       // 已批准
  | 'rejected'       // 已拒绝
  | 'signing'        // 签署中
  | 'signed'         // 已签署
  | 'effective'      // 生效中
  | 'expired'        // 已过期
  | 'terminated'     // 已终止
  | 'archived'       // 已归档

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  contractNo: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  type: ContractType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: ContractStatus

  @Column({ type: 'varchar', length: 200 })
  title: string

  @Column({ type: 'uuid' })
  @Index()
  customerId: string

  @Column({ type: 'varchar', length: 100 })
  customerName: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.13 })
  taxRate: number

  @Column({ type: 'date' })
  @Index()
  startDate: Date

  @Column({ type: 'date' })
  @Index()
  endDate: Date

  @Column({ type: 'text' })
  content: string  // 合同内容 (HTML/Markdown)

  @Column({ type: 'uuid', nullable: true })
  templateId?: string

  @Column({ type: 'jsonb', nullable: true })
  terms?: Record<string, any>  // 合同条款

  @Column({ type: 'jsonb', nullable: true })
  parties?: ContractParty[]  // 合同双方

  @Column({ type: 'jsonb', nullable: true })
  signatures?: ContractSignature[]  // 签署信息

  @Column({ type: 'uuid', nullable: true })
  @Index()
  orderId?: string

  @Column({ type: 'uuid', nullable: true })
  parentContractId?: string  // 父合同 (变更合同)

  @Column({ type: 'integer', default: 1 })
  version: number

  @Column({ type: 'varchar', length: 100 })
  @Index()
  ownerId: string

  @Column({ type: 'varchar', length: 100 })
  ownerName: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  filePath?: string  // 合同文件路径

  @Column({ type: 'varchar', length: 500, nullable: true })
  sealedFilePath?: string  // 已签署合同文件路径

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  signedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  effectiveAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  archivedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  remindAt?: Date  // 提醒时间

  @Column({ type: 'text', nullable: true })
  remarks?: string

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export interface ContractParty {
  type: 'party_a' | 'party_b'  // 甲方/乙方
  name: string
  representative: string
  address: string
  contact: string
  phone: string
  email: string
}

export interface ContractSignature {
  party: 'party_a' | 'party_b'
  signerName: string
  signerTitle: string
  signedAt: string
  signatureImage?: string  // 签名图片 URL
  sealImage?: string  // 印章图片 URL
  esignId?: string  // 电子签名 ID
  verified: boolean  // 是否验证
}
