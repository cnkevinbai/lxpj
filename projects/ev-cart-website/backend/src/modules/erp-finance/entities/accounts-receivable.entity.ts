import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 应收账款实体
 */
@Entity('accounts_receivable')
export class AccountsReceivable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  arNo: string; // 应收单号

  @Column({ nullable: true })
  salesOrderId: string; // 关联销售订单 ID

  @Column({ length: 100, nullable: true })
  salesOrderNo: string; // 销售订单号

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number; // 应收总额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已收金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number; // 未收余额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ nullable: true })
  invoiceDate: Date; // 开票日期

  @Column({ nullable: true })
  dueDate: Date; // 到期日期

  @Column({ nullable: true })
  lastPaymentDate: Date; // 最后收款日期

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lateFee: number; // 滞纳金

  @Column({ length: 50, default: 'normal' })
  agingStatus: 'current' | '30_days' | '60_days' | '90_days' | 'over_90_days'; // 账龄状态

  @Column({ nullable: true })
  salespersonId: string; // 销售员 ID

  @Column({ length: 100, nullable: true })
  salespersonName: string; // 销售员姓名

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
