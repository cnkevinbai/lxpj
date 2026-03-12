/**
 * 角色权限关联实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  @Index()
  roleId: string

  @Column({ type: 'uuid' })
  @Index()
  permissionId: string

  @CreateDateColumn()
  createdAt: Date
}
