import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { QualityInspectionItem } from './quality-inspection-item.entity';

/**
 * 质检单实体
 */
@Entity('quality_inspections')
@Index(['inspectionType', 'status'])
@Index(['relatedOrderId', 'relatedType'])
export class QualityInspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  inspectionNo: string; // 质检单号

  @Column({ length: 50 })
  inspectionType: 'incoming' | 'process' | 'final' | 'outgoing'; // 质检类型（来料/过程/成品/出厂）

  @Column({ length: 50, default: 'normal' })
  inspectionLevel: 'normal' | 'strict' | 'relaxed'; // 检验水平

  @Column({ length: 100, nullable: true })
  relatedOrderId: string; // 关联单号 ID（采购单/生产工单/销售单）

  @Column({ length: 50, nullable: true })
  relatedType: string; // 关联单类型（purchase/production/sales）

  @Column({ length: 100, nullable: true })
  relatedOrderNo: string; // 关联单号

  @Column({ nullable: true })
  supplierId: string; // 供应商 ID（来料检验用）

  @Column({ length: 200, nullable: true })
  supplierName: string; // 供应商名称

  @Column({ nullable: true })
  productId: string; // 产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 产品名称

  @Column({ length: 100, nullable: true })
  productModel: string; // 产品型号

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  quantity: number; // 检验数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  qualifiedQuantity: number; // 合格数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  defectiveQuantity: number; // 不良数量

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualifiedRate: number; // 合格率

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'inspecting' | 'completed' | 'rejected'; // 状态

  @Column({ nullable: true })
  inspectorId: string; // 检验员 ID

  @Column({ length: 100, nullable: true })
  inspectorName: string; // 检验员姓名

  @Column({ nullable: true })
  inspectionDate: Date; // 检验日期

  @Column({ nullable: true })
  completedDate: Date; // 完成日期

  @Column({ length: 100, nullable: true })
  standardId: string; // 检验标准 ID

  @Column({ length: 200, nullable: true })
  standardName: string; // 检验标准名称

  @Column({ length: 500, nullable: true })
  inspectionResult: string; // 检验结果说明

  @Column('simple-array', { nullable: true })
  defectTypes: string[]; // 不良类型

  @Column('text', { nullable: true })
  remark: string; // 备注

  @Column({ nullable: true })
  attachmentIds: string; // 附件 ID 列表

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QualityInspectionItem, item => item.inspection)
  items: QualityInspectionItem[];
}
