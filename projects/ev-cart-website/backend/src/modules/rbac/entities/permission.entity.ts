/**
 * 权限实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

export type PermissionType =
  | 'menu'          // 菜单权限
  | 'button'        // 按钮权限
  | 'api'           // API 权限
  | 'data'          // 数据权限

export type ResourceType =
  | 'crm'           // CRM 资源
  | 'erp'           // ERP 资源
  | 'after_sales'   // 售后资源
  | 'contract'      // 合同资源
  | 'approval'      // 审批资源
  | 'system'        // 系统资源

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  code: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 30 })
  type: PermissionType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  resourceType: ResourceType

  @Column({ type: 'varchar', length: 200, nullable: true })
  path?: string  // API 路径或菜单路径

  @Column({ type: 'varchar', length: 100, nullable: true })
  action?: string  // 操作类型：create/read/update/delete

  @Column({ type: 'varchar', length: 50, nullable: true })
  parentCode?: string  // 父级权限代码

  @Column({ type: 'integer', default: 0 })
  sortOrder: number

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date
}
