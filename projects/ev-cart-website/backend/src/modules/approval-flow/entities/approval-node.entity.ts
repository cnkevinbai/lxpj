/**
 * 审批节点实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm'
import { ApprovalFlow } from './approval-flow.entity'

export type NodeType =
  | 'start'         // 开始节点
  | 'approver'      // 审批人
  | 'cc'            // 抄送人
  | 'condition'     // 条件分支
  | 'end'           // 结束节点

export type ApproverType =
  | 'user'          // 指定用户
  | 'role'          // 指定角色
  | 'department'    // 指定部门
  | 'manager'       // 直属上级
  | 'dynamic'       // 动态审批人

@Entity('approval_nodes')
export class ApprovalNode {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 50 })
  type: NodeType

  @Column({ type: 'integer' })
  @Index()
  order: number

  @Column({ type: 'uuid' })
  @Index()
  flowId: string

  @ManyToOne(() => ApprovalFlow, flow => flow.nodes, { onDelete: 'CASCADE' })
  flow: ApprovalFlow

  @Column({ type: 'varchar', length: 50, nullable: true })
  approverType?: ApproverType

  @Column({ type: 'jsonb', nullable: true })
  approvers?: string[]  // 审批人 ID 列表 (用户/角色/部门 ID)

  @Column({ type: 'boolean', default: false })
  allowEmpty: boolean  // 允许为空

  @Column({ type: 'boolean', default: false })
  multiMode: boolean  // 多人审批模式

  @Column({ type: 'varchar', length: 20, default: 'or' })
  approveMode: 'or' | 'and'  // 或签/会签

  @Column({ type: 'integer', default: 0 })
  timeoutHours: number  // 审批超时 (小时)

  @Column({ type: 'text', nullable: true })
  remarks?: string

  @CreateDateColumn()
  createdAt: Date
}
