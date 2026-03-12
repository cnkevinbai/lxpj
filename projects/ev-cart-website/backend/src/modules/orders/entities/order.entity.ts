import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { OrderItem } from './order-item.entity'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  orderCode: string

  @Column({ type: 'uuid', nullable: true })
  customerId: string

  @Column({ length: 200 })
  customerName: string

  @Column()
  orderDate: Date

  @Column({ nullable: true })
  deliveryDate: Date

  @Column({ default: 'pending' })
  status: string

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paidAmount: number

  @Column({ default: 'unpaid' })
  paymentStatus: string

  @Column({ type: 'text', nullable: true })
  shippingAddress: string

  @Column({ length: 100, nullable: true })
  shippingMethod: string

  @Column({ length: 100, nullable: true })
  trackingNumber: string

  @Column({ type: 'uuid', nullable: true })
  salesRepId: string

  @Column({ length: 100, nullable: true })
  salesRepName: string

  @Column({ type: 'uuid', nullable: true })
  dealerId: string

  @Column({ length: 200, nullable: true })
  dealerName: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
