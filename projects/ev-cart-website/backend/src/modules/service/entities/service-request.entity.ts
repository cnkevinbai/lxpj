import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  requestCode: string

  @Column({ type: 'uuid', nullable: true })
  customerId: string

  @Column({ length: 200 })
  customerName: string

  @Column({ length: 20, nullable: true })
  customerPhone: string

  @Column({ type: 'uuid', nullable: true })
  productId: string

  @Column({ length: 200, nullable: true })
  productName: string

  @Column({ length: 50 })
  requestType: string

  @Column({ type: 'text' })
  issueDescription: string

  @Column({ default: 'normal' })
  priority: string

  @Column({ default: 'pending' })
  status: string

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string

  @Column({ length: 100, nullable: true })
  assignedToName: string

  @Column({ type: 'uuid', nullable: true })
  orderId: string

  @Column({ length: 50, nullable: true })
  orderCode: string

  @Column({ length: 20, nullable: true })
  warrantyStatus: string

  @Column({ nullable: true })
  expectedResponseTime: Date

  @Column({ nullable: true })
  resolvedAt: Date

  @Column({ nullable: true })
  customerRating: number

  @Column({ type: 'text', nullable: true })
  customerFeedback: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
