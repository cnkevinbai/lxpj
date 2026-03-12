import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * 财务报表实体
 */
@Entity('financial_reports')
@Index(['reportType', 'reportPeriod'])
export class FinancialReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  reportType: 'balance_sheet' | 'income_statement' | 'cash_flow'; // 报表类型

  @Column({ length: 20 })
  reportPeriod: string; // 报表期间（如 2026-03）

  @Column({ nullable: true })
  startDate: Date; // 开始日期

  @Column({ nullable: true })
  endDate: Date; // 结束日期

  @Column('jsonb')
  data: any; // 报表数据

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAssets: number; // 资产总计

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalLiabilities: number; // 负债总计

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalEquity: number; // 所有者权益总计

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number; // 营业收入

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number; // 营业成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  grossProfit: number; // 毛利润

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netProfit: number; // 净利润

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  operatingCashFlow: number; // 经营活动现金流

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  investingCashFlow: number; // 投资活动现金流

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  financingCashFlow: number; // 筹资活动现金流

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  grossProfitRate: number; // 毛利率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  netProfitRate: number; // 净利率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  roe: number; // 净资产收益率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  roa: number; // 总资产收益率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  currentRatio: number; // 流动比率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  quickRatio: number; // 速动比率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  assetLiabilityRatio: number; // 资产负债率

  @Column({ nullable: true })
  preparedById: string; // 编制人 ID

  @Column({ length: 100, nullable: true })
  preparedByName: string; // 编制人姓名

  @Column({ nullable: true })
  preparedDate: Date; // 编制日期

  @Column({ nullable: true })
  auditedById: string; // 审核人 ID

  @Column({ length: 100, nullable: true })
  auditedByName: string; // 审核人姓名

  @Column({ nullable: true })
  auditedDate: Date; // 审核日期

  @Column('text', { nullable: true })
  analysis: string; // 财务分析

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;
}
