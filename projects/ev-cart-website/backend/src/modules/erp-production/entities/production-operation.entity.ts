import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductionOrder } from './production-order.entity';

/**
 * 生产工序实体
 */
@Entity('production_operations')
export class ProductionOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductionOrder, order => order.operations)
  productionOrder: ProductionOrder;

  @Column()
  productionOrderId: string;

  @Column({ length: 100 })
  operationCode: string; // 工序编码

  @Column({ length: 200 })
  operationName: string; // 工序名称

  @Column({ default: 0 })
  sequence: number; // 工序顺序

  @Column({ nullable: true })
  workCenterId: string; // 工作中心 ID

  @Column({ length: 200, nullable: true })
  workCenterName: string; // 工作中心名称

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standardTime: number; // 标准工时（小时）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  actualTime: number; // 实际工时

  @Column({ default: 0 })
  quantity: number; // 工序数量

  @Column({ default: 0 })
  completedQuantity: number; // 已完成数量

  @Column({ default: 0 })
  defectiveQuantity: number; // 不良品数量

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  operatorId: string; // 操作员 ID

  @Column({ length: 100, nullable: true })
  operatorName: string; // 操作员姓名

  @Column({ nullable: true })
  startedAt: Date; // 开始时间

  @Column({ nullable: true })
  completedAt: Date; // 完成时间

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
