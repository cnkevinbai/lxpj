import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'

/**
 * 数据处理日志实体
 * 记录所有个人数据处理操作，满足 GDPR/个人信息保护法要求
 */
@Entity('data_processing_logs')
export class DataProcessingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ length: 100 })
  userId: string

  @Column({ length: 100 })
  actionType: string // view, create, update, delete, export

  @Column({ length: 200 })
  resourceType: string // lead, customer, order, etc.

  @Column({ length: 100 })
  resourceId: string

  @Column({ type: 'text', nullable: true })
  changes: string // JSON 格式记录变更内容

  @Column({ length: 50 })
  ipAddress: string

  @Column({ length: 500, nullable: true })
  userAgent: string

  @Column({ default: 'success' })
  status: string // success, failed

  @CreateDateColumn()
  createdAt: Date
}
