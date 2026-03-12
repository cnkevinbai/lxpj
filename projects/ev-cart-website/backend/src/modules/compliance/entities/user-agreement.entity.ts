import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 用户协议实体
 */
@Entity('user_agreements')
export class UserAgreement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ length: 50 })
  version: string

  @Column({ default: false })
  isCurrent: boolean

  @Column({ nullable: true })
  effectiveDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
