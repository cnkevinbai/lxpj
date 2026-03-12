import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { ServiceOrder } from './service-order.entity';

/**
 * 服务回访实体
 */
@Entity('service_visits')
@Index(['serviceOrderId', 'visitType'])
export class ServiceVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  visitNo: string; // 回访号

  @ManyToOne(() => ServiceOrder)
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: string;

  @Column({ length: 200 })
  serviceOrderNo: string; // 服务单号

  @Column({ length: 50 })
  visitType: 'after_service' | 'regular' | 'complaint' | 'satisfaction'; // 回访类型

  @Column({ length: 50, default: 'phone' })
  visitMethod: 'phone' | 'email' | 'wechat' | 'onsite' | 'sms'; // 回访方式

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'completed' | 'cancelled'; // 状态

  @Column({ nullable: true })
  scheduledTime: Date; // 计划回访时间

  @Column({ nullable: true })
  visitTime: Date; // 实际回访时间

  @Column({ nullable: true })
  visitorId: string; // 回访人 ID

  @Column({ length: 100, nullable: true })
  visitorName: string; // 回访人姓名

  @Column({ nullable: true })
  customerId: string; // 客户 ID

  @Column({ length: 200, nullable: true })
  customerName: string; // 客户姓名

  @Column({ length: 100, nullable: true })
  customerPhone: string; // 客户电话

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  satisfactionScore: number; // 满意度评分

  @Column({ type: 'text', nullable: true })
  visitResult: string; // 回访结果

  @Column({ type: 'text', nullable: true })
  customerSuggestion: string; // 客户建议

  @Column({ type: 'text', nullable: true })
  customerComplaint: string; // 客户投诉

  @Column({ type: 'boolean', default: false })
  isFollowupRequired: boolean; // 是否需要跟进

  @Column({ type: 'text', nullable: true })
  followupPlan: string; // 跟进计划

  @Column({ nullable: true })
  followupById: string; // 跟进人 ID

  @Column({ length: 100, nullable: true })
  followupByName: string; // 跟进人姓名

  @Column({ nullable: true })
  followupDate: Date; // 跟进日期

  @Column({ type: 'text', nullable: true })
  followupResult: string; // 跟进结果

  @Column('simple-array', { nullable: true })
  photos: string[]; // 回访照片

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
