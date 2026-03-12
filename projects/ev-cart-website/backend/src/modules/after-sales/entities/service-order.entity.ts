import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ServiceOrderItem } from './service-order-item.entity';
import { ServiceFeedback } from './service-feedback.entity';

/**
 * 售后服务单实体
 * 完整的售后服务流程管理
 */
@Entity('service_orders')
export class ServiceOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  orderNo: string; // 服务单号

  @Column({ length: 50 })
  source: 'website' | 'app' | 'phone' | 'wechat' | 'email'; // 来源渠道

  // ========== 客户信息 ==========
  
  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 50 })
  contactPhone: string;

  @Column({ length: 100 })
  contactEmail: string;

  @Column({ length: 500 })
  contactAddress: string;

  // ========== 关联订单 ==========
  
  @Column({ nullable: true })
  salesOrderId: string; // 关联销售订单 ID

  @Column({ length: 100, nullable: true })
  salesOrderNo: string; // 销售订单号

  @Column({ nullable: true })
  productId: string; // 产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 产品名称

  @Column({ length: 100, nullable: true })
  productModel: string; // 产品型号

  @Column({ nullable: true })
  productSerialNo: string; // 产品序列号

  @Column({ nullable: true })
  purchaseDate: Date; // 购买日期

  @Column({ nullable: true })
  warrantyEndDate: Date; // 保修截止日期

  // ========== 服务信息 ==========
  
  @Column({ length: 50 })
  serviceType: 'repair' | 'maintenance' | 'installation' | 'training' | 'consultation' | 'complaint'; // 服务类型

  @Column({ length: 50 })
  serviceLevel: 'normal' | 'urgent' | 'critical'; // 服务级别

  @Column({ length: 500 })
  serviceRequest: string; // 服务请求/问题描述

  @Column('text', { nullable: true })
  faultDescription: string; // 故障描述

  @Column('simple-array', { nullable: true })
  faultImages: string[]; // 故障图片

  @Column({ nullable: true })
  appointmentTime: Date; // 预约时间

  // ========== 处理流程 ==========
  
  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'assigned' | 'accepted' | 'processing' | 'waiting_parts' | 
          'completed' | 'confirmed' | 'closed' | 'cancelled'; // 服务状态

  @Column({ nullable: true })
  assignedEngineerId: string; // 指派工程师 ID

  @Column({ length: 100, nullable: true })
  assignedEngineerName: string; // 工程师姓名

  @Column({ nullable: true })
  acceptedAt: Date; // 接单时间

  @Column({ nullable: true })
  arrivedAt: Date; // 到达时间

  @Column({ nullable: true })
  completedAt: Date; // 完成时间

  @Column({ nullable: true })
  confirmedAt: Date; // 客户确认时间

  @Column({ nullable: true })
  closedAt: Date; // 关闭时间

  // ========== 处理结果 ==========
  
  @Column('text', { nullable: true })
  faultCause: string; // 故障原因

  @Column('text', { nullable: true })
  solution: string; // 解决方案

  @Column('simple-array', { nullable: true })
  replacedParts: string[]; // 更换配件

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  laborCost: number; // 人工费

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  partsCost: number; // 配件费

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  travelCost: number; // 差旅费

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCost: number; // 总费用

  @Column({ length: 50, nullable: true })
  paymentStatus: 'unpaid' | 'partial' | 'paid'; // 付费状态

  // ========== 满意度 ==========
  
  @Column({ nullable: true })
  satisfactionScore: number; // 满意度评分 (1-5)

  @Column({ type: 'text', nullable: true })
  satisfactionComment: string; // 满意度评价

  @Column({ nullable: true })
  feedbackAt: Date; // 评价时间

  // ========== 备注 ==========
  
  @Column('text', { nullable: true })
  internalNote: string; // 内部备注

  @Column('text', { nullable: true })
  customerNote: string; // 客户备注

  // ========== 时间戳 ==========
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联服务项
  @OneToMany(() => ServiceOrderItem, item => item.serviceOrder)
  items: ServiceOrderItem[];

  // 关联服务反馈
  @OneToMany(() => ServiceFeedback, feedback => feedback.serviceOrder)
  feedbacks: ServiceFeedback[];
}
