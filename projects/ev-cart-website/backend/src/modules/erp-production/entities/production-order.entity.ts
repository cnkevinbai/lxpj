import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductionOperation } from './production-operation.entity';

/**
 * 生产工单实体
 */
@Entity('production_orders')
export class ProductionOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  orderNo: string; // 工单号

  @Column({ nullable: true })
  salesOrderId: string; // 关联销售订单 ID

  @Column({ length: 100, nullable: true })
  salesOrderNo: string; // 销售订单号

  @Column()
  productId: string;

  @Column({ length: 200 })
  productName: string;

  @Column({ length: 100, nullable: true })
  productModel: string; // 产品型号

  @Column()
  quantity: number; // 生产数量

  @Column({ nullable: true })
  completedQuantity: number; // 已完成数量

  @Column({ nullable: true })
  defectiveQuantity: number; // 不良品数量

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'planned' | 'released' | 'in_progress' | 'completed' | 'closed' | 'cancelled';

  @Column({ length: 50, default: 'normal' })
  priority: 'urgent' | 'high' | 'normal' | 'low'; // 优先级

  @Column({ nullable: true })
  planStartDate: Date; // 计划开始日期

  @Column({ nullable: true })
  planEndDate: Date; // 计划结束日期

  @Column({ nullable: true })
  actualStartDate: Date; // 实际开始日期

  @Column({ nullable: true })
  actualEndDate: Date; // 实际结束日期

  @Column({ nullable: true })
  workshopId: string; // 车间 ID

  @Column({ length: 200, nullable: true })
  workshopName: string; // 车间名称

  @Column({ nullable: true })
  lineId: string; // 生产线 ID

  @Column({ length: 200, nullable: true })
  lineName: string; // 生产线名称

  @Column({ nullable: true })
  supervisorId: string; // 主管 ID

  @Column({ length: 100, nullable: true })
  supervisorName: string; // 主管姓名

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductionOperation, op => op.productionOrder)
  operations: ProductionOperation[];
}
