import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 服务级别协议实体
 */
@Entity('service_slas')
@Index(['slaCode', 'status'])
export class ServiceSLA {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  slaCode: string; // SLA 编码

  @Column({ length: 200 })
  slaName: string; // SLA 名称

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column({ length: 50, default: 'standard' })
  level: 'basic' | 'standard' | 'premium' | 'enterprise'; // 服务级别

  @Column({ type: 'integer', default: 2 })
  responseType: number; // 响应时间（小时）

  @Column({ type: 'integer', default: 24 })
  resolutionTime: number; // 解决时间（小时）

  @Column({ type: 'integer', default: 4 })
  arrivalTime: number; // 到达时间（小时）

  @Column({ length: 50, default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'urgent'; // 优先级

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  penaltyRate: number; // 违约费率（%）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  maxPenalty: number; // 最大违约金

  @Column({ type: 'text', nullable: true })
  serviceScope: string; // 服务范围

  @Column({ type: 'text', nullable: true })
  exclusions: string; // 除外责任

  @Column({ type: 'text', nullable: true })
  serviceHours: string; // 服务时间

  @Column({ type: 'boolean', default: true })
  is24x7: boolean; // 是否 7x24 小时服务

  @Column({ type: 'boolean', default: false })
  isOnSite: boolean; // 是否上门服务

  @Column({ type: 'boolean', default: true })
  isRemote: boolean; // 是否远程支持

  @Column({ type: 'integer', default: 0 })
  includedVisits: number; // 包含上门次数

  @Column({ type: 'integer', default: 0 })
  includedHours: number; // 包含服务小时数

  @Column('simple-array', { nullable: true })
  applicableProducts: string[]; // 适用产品

  @Column('text', { nullable: true })
  remark: string; // 备注

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
