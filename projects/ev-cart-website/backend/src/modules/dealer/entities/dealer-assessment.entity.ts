import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Dealer } from './dealer.entity'

@Entity('dealer_assessments')
export class DealerAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  dealerId: string

  @ManyToOne(() => Dealer, { eager: false })
  @JoinColumn({ name: 'dealer_id' })
  dealer: Dealer

  @Column({ length: 20 })
  period: string

  @Column({ length: 20 })
  periodType: string

  @Column({ type: 'jsonb', default: {} })
  scores: Record<string, number>

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  totalScore: number

  @Column({ length: 10, default: 'B' })
  grade: string

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salesTarget: number

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salesActual: number

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  targetAchievementRate: number

  @Column({ default: 0 })
  newCustomersCount: number

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  customerSatisfaction: number

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  complianceScore: number

  @Column({ type: 'text', nullable: true })
  comments: string

  @Column({ type: 'uuid', nullable: true })
  assessedBy: string

  @Column({ length: 100, nullable: true })
  assessedByName: string

  @Column({ default: 'draft' })
  status: string

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string

  @Column({ nullable: true })
  approvedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
