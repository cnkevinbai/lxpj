/**
 * 自动排障记录实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

export type IssueType =
  | 'database_connection'
  | 'redis_connection'
  | 'api_timeout'
  | 'memory_leak'
  | 'disk_space'
  | 'service_down'
  | 'queue_backlog'
  | 'certificate_expiry'

export type HealingAction =
  | 'restart_service'
  | 'clear_cache'
  | 'scale_up'
  | 'failover'
  | 'cleanup'
  | 'notify'
  | 'rollback'

export type HealingStatus =
  | 'detected'
  | 'healing'
  | 'resolved'
  | 'escalated'
  | 'failed'

@Entity('healing_records')
export class HealingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  issueType: IssueType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: HealingStatus

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  affectedService?: string

  @Column({ type: 'jsonb', nullable: true })
  metrics?: Record<string, any>

  @Column({ type: 'varchar', length: 50, nullable: true })
  action?: HealingAction

  @Column({ type: 'text', nullable: true })
  actionResult?: string

  @Column({ type: 'integer', default: 0 })
  retryCount: number

  @CreateDateColumn()
  @Index()
  detectedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  healedAt?: Date

  @Column({ type: 'text', nullable: true })
  notes?: string
}
