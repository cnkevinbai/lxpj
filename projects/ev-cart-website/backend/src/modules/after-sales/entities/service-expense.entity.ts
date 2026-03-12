import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { ServiceOrder } from './service-order.entity';

/**
 * 服务费用实体
 */
@Entity('service_expenses')
@Index(['serviceOrderId', 'billingStatus'])
export class ServiceExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  expenseNo: string; // 费用号

  @ManyToOne(() => ServiceOrder)
  serviceOrder: ServiceOrder;

  @Column()
  serviceOrderId: string;

  @Column({ length: 200 })
  serviceOrderNo: string; // 服务单号

  @Column({ length: 50 })
  expenseType: 'labor' | 'parts' | 'travel' | 'other'; // 费用类型

  @Column({ length: 200 })
  expenseName: string; // 费用名称

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number; // 金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number; // 税额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 含税总额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ length: 50, default: 'pending' })
  billingStatus: 'pending' | 'billed' | 'paid' | 'cancelled'; // 结算状态

  @Column({ nullable: true })
  invoiceNo: string; // 发票号

  @Column({ nullable: true })
  invoiceDate: Date; // 发票日期

  @Column({ nullable: true })
  paidDate: Date; // 付款日期

  @Column({ nullable: true })
  paymentMethod: string; // 付款方式

  @Column({ nullable: true })
  customerId: string; // 客户 ID

  @Column({ length: 200, nullable: true })
  customerName: string; // 客户姓名

  @Column({ type: 'boolean', default: false })
  isWarranty: boolean; // 是否保修

  @Column({ type: 'text', nullable: true })
  warrantyRemark: string; // 保修说明

  @Column({ nullable: true })
  billedById: string; // 开票人 ID

  @Column({ length: 100, nullable: true })
  billedByName: string; // 开票人姓名

  @Column({ nullable: true })
  billedDate: Date; // 开票日期

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
