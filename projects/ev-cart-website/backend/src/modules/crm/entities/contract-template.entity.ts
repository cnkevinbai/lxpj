import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 合同模板实体
 * 支持国内/外贸标准合同模板
 */
@Entity('contract_templates')
@Index(['category', 'status'])
export class ContractTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  templateCode: string; // 模板编码

  @Column({ length: 200 })
  templateName: string; // 模板名称

  @Column({ length: 50, default: 'domestic' })
  contractType: 'domestic' | 'foreign'; // 合同类型

  @Column({ length: 50 })
  category: 'sales' | 'purchase' | 'service' | 'distribution' | 'other'; // 合同类别

  @Column({ length: 50, default: 'standard' })
  templateType: 'standard' | 'custom' | 'simple'; // 模板类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'draft'; // 状态

  @Column({ length: 200 })
  version: string; // 版本号

  @Column('text')
  content: string; // 合同内容（HTML/富文本）

  @Column('text', { nullable: true })
  plainText: string; // 纯文本内容（用于搜索）

  @Column('jsonb', { nullable: true })
  variables: any[]; // 合同变量（可替换字段）

  @Column('jsonb', { nullable: true })
  clauses: any[]; // 标准条款

  @Column('simple-array', { nullable: true })
  attachments: string[]; // 附件

  @Column({ nullable: true })
  applicableProducts: string; // 适用产品

  @Column({ nullable: true })
  applicableRegions: string; // 适用地区

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minAmount: number; // 最小金额

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxAmount: number; // 最大金额

  @Column({ nullable: true })
  effectiveDate: Date; // 生效日期

  @Column({ nullable: true })
  expiryDate: Date; // 失效日期

  @Column('text', { nullable: true })
  usage: string; // 使用说明

  @Column('text', { nullable: true })
  notes: string; // 备注

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @Column({ nullable: true })
  approvedBy: string; // 审批人

  @Column({ nullable: true })
  approvedAt: Date; // 审批时间

  @Column({ default: 0 })
  usageCount: number; // 使用次数

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number; // 评分

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
