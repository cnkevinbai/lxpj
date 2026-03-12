import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Dealer } from './dealer.entity'

@Entity('dealer_level_histories')
export class DealerLevelHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  dealerId: string

  @ManyToOne(() => Dealer, { eager: false })
  @JoinColumn({ name: 'dealer_id' })
  dealer: Dealer

  @Column({ length: 50, nullable: true })
  oldLevel: string

  @Column({ length: 50 })
  newLevel: string

  @Column({ length: 500, nullable: true })
  reason: string

  @Column({ length: 50, nullable: true })
  reasonType: string

  @Column({ type: 'uuid', array: true, default: [] })
  assessmentIds: string[]

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string

  @Column({ length: 100, nullable: true })
  approvedByName: string

  @Column({ type: 'date' })
  effectiveDate: Date

  @CreateDateColumn()
  createdAt: Date
}
