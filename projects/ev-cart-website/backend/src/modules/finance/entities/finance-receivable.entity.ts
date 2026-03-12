import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('finance_receivables')
export class FinanceReceivable {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  receivableCode: string

  @Column({ type: 'uuid', nullable: true })
  customerId: string

  @Column({ length: 200 })
  customerName: string

  @Column({ type: 'uuid', nullable: true })
  orderId: string

  @Column({ length: 50, nullable: true })
  orderCode: string

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paidAmount: number

  @Column('decimal', { precision: 12, scale: 2 })
  balance: number

  @Column()
  dueDate: Date

  @Column({ default: 'pending' })
  status: string

  @Column({ length: 100, nullable: true })
  paymentTerms: string

  @Column({ type: 'uuid', nullable: true })
  createdBy: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
