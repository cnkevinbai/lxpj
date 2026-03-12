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

@Entity('dealer_rebates')
export class DealerRebate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  dealerId: string

  @ManyToOne(() => Dealer, { eager: false })
  @JoinColumn({ name: 'dealer_id' })
  dealer: Dealer

  @Column({ length: 50 })
  rebateType: string

  @Column({ length: 20 })
  period: string

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amount: number

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  basisAmount: number

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  rebateRate: number

  @Column({ type: 'text', nullable: true })
  calculationFormula: string

  @Column({ default: 'pending' })
  status: string

  @Column({ length: 50, nullable: true })
  paymentMethod: string

  @Column({ nullable: true })
  paidAt: Date

  @Column({ length: 100, nullable: true })
  paymentRef: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ type: 'uuid', nullable: true })
  createdBy: string

  @Column({ length: 100, nullable: true })
  createdByName: string

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string

  @Column({ nullable: true })
  approvedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
