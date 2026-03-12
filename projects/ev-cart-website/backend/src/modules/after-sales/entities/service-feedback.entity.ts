import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { ServiceOrder } from './service-order.entity';

/**
 * 服务反馈实体
 */
@Entity('service_feedbacks')
@Index(['serviceOrderId', 'customerId'])
export class ServiceFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  feedbackNo: string; // 反馈号

  @ManyToOne(() => ServiceOrder)
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: string;

  @Column({ length: 200 })
  serviceOrderNo: string; // 服务单号

  @Column()
  customerId: string; // 客户 ID

  @Column({ length: 200 })
  customerName: string; // 客户姓名

  @Column({ length: 100, nullable: true })
  customerPhone: string; // 客户电话

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  satisfactionScore: number; // 总体满意度（1-5）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  serviceAttitude: number; // 服务态度（1-5）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  serviceQuality: number; // 服务质量（1-5）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  responseSpeed: number; // 响应速度（1-5）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  technicalLevel: number; // 技术水平（1-5）

  @Column({ type: 'text', nullable: true })
  comment: string; // 评价内容

  @Column('simple-array', { nullable: true })
  photos: string[]; // 评价图片

  @Column({ type: 'boolean', default: false })
  isAnonymous: boolean; // 是否匿名

  @Column({ length: 50, default: 'positive' })
  sentiment: 'positive' | 'neutral' | 'negative'; // 情感倾向

  @Column({ type: 'boolean', default: false })
  isFollowupRequired: boolean; // 是否需要跟进

  @Column({ type: 'text', nullable: true })
  followupComment: string; // 跟进说明

  @Column({ nullable: true })
  followupById: string; // 跟进人 ID

  @Column({ length: 100, nullable: true })
  followupByName: string; // 跟进人姓名

  @Column({ nullable: true })
  followupDate: Date; // 跟进日期

  @Column({ nullable: true })
  submittedAt: Date; // 提交时间

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
