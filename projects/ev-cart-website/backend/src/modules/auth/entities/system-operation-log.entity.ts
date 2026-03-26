import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * SystemOperationLog 实体
 */
@Entity('system-operation-logs')
export class SystemOperationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
