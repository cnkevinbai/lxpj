import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { QualityStandardItem } from './quality-standard-item.entity';

/**
 * 质检标准实体
 */
@Entity('quality_standards')
export class QualityStandard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  standardCode: string; // 标准编码

  @Column({ length: 200 })
  standardName: string; // 标准名称

  @Column({ length: 50 })
  standardType: 'national' | 'industry' | 'enterprise' | 'customer'; // 标准类型

  @Column({ length: 100, nullable: true })
  standardVersion: string; // 标准版本

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'draft'; // 状态

  @Column({ nullable: true })
  productId: string; // 适用产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 适用产品名称

  @Column('simple-array', { nullable: true })
  productCategories: string[]; // 适用产品分类

  @Column({ length: 50, nullable: true })
  inspectionType: 'incoming' | 'process' | 'final' | 'outgoing'; // 检验类型

  @Column({ length: 50, default: 'normal' })
  inspectionLevel: 'normal' | 'strict' | 'relaxed'; // 检验水平

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  aqlValue: number; // AQL 值（可接受质量水平）

  @Column('text', { nullable: true })
  samplingPlan: string; // 抽样方案

  @Column('text', { nullable: true })
  inspectionProcedure: string; // 检验流程

  @Column('text', { nullable: true })
  judgmentCriteria: string; // 判定标准

  @Column({ nullable: true })
  effectiveDate: Date; // 生效日期

  @Column({ nullable: true })
  expiryDate: Date; // 失效日期

  @Column({ nullable: true })
  reviewedById: string; // 审核人 ID

  @Column({ length: 100, nullable: true })
  reviewedByName: string; // 审核人姓名

  @Column({ nullable: true })
  reviewedDate: Date; // 审核日期

  @Column({ nullable: true })
  approvedById: string; // 批准人 ID

  @Column({ length: 100, nullable: true })
  approvedByName: string; // 批准人姓名

  @Column({ nullable: true })
  approvedDate: Date; // 批准日期

  @Column('text', { nullable: true })
  attachment: string; // 附件

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QualityStandardItem, item => item.standard)
  items: QualityStandardItem[];
}
