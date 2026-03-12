import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 预防性维护计划实体
 */
@Entity('preventive_maintenances')
export class PreventiveMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  planNo: string; // 计划编号

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ nullable: true })
  productId: string; // 产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 产品名称

  @Column({ length: 100, nullable: true })
  productSerialNo: string; // 产品序列号

  @Column({ length: 50 })
  maintenanceType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'; // 维护类型

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'overdue';

  @Column({ nullable: true })
  lastMaintenanceDate: Date; // 上次维护日期

  @Column({ nullable: true })
  nextMaintenanceDate: Date; // 下次维护日期

  @Column({ nullable: true })
  scheduledDate: Date; // 计划日期

  @Column({ nullable: true })
  completedDate: Date; // 完成日期

  @Column({ nullable: true })
  engineerId: string; // 工程师 ID

  @Column({ length: 100, nullable: true })
  engineerName: string; // 工程师姓名

  @Column('text', { nullable: true })
  maintenanceItems: string; // 维护项目

  @Column('text', { nullable: true })
  maintenanceResult: string; // 维护结果

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCost: number; // 人工费

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  partsCost: number; // 配件费

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number; // 总费用

  @Column({ nullable: true })
  serviceContractId: string; // 服务合同 ID

  @Column({ length: 100, nullable: true })
  serviceContractNo: string; // 服务合同号

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
