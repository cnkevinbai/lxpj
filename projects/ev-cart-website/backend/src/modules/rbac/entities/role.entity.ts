/**
 * 角色实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

export type RoleType =
  | 'admin'           // 系统管理员
  | 'manager'         // 部门经理
  | 'sales'           // 销售人员
  | 'service_manager' // 售后主管
  | 'technician'      // 服务人员
  | 'finance'         // 财务人员
  | 'purchase'        // 采购人员
  | 'warehouse'       // 库管人员
  | 'customer'        // 客户 (外部)

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  code: RoleType

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  department: string  // 所属部门

  @Column({ type: 'jsonb', nullable: true })
  dataScope?: DataScope  // 数据权限范围

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export interface DataScope {
  type: 'all' | 'department' | 'self'  // 全部/本部门/仅自己
  departments?: string[]  // 指定部门
}
