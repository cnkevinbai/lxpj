import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * ServiceRequest 实体
 */
@Entity('service-requests')
export class ServiceRequest {
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
