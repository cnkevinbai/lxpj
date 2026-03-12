import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ServiceOrder } from './service-order.entity';

/**
 * 售后服务项实体
 * 记录服务过程中的具体操作项
 */
@Entity('service_order_items')
export class ServiceOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceOrder, order => order.items)
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: string;

  @Column({ length: 100 })
  itemName: string; // 服务项名称

  @Column({ length: 50 })
  itemType: 'diagnosis' | 'repair' | 'replacement' | 'maintenance' | 'inspection' | 'other'; // 服务项类型

  @Column('text', { nullable: true })
  description: string; // 服务项描述

  @Column({ nullable: true })
  quantity: number; // 数量

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unitPrice: number; // 单价

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ nullable: true })
  engineerId: string; // 处理工程师 ID

  @Column({ length: 100, nullable: true })
  engineerName: string; // 工程师姓名

  @Column({ nullable: true })
  startedAt: Date; // 开始时间

  @Column({ nullable: true })
  completedAt: Date; // 完成时间

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'; // 状态

  @Column('text', { nullable: true })
  note: string; // 备注

  @CreateDateColumn()
  createdAt: Date;
}
