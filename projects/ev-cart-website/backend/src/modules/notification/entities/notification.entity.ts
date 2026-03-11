import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'

/**
 * 通知实体
 * 支持站内消息、钉钉、企业微信、邮件、短信
 */
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ length: 100 })
  userId: string

  @Column({ length: 50 })
  type: string //站内消息，dingtalk, wecom, email, sms

  @Column({ length: 200 })
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ length: 50, default: 'unread' })
  status: string // unread, read, archived

  @Column({ nullable: true })
  link: string // 点击跳转链接

  @Column({ nullable: true })
  readAt: Date

  @CreateDateColumn()
  createdAt: Date
}
