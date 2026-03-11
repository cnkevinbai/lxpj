import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ length: 200, nullable: true })
  customerName: string

  @Column({ length: 50, nullable: true })
  industry: string

  @Column({ length: 100, nullable: true })
  location: string

  @Column('jsonb', { default: [] })
  productsUsed: string[]

  @Column({ type: 'text', nullable: true })
  description: string

  @Column('jsonb', { default: [] })
  images: string[]

  @Column({ default: 'draft' })
  status: string

  @Column({ nullable: true })
  publishedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
