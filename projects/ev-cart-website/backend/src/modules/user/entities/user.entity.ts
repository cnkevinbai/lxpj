import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 用户实体
 * 支持部门区分（内贸/外贸）
 */
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

  @Column({ length: 50, default: 'sales' })
  role: string // admin, manager, sales, support

  @Column({ length: 50, default: 'domestic' })
  department: string // 'domestic' (内贸) or 'foreign' (外贸)

  @Column({ length: 50, default: 'active' })
  status: string // active, inactive, locked

  @Column({ nullable: true })
  lastLoginAt: Date

  @Column({ nullable: true })
  lastLoginIp: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
