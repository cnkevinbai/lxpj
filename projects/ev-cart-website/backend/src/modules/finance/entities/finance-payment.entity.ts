import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { FinanceReceivable } from './finance-receivable.entity'

@Entity('finance_payments')
export class FinancePayment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  paymentCode: string

  @Column({ type: 'uuid', nullable: true })
  receivableId: string

  @ManyToOne(() => FinanceReceivable, { eager: false })
  @JoinColumn({ name: 'receivable_id' })
  receivable: FinanceReceivable

  @Column({ type: 'uuid', nullable: true })
  customerId: string

  @Column({ length: 200 })
  customerName: string

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number

  @Column({ length: 50 })
  paymentMethod: string

  @Column()
  paymentDate: Date

  @Column({ length: 100, nullable: true })
  bankAccount: string

  @Column({ length: 100, nullable: true })
  transactionRef: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ type: 'uuid', nullable: true })
  createdBy: string

  @CreateDateColumn()
  createdAt: Date
}
