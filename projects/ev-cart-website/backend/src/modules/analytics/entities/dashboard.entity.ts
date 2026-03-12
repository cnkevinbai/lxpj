import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 数据驾驶舱实体
 */
@Entity('dashboards')
@Index(['category', 'status'])
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  dashboardCode: string; // 驾驶舱编码

  @Column({ length: 200 })
  dashboardName: string; // 驾驶舱名称

  @Column({ length: 50 })
  category: 'executive' | 'sales' | 'production' | 'finance' | 'hr'; // 分类

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column('jsonb')
  widgets: any[]; // 组件配置

  @Column('jsonb', { nullable: true })
  layout: any; // 布局配置

  @Column({ type: 'integer', default: 0 })
  refreshInterval: number; // 刷新间隔（秒）

  @Column({ type: 'boolean', default: false })
  isPublic: boolean; // 是否公开

  @Column('simple-array', { nullable: true })
  visibleRoles: string[]; // 可见角色

  @Column('simple-array', { nullable: true })
  visibleUsers: string[]; // 可见用户

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @Column('text', { nullable: true })
  description: string; // 描述

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
