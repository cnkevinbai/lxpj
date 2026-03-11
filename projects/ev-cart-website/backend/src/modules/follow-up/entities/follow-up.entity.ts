import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Lead } from '../../lead/entities/lead.entity'
import { Customer } from '../../customer/entities/customer.entity'
import { User } from '../../user/entities/user.entity'

/**
 * 跟进记录实体
 * 记录业务员对线索/客户的每次跟进
 */
@Entity('follow_up_logs')
export class FollowUpLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  targetType: string // 'lead' or 'customer'

  @Column({ length: 100 })
  targetId: string // 线索 ID 或客户 ID

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ length: 100 })
  userId: string

  @Column({ length: 50 })
  followType: string // 'phone' | 'visit' | 'wechat' | 'email' | 'other'

  @Column({ type: 'text' })
  content: string // 跟进内容

  @Column({ length: 50, nullable: true })
  nextFollowupDate?: string // 下次跟进日期

  @Column({ type: 'text', nullable: true })
  nextFollowupPlan?: string // 下次跟进计划

  @Column({ default: 'pending' })
  status: string // 'pending' | 'completed' | 'cancelled'

  @Column({ nullable: true })
  completedAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
