import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';

/**
 * 应收账款明细实体
 */
@Entity('accounts_receivable_details')
@Index(['customerId', 'status'])
@Index(['orderId', 'orderType'])
export class AccountsReceivableDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  arNo: string; // 应收单号

  @Column()
  customerId: string; // 客户 ID

  @Column({ length: 200 })
  customerName: string; // 客户名称

  @Column({ length: 50 })
  orderType: 'sales' | 'other'; // 订单类型

  @Column({ nullable: true })
  orderId: string; // 关联订单 ID

  @Column({ length: 100, nullable: true })
  orderNo: string; // 关联订单号

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off'; // 状态

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 应收总额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number; // 税额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已收金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number; // 未收余额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  exchangeRate: number; // 汇率

  @Column({ nullable: true })
  invoiceDate: Date; // 开票日期

  @Column({ nullable: true })
  invoiceNo: string; // 发票号

  @Column({ nullable: true })
  dueDate: Date; // 到期日期

  @Column({ type: 'integer', default: 0 })
  overdueDays: number; // 逾期天数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lateFee: number; // 滞纳金

  @Column({ nullable: true })
  lastPaymentDate: Date; // 最后收款日期

  @Column({ nullable: true })
  salespersonId: string; // 销售员 ID

  @Column({ length: 100, nullable: true })
  salespersonName: string; // 销售员姓名

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
