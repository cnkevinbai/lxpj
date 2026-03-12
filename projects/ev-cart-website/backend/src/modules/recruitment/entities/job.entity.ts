import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Resume } from './resume.entity'

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  jobCode: string

  @Column({ length: 200 })
  title: string

  @Column({ length: 100 })
  department: string

  @Column({ length: 100 })
  location: string

  @Column({ length: 50 })
  jobType: string

  @Column({ length: 50 })
  experience: string

  @Column({ length: 50 })
  education: string

  @Column('decimal', { precision: 12, scale: 2 })
  salaryMin: number

  @Column('decimal', { precision: 12, scale: 2 })
  salaryMax: number

  @Column({ default: 1 })
  headcount: number

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true })
  requirements: string

  @Column({ type: 'text', nullable: true })
  benefits: string

  @Column({ default: 'draft' })
  status: string

  @Column({ nullable: true })
  publishedAt: Date

  @Column({ type: 'uuid', nullable: true })
  createdBy: string

  @Column({ length: 100, nullable: true })
  createdByName: string

  @OneToMany(() => Resume, (resume) => resume.job)
  resumes: Resume[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
