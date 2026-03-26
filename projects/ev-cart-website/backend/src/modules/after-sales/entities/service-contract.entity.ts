import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 服务合同实体
 */
@Entity('service_contracts')
export class ServiceContract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  contractNo: string; // 合同号

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 50 })
  contractType: 'warranty' | 'maintenance' | 'support' | 'training'; // 合同类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'expired' | 'terminated' | 'suspended' | 'expiring';

  @Column({ nullable: true })
  startDate: Date; // 开始日期

  @Column({ nullable: true })
  endDate: Date; // 结束日期

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  contractValue: number; // 合同金额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ length: 50, default: 'annual' })
  paymentCycle: 'one_time' | 'monthly' | 'quarterly' | 'annual'; // 付款周期

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已付金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  remainingAmount: number; // 剩余金额

  @Column({ default: 0 })
  serviceTimes: number; // 服务次数

  @Column({ default: 0 })
  usedTimes: number; // 已使用次数

  @Column({ default: 0 })
  remainingTimes: number; // 剩余次数

  @Column({ length: 500, nullable: true })
  serviceScope: string; // 服务范围

  @Column({ length: 500, nullable: true })
  serviceItems: string; // 服务项目

  @Column({ length: 500, nullable: true })
  exclusions: string; // 除外责任

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountRate: number; // 折扣率

  @Column({ nullable: true })
  salespersonId: string; // 销售员 ID

  @Column({ length: 100, nullable: true })
  salespersonName: string; // 销售员姓名

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
