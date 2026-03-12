/**
 * 用户角色关联实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm'
import { Role } from './role.entity'

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  @Index()
  userId: string

  @Column({ type: 'uuid' })
  @Index()
  roleId: string

  @ManyToOne(() => Role)
  role: Role

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date  // 角色有效期

  @Column({ type: 'uuid', nullable: true })
  grantedBy?: string  // 授权人

  @CreateDateColumn()
  createdAt: Date
}
