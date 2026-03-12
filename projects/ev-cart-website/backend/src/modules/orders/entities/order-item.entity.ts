import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Order } from './order.entity'

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  orderId: string

  @ManyToOne(() => Order, { eager: false })
  @JoinColumn({ name: 'order_id' })
  order: Order

  @Column({ type: 'uuid', nullable: true })
  productId: string

  @Column({ length: 50, nullable: true })
  productCode: string

  @Column({ length: 200, nullable: true })
  productName: string

  @Column()
  quantity: number

  @Column('decimal', { precision: 12, scale: 2 })
  unitPrice: number

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  taxRate: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number

  @Column('decimal', { precision: 12, scale: 2 })
  finalAmount: number

  @Column({ default: 'pending' })
  deliveryStatus: string

  @Column({ default: 0 })
  deliveredQuantity: number

  @CreateDateColumn()
  createdAt: Date
}
