import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Job } from './job.entity'

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Job, { eager: true })
  @JoinColumn({ name: 'job_id' })
  job: Job

  @Column({ length: 100 })
  jobId: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 20 })
  phone: string

  @Column({ length: 255 })
  email: string

  @Column({ length: 500, nullable: true })
  resumeUrl: string

  @Column({ length: 50, nullable: true })
  education: string

  @Column({ length: 100, nullable: true })
  major: string

  @Column({ nullable: true })
  experienceYears: number

  @Column({ length: 200, nullable: true })
  currentCompany: string

  @Column({ length: 50, nullable: true })
  expectedSalary: string

  @Column({ type: 'text', nullable: true })
  message: string

  @Column({ default: 'new' })
  status: string

  @Column({ nullable: true })
  reviewerId: string

  @Column({ type: 'text', nullable: true })
  reviewComment: string

  @Column({ nullable: true })
  interviewDate: Date

  @Column({ nullable: true })
  interviewedBy: string

  @Column({ nullable: true })
  hiredAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
