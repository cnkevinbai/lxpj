import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm'

/**
 * 数据导出限制配置
 */
@Entity('export_limits')
@Unique(['userId', 'dataType'])
export class ExportLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  @Index()
  userId: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  dataType: 'customer' | 'lead' | 'opportunity' | 'order' | 'dealer' | 'all'

  /**
   * 每日导出次数限制
   */
  @Column({ type: 'int', default: 10 })
  dailyLimit: number

  /**
   * 单次导出最大记录数
   */
  @Column({ type: 'int', default: 1000 })
  singleLimit: number

  /**
   * 今日已导出次数
   */
  @Column({ type: 'int', default: 0 })
  todayCount: number

  /**
   * 今日导出总记录数
   */
  @Column({ type: 'int', default: 0 })
  todayRecordCount: number

  /**
   * 最后重置日期
   */
  @Column({ type: 'date', nullable: true })
  lastResetDate?: string

  /**
   * 是否需要审批
   */
  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean

  /**
   * 审批人 ID
   */
  @Column({ type: 'uuid', nullable: true })
  approverId?: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}

/**
 * 导出记录
 */
@Entity('export_records')
export class ExportRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  @Index()
  userId: string

  @Column({ type: 'varchar', length: 100 })
  userName: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  dataType: string

  @Column({ type: 'int' })
  recordCount: number

  @Column({ type: 'varchar', length: 20 })
  @Index()
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed'

  @Column({ type: 'text', nullable: true })
  reason?: string

  @Column({ type: 'uuid', nullable: true })
  approverId?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  approverName?: string

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date

  @Column({ type: 'text', nullable: true })
  rejectReason?: string

  @Column({ type: 'varchar', length: 45 })
  ip: string

  @Column({ type: 'text', nullable: true })
  userAgent?: string

  /**
   * 下载链接（过期自动失效）
   */
  @Column({ type: 'text', nullable: true })
  downloadUrl?: string

  /**
   * 下载过期时间
   */
  @Column({ type: 'timestamp', nullable: true })
  downloadExpiresAt?: Date

  /**
   * 下载次数
   */
  @Column({ type: 'int', default: 0 })
  downloadCount: number

  @CreateDateColumn()
  @Index()
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}
