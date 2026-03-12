import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 应付账款明细实体
 */
@Entity('accounts_payable_details')
@Index(['supplierId', 'status'])
@Index(['orderId', 'orderType'])
export class AccountsPayableDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  apNo: string; // 应付单号

  @Column()
  supplierId: string; // 供应商 ID

  @Column({ length: 200 })
  supplierName: string; // 供应商名称

  @Column({ length: 50 })
  orderType: 'purchase' | 'other'; // 订单类型

  @Column({ nullable: true })
  orderId: string; // 关联订单 ID

  @Column({ length: 100, nullable: true })
  orderNo: string; // 关联订单号

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off'; // 状态

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 应付总额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number; // 税额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已付金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number; // 未付余额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  exchangeRate: number; // 汇率

  @Column({ nullable: true })
  invoiceDate: Date; // 发票日期

  @Column({ nullable: true })
  invoiceNo: string; // 发票号

  @Column({ nullable: true })
  dueDate: Date; // 到期日期

  @Column({ type: 'integer', default: 0 })
  overdueDays: number; // 逾期天数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lateFee: number; // 滞纳金

  @Column({ nullable: true })
  lastPaymentDate: Date; // 最后付款日期

  @Column({ nullable: true })
  purchaserId: string; // 采购员 ID

  @Column({ length: 100, nullable: true })
  purchaserName: string; // 采购员姓名

  @Column({ nullable: true })
  departmentId: string; // 部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 部门名称

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
