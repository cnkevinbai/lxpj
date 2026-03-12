import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

/**
 * 公海池客户
 */
@Entity('customer_pools')
export class CustomerPool {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  @Index()
  customerId: string

  @Column({ type: 'varchar', length: 200 })
  customerName: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string // 客户来源

  @Column({ type: 'varchar', length: 50, nullable: true })
  level?: string // 客户等级

  @Column({ type: 'uuid', nullable: true })
  @Index()
  previousOwnerId?: string // 上一个所有者

  @Column({ type: 'varchar', length: 100, nullable: true })
  previousOwnerName?: string

  @Column({ type: 'uuid', nullable: true })
  @Index()
  currentOwnerId?: string // 当前领取者

  @Column({ type: 'varchar', length: 100, nullable: true })
  currentOwnerName?: string

  @Column({ type: 'timestamp', nullable: true })
  claimedAt?: Date // 领取时间

  @Column({ type: 'timestamp', nullable: true })
  returnAt?: Date // 退回时间

  @Column({ type: 'int', default: 0 })
  claimCount: number // 被领取次数

  @Column({ type: 'text', nullable: true })
  returnReason?: string // 退回原因

  @Column({ type: 'varchar', length: 50, default: 'available' })
  @Index()
  status: 'available' | 'claimed' | 'locked' // 可用/已领取/锁定

  @Column({ type: 'timestamp', nullable: true })
  lockUntil?: Date // 锁定截止时间

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

/**
 * 公海池规则
 */
@Entity('pool_rules')
export class PoolRule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 })
  name: string // 规则名称

  @Column({ type: 'text', nullable: true })
  description?: string // 规则描述

  @Column({ type: 'varchar', length: 50 })
  ruleType: 'auto_return' | 'claim_limit' | 'distribution' // 自动退回/领取限制/分配规则

  @Column({ type: 'jsonb' })
  conditions: Record<string, any> // 规则条件

  /**
   * 自动退回条件示例：
   * {
   *   "noFollowUpDays": 15,        // 15 天无跟进
   *   "noProgressDays": 30,        // 30 天无进展
   *   "excludeLevels": ["VIP"]     // 排除 VIP 客户
   * }
   * 
   * 领取限制条件示例：
   * {
   *   "maxClaimPerDay": 10,        // 每日最多领取 10 个
   *   "maxClaimPerMonth": 100,     // 每月最多领取 100 个
   *   "minFollowUpRate": 0.8       // 最低跟进率 80%
   * }
   */

  @Column({ type: 'boolean', default: true })
  enabled: boolean

  @Column({ type: 'int', default: 0 })
  priority: number // 优先级（数字越大优先级越高）

  @Column({ type: 'uuid', nullable: true })
  @Index()
  applicableRoleId?: string // 适用角色 ID

  @Column({ type: 'varchar', length: 100, nullable: true })
  applicableRoleName?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
