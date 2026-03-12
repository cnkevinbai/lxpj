import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { Department } from './department.entity';
import { Role } from './role.entity';

/**
 * 用户实体
 */
@Entity('users')
@Index(['username', 'status'])
@Index(['email', 'status'])
@Index(['departmentId', 'status'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  username: string; // 用户名

  @Column({ length: 200 })
  password: string; // 密码（加密）

  @Column({ length: 100, unique: true })
  email: string; // 邮箱

  @Column({ length: 50, nullable: true })
  phone: string; // 电话

  @Column({ length: 100 })
  realName: string; // 真实姓名

  @Column({ length: 50, nullable: true })
  nickname: string; // 昵称

  @Column({ length: 100, nullable: true })
  avatar: string; // 头像

  @Column({ length: 50, default: 'male' })
  gender: 'male' | 'female' | 'other'; // 性别

  @Column({ nullable: true })
  birthday: Date; // 生日

  @ManyToOne(() => Department, department => department.users)
  department: Department;

  @Column({ nullable: true })
  departmentId: string; // 部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 部门名称

  @Column({ length: 100, nullable: true })
  position: string; // 职位

  @Column({ length: 50, default: 'employee' })
  employeeType: 'employee' | 'manager' | 'executive' | 'intern' | 'part_time'; // 员工类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'locked' | 'deleted'; // 状态

  @Column({ nullable: true })
  hireDate: Date; // 入职日期

  @Column({ nullable: true })
  resignationDate: Date; // 离职日期

  @Column({ length: 50, default: 'CNY' })
  language: string; // 语言

  @Column({ length: 50, default: 'Asia/Shanghai' })
  timezone: string; // 时区

  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean; // 是否超级管理员

  @Column({ type: 'boolean', default: false })
  mustChangePassword: boolean; // 首次登录必须修改密码

  @Column({ nullable: true })
  lastLoginAt: Date; // 最后登录时间

  @Column({ length: 50, nullable: true })
  lastLoginIp: string; // 最后登录 IP

  @Column({ default: 0 })
  loginCount: number; // 登录次数

  @Column({ nullable: true })
  passwordChangedAt: Date; // 密码修改时间

  @Column({ nullable: true })
  passwordExpiresAt: Date; // 密码过期时间

  @Column({ type: 'boolean', default: true })
  twoFactorEnabled: boolean; // 双因素认证

  @Column({ length: 200, nullable: true })
  twoFactorSecret: string; // 双因素密钥

  @Column('simple-array', { nullable: true })
  skills: string[]; // 技能

  @Column('text', { nullable: true })
  bio: string; // 个人简介

  @Column('simple-array', { nullable: true })
  socialLinks: string[]; // 社交链接

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

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

  @Column({ nullable: true })
  deletedAt: Date; // 删除时间
}
