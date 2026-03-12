import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { SystemRole } from './system-role.entity'
import { SystemOperationLog } from './system-operation-log.entity'

@Entity('system_users')
export class SystemUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100, unique: true })
  username: string

  @Column({ length: 255, unique: true })
  email: string

  @Column({ length: 255, select: false })
  passwordHash: string

  @Column({ length: 100, nullable: true })
  realName: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ type: 'text', nullable: true })
  avatarUrl: string

  @Column({ length: 100, nullable: true })
  department: string

  @Column({ length: 100, nullable: true })
  position: string

  @Column({ type: 'uuid', nullable: true })
  roleId: string

  @ManyToOne(() => SystemRole, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role: SystemRole

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  lastLoginAt: Date

  @OneToMany(() => SystemOperationLog, (log) => log.user)
  operationLogs: SystemOperationLog[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
