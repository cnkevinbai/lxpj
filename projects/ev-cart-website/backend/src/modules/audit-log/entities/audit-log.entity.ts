import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { User } from '../user/entities/user.entity'

export type ActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'IMPORT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ASSIGN'
  | 'CONVERT'

export type EntityType =
  | 'lead'
  | 'customer'
  | 'opportunity'
  | 'order'
  | 'product'
  | 'user'
  | 'purchase'
  | 'inventory'
  | 'production'
  | 'finance'

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  action: ActionType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  entityType: EntityType

  @Column({ type: 'uuid', nullable: true })
  @Index()
  entityId?: string

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user?: User

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId?: string

  @Column({ type: 'varchar', length: 100 })
  userName: string

  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, any>

  @Column({ type: 'text', nullable: true })
  remark?: string

  @Column({ type: 'varchar', length: 45 })
  @Index()
  ip: string

  @Column({ type: 'text', nullable: true })
  userAgent?: string

  @CreateDateColumn()
  @Index()
  createdAt: Date
}
