import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 报表模板实体
 */
@Entity('report_templates')
@Index(['category', 'status'])
export class ReportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  templateCode: string; // 模板编码

  @Column({ length: 200 })
  templateName: string; // 模板名称

  @Column({ length: 50 })
  category: 'sales' | 'purchase' | 'inventory' | 'finance' | 'hr' | 'production' | 'quality'; // 报表分类

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'draft'; // 状态

  @Column({ length: 50, default: 'table' })
  reportType: 'table' | 'chart' | 'dashboard' | 'pivot'; // 报表类型

  @Column('jsonb')
  dataSource: any; // 数据源配置

  @Column('jsonb', { nullable: true })
  columns: any[]; // 列配置

  @Column('jsonb', { nullable: true })
  filters: any[]; // 筛选条件

  @Column('jsonb', { nullable: true })
  charts: any[]; // 图表配置

  @Column('jsonb', { nullable: true })
  layout: any; // 布局配置

  @Column({ type: 'boolean', default: false })
  isSystem: boolean; // 是否系统模板

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @Column({ type: 'integer', default: 0 })
  usageCount: number; // 使用次数

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number; // 评分

  @Column('text', { nullable: true })
  description: string; // 描述

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
