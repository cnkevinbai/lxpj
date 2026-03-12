import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * 质量报表实体（聚合数据）
 */
@Entity('quality_reports')
export class QualityReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'; // 报表类型

  @Column({ length: 50 })
  inspectionType: 'incoming' | 'process' | 'final' | 'outgoing'; // 检验类型

  @Column({ length: 20 })
  reportPeriod: string; // 报表期间（如 2026-03）

  @Column({ nullable: true })
  startDate: Date; // 开始日期

  @Column({ nullable: true })
  endDate: Date; // 结束日期

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalQuantity: number; // 总检验数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  qualifiedQuantity: number; // 合格数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  defectiveQuantity: number; // 不良数量

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualifiedRate: number; // 合格率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number; // 不良率

  @Column('jsonb', { nullable: true })
  defectTypeDistribution: any; // 不良类型分布

  @Column('jsonb', { nullable: true })
  supplierQuality: any; // 供应商质量排名

  @Column('jsonb', { nullable: true })
  productQuality: any; // 产品质量排名

  @Column('jsonb', { nullable: true })
  trendData: any; // 趋势数据

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  qualityCost: number; // 质量成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  reworkCost: number; // 返工成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  scrapCost: number; // 报废成本

  @Column('text', { nullable: true })
  qualityAnalysis: string; // 质量分析

  @Column('text', { nullable: true })
  improvementSuggestions: string; // 改进建议

  @Column({ nullable: true })
  preparedById: string; // 编制人 ID

  @Column({ length: 100, nullable: true })
  preparedByName: string; // 编制人姓名

  @Column({ nullable: true })
  preparedDate: Date; // 编制日期

  @CreateDateColumn()
  createdAt: Date;
}
