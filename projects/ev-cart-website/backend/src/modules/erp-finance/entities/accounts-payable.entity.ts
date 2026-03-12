import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 应付账款实体
 */
@Entity('accounts_payable')
export class AccountsPayable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  apNo: string; // 应付单号

  @Column({ nullable: true })
  purchaseOrderId: string; // 关联采购订单 ID

  @Column({ length: 100, nullable: true })
  purchaseOrderNo: string; // 采购订单号

  @Column()
  supplierId: string;

  @Column({ length: 200 })
  supplierName: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number; // 应付总额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已付金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number; // 未付余额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ nullable: true })
  invoiceDate: Date; // 发票日期

  @Column({ nullable: true })
  dueDate: Date; // 到期日期

  @Column({ nullable: true })
  lastPaymentDate: Date; // 最后付款日期

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lateFee: number; // 滞纳金

  @Column({ length: 50, default: 'current' })
  agingStatus: 'current' | '30_days' | '60_days' | '90_days' | 'over_90_days'; // 账龄状态

  @Column({ nullable: true })
  purchaserId: string; // 采购员 ID

  @Column({ length: 100, nullable: true })
  purchaserName: string; // 采购员姓名

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
