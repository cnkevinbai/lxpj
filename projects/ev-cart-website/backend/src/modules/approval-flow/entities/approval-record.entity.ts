/**
 * 审批记录实体 - 记录每次审批实例
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

export type ApprovalStatus =
  | 'pending'       // 待审批
  | 'approving'     // 审批中
  | 'approved'      // 已通过
  | 'rejected'      // 已拒绝
  | 'cancelled'     // 已撤销
  | 'expired'       // 已超时

@Entity('approval_records')
export class ApprovalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  flowId: string

  @Column({ type: 'varchar', length: 100 })
  flowName: string

  @Column({ type: 'varchar', length: 50 })
  entityType: string  // 关联实体类型 (contract/order 等)

  @Column({ type: 'uuid' })
  @Index()
  entityId: string  // 关联实体 ID

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: ApprovalStatus

  @Column({ type: 'varchar', length: 50, default: 'internal' })
  platform: 'internal' | 'dingtalk' | 'wechat'

  @Column({ type: 'varchar', length: 100, nullable: true })
  thirdPartyInstanceId?: string  // 第三方审批实例 ID

  @Column({ type: 'uuid' })
  @Index()
  applicantId: string

  @Column({ type: 'varchar', length: 100 })
  applicantName: string

  @Column({ type: 'uuid', nullable: true })
  currentApproverId?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  currentApproverName?: string

  @Column({ type: 'integer', default: 0 })
  currentNodeIndex: number  // 当前节点索引

  @Column({ type: 'jsonb', nullable: true })
  formData: Record<string, any>  // 审批表单数据

  @Column({ type: 'text', nullable: true })
  remarks?: string

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  expiredAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
