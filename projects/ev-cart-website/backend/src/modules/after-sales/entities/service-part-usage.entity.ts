import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { ServiceOrder } from './service-order.entity';

/**
 * 服务配件使用实体
 */
@Entity('service_part_usages')
@Index(['serviceOrderId', 'partId'])
export class ServicePartUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  usageNo: string; // 使用号

  @ManyToOne(() => ServiceOrder)
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: string;

  @Column({ length: 200 })
  serviceOrderNo: string; // 服务单号

  @Column()
  partId: string; // 配件 ID

  @Column({ length: 200 })
  partCode: string; // 配件编码

  @Column({ length: 200 })
  partName: string; // 配件名称

  @Column({ length: 100, nullable: true })
  partModel: string; // 配件型号

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  quantity: number; // 使用数量

  @Column({ length: 50, nullable: true })
  unit: string; // 单位

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number; // 单价

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ length: 50, default: 'warranty' })
  usageType: 'warranty' | 'chargeable' | 'free'; // 使用类型

  @Column({ nullable: true })
  usedTime: Date; // 使用时间

  @Column({ nullable: true })
  usedById: string; // 使用人 ID

  @Column({ length: 100, nullable: true })
  usedByName: string; // 使用人姓名

  @Column({ type: 'text', nullable: true })
  usageReason: string; // 使用原因

  @Column({ type: 'text', nullable: true })
  replacementReason: string; // 更换原因

  @Column({ nullable: true })
  oldPartId: string; // 旧配件 ID

  @Column({ length: 100, nullable: true })
  oldPartCode: string; // 旧配件编码

  @Column({ type: 'boolean', default: false })
  isReturnOld: boolean; // 是否退回旧件

  @Column({ type: 'text', nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
