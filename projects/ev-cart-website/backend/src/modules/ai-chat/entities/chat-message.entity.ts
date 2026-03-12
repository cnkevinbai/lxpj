import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

/**
 * 聊天消息实体
 * 记录所有 AI 客服对话历史
 */
@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  userId: string

  @Column({ length: 10 })
  sender: string // 'user' or 'bot'

  @Column({ type: 'text' })
  content: string

  @Column({ nullable: true })
  rating: number // 满意度评分 (1-5)

  @CreateDateColumn()
  createdAt: Date
}
