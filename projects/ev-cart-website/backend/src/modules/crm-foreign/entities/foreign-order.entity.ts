import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 外贸订单实体
 */
@Entity('foreign_orders')
export class ForeignOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  orderNo: string; // 订单号

  @Column({ nullable: true })
  quoteId: string; // 关联报价单 ID

  @Column({ length: 100, nullable: true })
  quoteNo: string; // 报价单号

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'confirmed' | 'producing' | 'ready' | 'shipped' | 'completed' | 'cancelled';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ length: 50, default: 'USD' })
  currency: string; // 币种

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  exchangeRate: number; // 汇率

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amountCNY: number; // 人民币金额

  @Column({ length: 50, default: 'FOB' })
  incoterms: string; // 贸易术语

  @Column({ length: 200, nullable: true })
  portOfLoading: string; // 装运港

  @Column({ length: 200, nullable: true })
  portOfDestination: string; // 目的港

  @Column({ nullable: true })
  orderDate: Date; // 订单日期

  @Column({ nullable: true })
  deliveryDate: Date; // 交货日期

  @Column({ nullable: true })
  shippedDate: Date; // 发货日期

  @Column({ length: 100, nullable: true })
  shippingCompany: string; // 船运公司

  @Column({ length: 100, nullable: true })
  billOfLadingNo: string; // 提单号

  @Column({ length: 50, default: 'T/T' })
  paymentTerms: string; // 付款条件

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  depositAmount: number; // 定金金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number; // 尾款金额

  @Column({ nullable: true })
  lcNo: string; // 信用证号

  @Column({ nullable: true })
  lcBank: string; // 开证行

  @Column({ nullable: true })
  lcAmount: number; // 信用证金额

  @Column({ nullable: true })
  packingDate: Date; // 包装日期

  @Column({ nullable: true })
  inspectionDate: Date; // 商检日期

  @Column({ nullable: true })
  customsDate: Date; // 报关日期

  @Column({ length: 100, nullable: true })
  customsNo: string; // 报关单号

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
