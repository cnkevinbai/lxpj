import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 隐私政策实体
 */
@Entity('privacy_policies')
export class PrivacyPolicy {
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
