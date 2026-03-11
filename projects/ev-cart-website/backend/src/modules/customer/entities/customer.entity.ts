import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../user/entities/user.entity'

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  name: string

  @Column({ default: 'company' })
  type: string

  @Column({ length: 100, nullable: true })
  industry: string

  @Column({ length: 100, nullable: true })
  contactPerson: string

  @Column({ length: 20, nullable: true })
  contactPhone: string

  @Column({ length: 255, nullable: true })
  contactEmail: string

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ length: 50, nullable: true })
  province: string

  @Column({ length: 50, nullable: true })
  city: string

  @Column({ length: 50, nullable: true })
  source: string

  @Column({ default: 'C' })
  level: string

  @Column({ default: 'potential' })
  status: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
