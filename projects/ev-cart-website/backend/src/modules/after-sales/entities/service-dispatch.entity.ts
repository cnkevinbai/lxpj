import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { ServiceOrder } from './service-order.entity';

/**
 * 服务派单实体
 */
@Entity('service_dispatches')
@Index(['serviceOrderId', 'status'])
@Index(['engineerId', 'status'])
export class ServiceDispatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  dispatchNo: string; // 派单号

  @ManyToOne(() => ServiceOrder)
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: string;

  @Column({ length: 200 })
  serviceOrderNo: string; // 服务单号

  @Column({ nullable: true })
  engineerId: string; // 工程师 ID

  @Column({ length: 200, nullable: true })
  engineerName: string; // 工程师姓名

  @Column({ length: 100, nullable: true })
  engineerPhone: string; // 工程师电话

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'; // 状态

  @Column({ length: 50, default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'urgent'; // 优先级

  @Column({ nullable: true })
  dispatchTime: Date; // 派单时间

  @Column({ nullable: true })
  acceptTime: Date; // 接单时间

  @Column({ nullable: true })
  arrivalTime: Date; // 到达时间

  @Column({ nullable: true })
  completeTime: Date; // 完成时间

  @Column({ type: 'integer', default: 0 })
  responseMinutes: number; // 响应时间（分钟）

  @Column({ type: 'integer', default: 0 })
  resolutionMinutes: number; // 解决时间（分钟）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  customerRating: number; // 客户评分（1-5）

  @Column({ type: 'text', nullable: true })
  customerComment: string; // 客户评价

  @Column({ length: 500, nullable: true })
  serviceAddress: string; // 服务地址

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  serviceLatitude: number; // 服务地点纬度

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  serviceLongitude: number; // 服务地点经度

  @Column({ type: 'integer', default: 0 })
  travelDistance: number; // 出行距离（公里）

  @Column({ type: 'integer', default: 0 })
  travelTime: number; // 出行时间（分钟）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  travelCost: number; // 出行费用

  @Column({ type: 'text', nullable: true })
  dispatchRemark: string; // 派单备注

  @Column({ nullable: true })
  dispatchedById: string; // 派单人 ID

  @Column({ length: 100, nullable: true })
  dispatchedByName: string; // 派单人姓名

  @Column({ nullable: true })
  acceptedById: string; // 接单 人 ID

  @Column({ length: 100, nullable: true })
  acceptedByName: string; // 接单 人姓名

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
