import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('system_roles')
export class SystemRole {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  roleCode: string

  @Column({ length: 100 })
  roleName: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'jsonb', default: [] })
  permissions: string[]

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
