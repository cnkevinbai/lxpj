import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { User } from '../user/entities/user.entity'

/**
 * 离职交接单
 */
@Entity('user_handovers')
export class UserHandover {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /**
   * 离职人 ID
   */
  @Column({ type: 'uuid' })
  @Index()
  leavingUserId: string

  @Column({ type: 'varchar', length: 100 })
  leavingUserName: string

  /**
   * 接收人 ID
   */
  @Column({ type: 'uuid' })
  @Index()
  receiverUserId: string

  @Column({ type: 'varchar', length: 100 })
  receiverUserName: string

  /**
   * 交接类型
   */
  @Column({ type: 'varchar', length: 50 })
  handoverType: 'resignation' | 'transfer' | 'temporary' // 离职/调岗/临时

  /**
   * 交接状态
   */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  @Index()
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'

  /**
   * 客户资源数量
   */
  @Column({ type: 'int', default: 0 })
  customerCount: number

  /**
   * 线索数量
   */
  @Column({ type: 'int', default: 0 })
  leadCount: number

  /**
   * 商机数量
   */
  @Column({ type: 'int', default: 0 })
  opportunityCount: number

  /**
   * 订单数量
   */
  @Column({ type: 'int', default: 0 })
  orderCount: number

  /**
   * 待办事项数量
   */
  @Column({ type: 'int', default: 0 })
  todoCount: number

  /**
   * 交接说明
   */
  @Column({ type: 'text', nullable: true })
  description?: string

  /**
   * 交接清单 (JSON)
   */
  @Column({ type: 'jsonb', nullable: true })
  handoverList?: Record<string, any>

  /**
   * 审批人 ID
   */
  @Column({ type: 'uuid', nullable: true })
  approverId?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  approverName?: string

  /**
   * 审批时间
   */
  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date

  /**
   * 完成时间
   */
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  /**
   * 取消原因
   */
  @Column({ type: 'text', nullable: true })
  cancelReason?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

/**
 * 交接清单项
 */
@Entity('handover_items')
export class HandoverItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  @Index()
  handoverId: string

  /**
   * 交接类型
   */
  @Column({ type: 'varchar', length: 50 })
  itemType: 'customer' | 'lead' | 'opportunity' | 'order' | 'document' | 'other'

  /**
   * 关联 ID
   */
  @Column({ type: 'uuid' })
  @Index()
  itemId: string

  /**
   * 名称/描述
   */
  @Column({ type: 'varchar', length: 200 })
  itemName: string

  /**
   * 状态
   */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'transferred' | 'skipped'

  /**
   * 备注
   */
  @Column({ type: 'text', nullable: true })
  remark?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
