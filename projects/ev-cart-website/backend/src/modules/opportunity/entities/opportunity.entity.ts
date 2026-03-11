import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { User } from '../user/entities/user.entity'

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  name: string

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @Column({ length: 100 })
  customerId: string

  @Column({ default: 'discovery' })
  stage: string

  @Column('jsonb', { default: [] })
  products: Array<{ productId: string; quantity: number; config: string }>

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  estimatedAmount: number

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  actualAmount: number

  @Column({ default: 10 })
  probability: number

  @Column({ nullable: true })
  expectedCloseDate: Date

  @Column({ nullable: true })
  actualCloseDate: Date

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @Column({ nullable: true })
  ownerId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
