import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('dealers')
export class Dealer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 50 })
  dealerCode: string

  @Column({ length: 200 })
  companyName: string

  @Column({ length: 100 })
  contactPerson: string

  @Column({ length: 20 })
  contactPhone: string

  @Column({ length: 255 })
  contactEmail: string

  @Column({ length: 50 })
  province: string

  @Column({ length: 50 })
  city: string

  @Column({ type: 'text' })
  address: string

  @Column({ nullable: true })
  latitude: number

  @Column({ nullable: true })
  longitude: number

  @Column({ default: 'standard' })
  level: string

  @Column({ type: 'text', nullable: true })
  authorizedArea: string

  @Column('jsonb', { default: [] })
  authorizedProducts: string[]

  @Column({ default: 'active' })
  status: string

  @Column({ nullable: true })
  contractStart: Date

  @Column({ nullable: true })
  contractEnd: Date

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salesTarget: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  salesActual: number

  @Column({ nullable: true })
  ownerId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
