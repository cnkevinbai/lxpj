import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

/**
 * 采购订单实体
 */
@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  orderNo: string; // 采购订单号

  @ManyToOne(() => Supplier, supplier => supplier.orders)
  supplier: Supplier;

  @Column()
  supplierId: string;

  @Column({ length: 200 })
  supplierName: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'approved' | 'ordered' | 'partial_received' | 'completed' | 'cancelled';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ nullable: true })
  orderDate: Date; // 订单日期

  @Column({ nullable: true })
  deliveryDate: Date; // 交货日期

  @Column({ nullable: true })
  actualDeliveryDate: Date; // 实际交货日期

  @Column({ length: 500, nullable: true })
  deliveryAddress: string; // 交货地址

  @Column({ length: 50, nullable: true })
  paymentTerms: string; // 付款条件

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已付金额

  @Column({ length: 50, default: 'normal' })
  priority: 'urgent' | 'high' | 'normal' | 'low';

  @Column({ nullable: true })
  buyerId: string; // 采购员 ID

  @Column({ length: 100, nullable: true })
  buyerName: string; // 采购员姓名

  @Column({ nullable: true })
  approverId: string; // 审批人 ID

  @Column({ length: 100, nullable: true })
  approverName: string; // 审批人姓名

  @Column({ nullable: true })
  approvedAt: Date; // 审批时间

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder)
  items: PurchaseOrderItem[];
}
