import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 50 })
  username: string

  @Column({ unique: true, length: 255 })
  email: string

  @Column({ length: 255 })
  passwordHash: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 500, nullable: true })
  avatarUrl: string

  @Column({ default: 'sales' })
  role: string

  @Column({ default: 'active' })
  status: string

  @Column({ nullable: true })
  lastLoginAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
