import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  name: string

  @Column({ unique: true, length: 50 })
  model: string

  @Column({ length: 50 })
  category: string

  @Column()
  passengerCapacity: number

  @Column({ length: 100, nullable: true })
  batteryType: string

  @Column({ nullable: true })
  rangeKm: number

  @Column({ nullable: true })
  maxSpeed: number

  @Column({ length: 50, nullable: true })
  chargeTime: string

  @Column({ length: 50, nullable: true })
  motorPower: string

  @Column('jsonb', { nullable: true })
  dimensions: { length: number; width: number; height: number }

  @Column({ nullable: true })
  weight: number

  @Column({ length: 50, nullable: true })
  priceRange: string

  @Column({ default: 'active' })
  status: string

  @Column('jsonb', { default: [] })
  images: string[]

  @Column('jsonb', { default: [] })
  features: string[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
