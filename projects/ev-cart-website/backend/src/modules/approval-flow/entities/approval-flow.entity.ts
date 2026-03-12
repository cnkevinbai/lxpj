/**
 * 审批流程实体
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

export type FlowType =
  | 'contract'      // 合同审批
  | 'purchase'      // 采购审批
  | 'expense'       // 费用报销
  | 'leave'         // 请假审批
  | 'overtime'      // 加班审批
  | 'custom'        // 自定义

export type FlowStatus =
  | 'draft'         // 草稿
  | 'active'        // 启用
  | 'inactive'      // 停用

@Entity('approval_flows')
export class ApprovalFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 })
  @Index()
  name: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  type: FlowType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: FlowStatus

  @Column({ type: 'varchar', length: 50, default: 'internal' })
  platform: 'internal' | 'dingtalk' | 'wechat' | 'multi'

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'jsonb', nullable: true })
  conditions?: ApprovalCondition[]  // 审批条件

  @Column({ type: 'uuid' })
  createdBy: string

  @Column({ type: 'varchar', length: 100 })
  createdByName: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => ApprovalNode, node => node.flow, { cascade: true })
  nodes: ApprovalNode[]
}

export interface ApprovalCondition {
  field: string
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'contains'
  value: any
  platform?: 'internal' | 'dingtalk' | 'wechat'  // 指定平台
}
