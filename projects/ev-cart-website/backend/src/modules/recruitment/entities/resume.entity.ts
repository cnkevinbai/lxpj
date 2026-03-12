import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Job } from './job.entity'
import { Interview } from './interview.entity'

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  resumeCode: string

  @Column({ length: 100 })
  candidateName: string

  @Column({ length: 20 })
  phone: string

  @Column({ length: 255 })
  email: string

  @Column({ length: 50, nullable: true })
  education: string

  @Column({ length: 100, nullable: true })
  major: string

  @Column({ length: 50, nullable: true })
  experience: string

  @Column({ length: 200, nullable: true })
  currentCompany: string

  @Column({ length: 200, nullable: true })
  position: string

  @Column({ length: 50, nullable: true })
  expectedSalary: string

  @Column({ type: 'uuid', nullable: true })
  jobId: string

  @ManyToOne(() => Job, { eager: false })
  @JoinColumn({ name: 'job_id' })
  job: Job

  @Column({ default: 'new' })
  status: string

  @Column({ default: 'website' })
  source: string

  @Column({ type: 'text', nullable: true })
  resumeUrl: string

  @Column({ type: 'text', nullable: true })
  resumeContent: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date

  @OneToMany(() => Interview, (interview) => interview.resume)
  interviews: Interview[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
