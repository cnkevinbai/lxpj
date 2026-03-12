import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * 服务报表实体
 */
@Entity('service_reports')
@Index(['reportType', 'reportPeriod'])
export class ServiceReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  reportNo: string; // 报表号

  @Column({ length: 50 })
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'; // 报表类型

  @Column({ length: 20 })
  reportPeriod: string; // 报表期间

  @Column({ nullable: true })
  startDate: Date; // 开始日期

  @Column({ nullable: true })
  endDate: Date; // 结束日期

  // 工单统计
  @Column({ type: 'integer', default: 0 })
  totalOrders: number; // 总工单数

  @Column({ type: 'integer', default: 0 })
  completedOrders: number; // 完成工单数

  @Column({ type: 'integer', default: 0 })
  pendingOrders: number; // 待处理工单数

  @Column({ type: 'integer', default: 0 })
  inProgressOrders: number; // 进行中工单数

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionRate: number; // 完成率

  // 时效统计
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgResponseTime: number; // 平均响应时间（分钟）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgResolutionTime: number; // 平均解决时间（分钟）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgArrivalTime: number; // 平均到达时间（分钟）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  onTimeRate: number; // 准时率

  // 质量统计
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  avgRating: number; // 平均评分

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  customerSatisfaction: number; // 客户满意度

  @Column({ type: 'integer', default: 0 })
  complaintCount: number; // 投诉次数

  @Column({ type: 'integer', default: 0 })
  reworkCount: number; // 返工次数

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  firstTimeFixRate: number; // 一次修复率

  // 财务统计
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number; // 总收入

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborRevenue: number; // 人工收入

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  partsRevenue: number; // 配件收入

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number; // 总成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  profit: number; // 利润

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  profitMargin: number; // 利润率

  // 工程师统计
  @Column({ type: 'integer', default: 0 })
  totalEngineers: number; // 总工程师数

  @Column({ type: 'integer', default: 0 })
  activeEngineers: number; // 活跃工程师数

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgOrdersPerEngineer: number; // 人均工单数

  // 配件统计
  @Column({ type: 'integer', default: 0 })
  totalPartsUsed: number; // 配件使用总数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  partsCost: number; // 配件成本

  @Column({ type: 'text', nullable: true })
  analysis: string; // 分析说明

  @Column({ type: 'text', nullable: true })
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
