import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Tree, TreeParent, TreeChildren } from 'typeorm';
import { User } from './user.entity';

/**
 * 部门实体（树形结构）
 */
@Entity('departments')
@Tree('closure-table')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  departmentCode: string; // 部门编码

  @Column({ length: 200 })
  departmentName: string; // 部门名称

  @Column({ length: 500, nullable: true })
  fullName: string; // 完整路径名称

  @TreeParent()
  parent: Department;

  @TreeChildren()
  children: Department[];

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column({ default: 0 })
  sortOrder: number; // 排序

  @Column({ length: 200, nullable: true })
  managerId: string; // 部门负责人 ID

  @Column({ length: 200, nullable: true })
  managerName: string; // 负责人姓名

  @Column({ length: 100, nullable: true })
  managerPhone: string; // 负责人电话

  @Column({ length: 200, nullable: true })
  managerEmail: string; // 负责人邮箱

  @Column({ length: 500, nullable: true })
  description: string; // 部门描述

  @Column({ length: 500, nullable: true })
  address: string; // 地址

  @Column({ length: 100, nullable: true })
  phone: string; // 部门电话

  @Column({ length: 100, nullable: true })
  fax: string; // 传真

  @Column({ length: 200, nullable: true })
  email: string; // 部门邮箱

  @Column({ length: 200, nullable: true })
  website: string; // 网站

  @Column({ default: 0 })
  employeeCount: number; // 员工数量

  @Column({ type: 'boolean', default: true })
  isVirtual: boolean; // 是否虚拟部门

  @Column({ nullable: true })
  establishedDate: Date; // 成立日期

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, user => user.department)
  users: User[];
}
