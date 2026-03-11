import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../user/entities/user.entity'

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 20 })
  phone: string

  @Column({ length: 255, nullable: true })
  email: string

  @Column({ length: 200, nullable: true })
  company: string

  @Column({ length: 100, nullable: true })
  productInterest: string

  @Column({ length: 50, nullable: true })
  budget: string

  @Column({ default: 'website' })
  source: string

  @Column({ default: 'new' })
  status: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @Column({ nullable: true })
  convertedCustomerId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
