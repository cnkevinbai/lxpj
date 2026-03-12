import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ForeignQuoteItem } from './foreign-quote-item.entity';

/**
 * 外贸报价单实体
 */
@Entity('foreign_quotes')
export class ForeignQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  quoteNo: string; // 报价单号

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ length: 50, default: 'USD' })
  currency: string; // 币种

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  exchangeRate: number; // 汇率

  @Column({ length: 50, default: 'FOB' })
  incoterms: string; // 贸易术语（FOB/CIF/CNF 等）

  @Column({ length: 200, nullable: true })
  portOfLoading: string; // 装运港

  @Column({ length: 200, nullable: true })
  portOfDestination: string; // 目的港

  @Column({ nullable: true })
  validityDate: Date; // 有效期

  @Column({ nullable: true })
  deliveryDate: Date; // 交货期

  @Column({ length: 50, default: 'T/T' })
  paymentTerms: string; // 付款条件

  @Column({ nullable: true })
  sentDate: Date; // 发送日期

  @Column({ nullable: true })
  viewedDate: Date; // 客户查看日期

  @Column({ nullable: true })
  acceptedDate: Date; // 接受日期

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

  @OneToMany(() => ForeignQuoteItem, item => item.quote)
  items: ForeignQuoteItem[];
}
