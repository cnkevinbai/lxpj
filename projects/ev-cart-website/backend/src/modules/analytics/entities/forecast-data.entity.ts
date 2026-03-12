import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * 预测数据实体
 */
@Entity('forecast_data')
@Index(['forecastType', 'forecastPeriod'])
export class ForecastData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  forecastType: 'sales' | 'inventory' | 'cash_flow' | 'demand'; // 预测类型

  @Column({ length: 20 })
  forecastPeriod: string; // 预测期间

  @Column({ nullable: true })
  forecastDate: Date; // 预测日期

  @Column({ length: 100, nullable: true })
  productId: string; // 产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 产品名称

  @Column({ nullable: true })
  customerId: string; // 客户 ID

  @Column({ length: 200, nullable: true })
  customerName: string; // 客户名称

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualValue: number; // 实际值

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  forecastValue: number; // 预测值

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  accuracy: number; // 准确率

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  growthRate: number; // 增长率

  @Column({ length: 50, nullable: true })
  model: string; // 预测模型

  @Column('jsonb', { nullable: true })
  parameters: any; // 模型参数

  @Column('jsonb', { nullable: true })
  confidenceInterval: any; // 置信区间

  @Column('text', { nullable: true })
  analysis: string; // 分析说明

  @CreateDateColumn()
  createdAt: Date;
}
