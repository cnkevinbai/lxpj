import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ length: 100 })
  department: string

  @Column({ length: 100 })
  location: string

  @Column({ default: 'full_time' })
  type: string

  @Column({ length: 50, nullable: true })
  level: string

  @Column({ length: 50, nullable: true })
  salaryRange: string

  @Column({ type: 'text' })
  description: string

  @Column('jsonb')
  requirements: string[]

  @Column('jsonb', { default: [] })
  benefits: string[]

  @Column({ default: 'active' })
  status: string

  @Column({ nullable: true })
  applyDeadline: Date

  @Column({ default: 0 })
  viewCount: number

  @Column({ default: 0 })
  applyCount: number

  @Column({ nullable: true })
  createdById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
