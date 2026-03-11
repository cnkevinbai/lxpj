import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { User } from '../user/entities/user.entity'
import { Opportunity } from '../opportunity/entities/opportunity.entity'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 50 })
  orderNo: string

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @Column({ length: 100 })
  customerId: string

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn({ name: 'opportunity_id' })
  opportunity: Opportunity

  @Column({ nullable: true })
  opportunityId: string

  @Column('jsonb')
  products: Array<{ productId: string; quantity: number; price: number; config: string }>

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paidAmount: number

  @Column({ default: 'pending' })
  status: string

  @Column({ default: 'unpaid' })
  paymentStatus: string

  @Column({ type: 'text', nullable: true })
  deliveryAddress: string

  @Column({ nullable: true })
  expectedDeliveryDate: Date

  @Column({ nullable: true })
  actualDeliveryDate: Date

  @Column({ type: 'text', nullable: true })
  notes: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User

  @Column({ nullable: true })
  createdById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
