import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

/**
 * 角色实体
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  roleCode: string; // 角色编码

  @Column({ length: 200 })
  roleName: string; // 角色名称

  @Column({ length: 500, nullable: true })
  description: string; // 描述

  @Column({ length: 50, default: 'custom' })
  roleType: 'system' | 'custom' | 'department'; // 角色类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column({ type: 'boolean', default: false })
  isSystem: boolean; // 是否系统角色

  @Column({ type: 'boolean', default: false })
  isDefault: boolean; // 是否默认角色

  @Column('jsonb', { nullable: true })
  permissions: any[]; // 权限列表

  @Column('jsonb', { nullable: true })
  menuPermissions: any[]; // 菜单权限

  @Column('jsonb', { nullable: true })
  dataPermissions: any[]; // 数据权限

  @Column({ default: 0 })
  userCount: number; // 用户数量

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
