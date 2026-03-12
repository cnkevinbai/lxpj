import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 货运跟踪实体
 */
@Entity('shippings')
export class Shipping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  shippingNo: string; // 货运单号

  @Column({ nullable: true })
  orderId: string; // 关联订单 ID

  @Column({ length: 100, nullable: true })
  orderNo: string; // 订单号

  @Column({ length: 50 })
  shippingType: 'sea' | 'air' | 'rail' | 'express'; // 运输方式

  @Column({ length: 100 })
  shippingCompany: string; // 货运公司

  @Column({ length: 100, nullable: true })
  trackingNo: string; // 跟踪号

  @Column({ length: 200 })
  containerNo: string; // 集装箱号

  @Column({ length: 200 })
  sealNo: string; // 封条号

  @Column({ length: 200 })
  portOfLoading: string; // 装运港

  @Column({ length: 200 })
  portOfDestination: string; // 目的港

  @Column({ nullable: true })
  etd: Date; // 预计离港时间

  @Column({ nullable: true })
  eta: Date; // 预计到港时间

  @Column({ nullable: true })
  atd: Date; // 实际离港时间

  @Column({ nullable: true })
  ata: Date; // 实际到港时间

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'booked' | 'loaded' | 'departed' | 'in_transit' | 'arrived' | 'delivered';

  @Column('jsonb', { nullable: true })
  trackingEvents: any[]; // 跟踪事件

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  freightCost: number; // 运费

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  insuranceCost: number; // 保险费

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  customsCost: number; // 报关费

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number; // 总费用

  @Column({ nullable: true })
  forwarderId: string; // 货代 ID

  @Column({ length: 200, nullable: true })
  forwarderName: string; // 货代名称

  @Column({ length: 100, nullable: true })
  forwarderContact: string; // 货代联系人

  @Column({ length: 50, nullable: true })
  forwarderPhone: string; // 货代电话

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
