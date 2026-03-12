import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Resume } from './resume.entity'
import { Job } from './job.entity'

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  interviewCode: string

  @Column({ type: 'uuid', nullable: true })
  resumeId: string

  @ManyToOne(() => Resume, { eager: false })
  @JoinColumn({ name: 'resume_id' })
  resume: Resume

  @Column({ type: 'uuid', nullable: true })
  jobId: string

  @ManyToOne(() => Job, { eager: false })
  @JoinColumn({ name: 'job_id' })
  job: Job

  @Column({ length: 100 })
  candidateName: string

  @Column({ length: 20, nullable: true })
  candidatePhone: string

  @Column({ length: 255, nullable: true })
  candidateEmail: string

  @Column({ length: 50 })
  interviewType: string

  @Column()
  scheduledAt: Date

  @Column({ default: 60 })
  duration: number

  @Column({ length: 100 })
  interviewer: string

  @Column({ length: 255, nullable: true })
  interviewerEmail: string

  @Column({ length: 255, nullable: true })
  location: string

  @Column({ type: 'text', nullable: true })
  meetingLink: string

  @Column({ default: 'scheduled' })
  status: string

  @Column({ type: 'text', nullable: true })
  feedback: string

  @Column({ nullable: true })
  rating: number

  @Column({ length: 20, nullable: true })
  result: string

  @Column({ type: 'uuid', nullable: true })
  createdBy: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
