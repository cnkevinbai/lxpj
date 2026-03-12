import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 权限实体
 */
@Entity('permissions')
@Index(['module', 'action'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  permissionCode: string; // 权限编码

  @Column({ length: 200 })
  permissionName: string; // 权限名称

  @Column({ length: 50 })
  module: string; // 模块（crm/erp/hr/finance 等）

  @Column({ length: 50 })
  action: string; // 操作（create/read/update/delete/export 等）

  @Column({ length: 500, nullable: true })
  resource: string; // 资源路径

  @Column({ length: 50, default: 'allow' })
  effect: 'allow' | 'deny'; // 允许/拒绝

  @Column({ length: 500, nullable: true })
  description: string; // 描述

  @Column({ length: 50, default: 'system' })
  category: string; // 分类

  @Column({ default: 0 })
  sortOrder: number; // 排序

  @Column({ type: 'boolean', default: false })
  isSystem: boolean; // 是否系统权限

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // 是否启用

  @Column({ nullable: true })
  parentId: string; // 父权限 ID

  @Column('simple-array', { nullable: true })
  dependencies: string[]; // 依赖权限

  @Column('jsonb', { nullable: true })
  conditions: any; // 条件

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
