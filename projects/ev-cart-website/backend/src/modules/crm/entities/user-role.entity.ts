import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 用户角色实体
 * 支持国内/外贸业务员角色区分
 */
@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  roleCode: string; // 角色编码

  @Column({ length: 200 })
  roleName: string; // 角色名称

  @Column({ length: 50 })
  roleType: 'domestic' | 'foreign' | 'admin' | 'manager' | 'service'; // 角色类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column('jsonb', { nullable: true })
  permissions: any[]; // 权限列表

  @Column('text', { nullable: true })
  description: string; // 描述

  @Column({ default: false })
  isSystem: boolean; // 是否系统角色

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
