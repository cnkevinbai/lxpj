/**
 * 合规性检查记录实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

export type ComplianceType =
  | 'financial'      // 财务合规
  | 'contract'       // 合同合规
  | 'data_privacy'   // 数据隐私
  | 'tax'            // 税务合规
  | 'audit'          // 审计要求

export type ComplianceStatus =
  | 'pending'
  | 'passed'
  | 'failed'
  | 'warning'

@Entity('compliance_checks')
export class ComplianceCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  type: ComplianceType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: ComplianceStatus

  @Column({ type: 'varchar', length: 100 })
  entityType: string

  @Column({ type: 'uuid' })
  @Index()
  entityId: string

  @Column({ type: 'jsonb' })
  checks: ComplianceItem[]

  @Column({ type: 'text', nullable: true })
  remarks?: string

  @Column({ type: 'varchar', length: 100 })
  checkedBy: string

  @CreateDateColumn()
  @Index()
  checkedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  nextReviewAt?: Date
}

export interface ComplianceItem {
  item: string           // 检查项
  passed: boolean        // 是否通过
  severity: 'high' | 'medium' | 'low'  // 严重程度
  description: string    // 描述
  suggestion?: string    // 建议
}
