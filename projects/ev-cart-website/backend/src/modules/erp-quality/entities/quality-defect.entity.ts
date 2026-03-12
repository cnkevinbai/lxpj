import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

/**
 * 不良品登记实体
 */
@Entity('quality_defects')
export class QualityDefect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  defectNo: string; // 不良品编号

  @Column({ nullable: true })
  inspectionId: string; // 关联质检单 ID

  @Column({ length: 100, nullable: true })
  inspectionNo: string; // 质检单号

  @Column({ nullable: true })
  productId: string; // 产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 产品名称

  @Column({ length: 100, nullable: true })
  productModel: string; // 产品型号

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  quantity: number; // 不良数量

  @Column({ length: 50 })
  defectType: string; // 不良类型

  @Column({ length: 500, nullable: true })
  defectDescription: string; // 不良描述

  @Column({ length: 50 })
  severity: 'critical' | 'major' | 'minor'; // 严重程度

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'analyzing' | 'processing' | 'completed' | 'closed'; // 处理状态

  @Column({ nullable: true })
  foundById: string; // 发现人 ID

  @Column({ length: 100, nullable: true })
  foundByName: string; // 发现人姓名

  @Column({ nullable: true })
  foundDate: Date; // 发现日期

  @Column({ nullable: true })
  departmentId: string; // 发现部门

  @Column({ length: 200, nullable: true })
  departmentName: string; // 发现部门名称

  @Column('text', { nullable: true })
  causeAnalysis: string; // 原因分析

  @Column('text', { nullable: true })
  handlingMethod: string; // 处理方式（返工/报废/让步接收等）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  handlingCost: number; // 处理成本

  @Column('text', { nullable: true })
  preventiveMeasures: string; // 预防措施

  @Column({ nullable: true })
  responsiblePersonId: string; // 责任人 ID

  @Column({ length: 100, nullable: true })
  responsiblePersonName: string; // 责任人姓名

  @Column({ nullable: true })
  completedDate: Date; // 完成日期

  @Column({ nullable: true })
  verifiedById: string; // 验证人 ID

  @Column({ length: 100, nullable: true })
  verifiedByName: string; // 验证人姓名

  @Column({ nullable: true })
  verifiedDate: Date; // 验证日期

  @Column('simple-array', { nullable: true })
  photos: string[]; // 不良照片

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
