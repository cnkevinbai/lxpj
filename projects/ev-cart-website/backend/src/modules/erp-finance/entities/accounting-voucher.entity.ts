import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { AccountingVoucherItem } from './accounting-voucher-item.entity';
import { AccountingSubject } from './accounting-subject.entity';

/**
 * 会计凭证实体
 */
@Entity('accounting_vouchers')
@Index(['voucherNo', 'status'])
@Index(['voucherDate', 'status'])
export class AccountingVoucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  voucherNo: string; // 凭证号

  @Column({ length: 50 })
  voucherType: 'receipt' | 'payment' | 'transfer'; // 凭证类型（收款/付款/转账）

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'audited' | 'posted' | 'cancelled'; // 状态

  @Column()
  voucherDate: Date; // 凭证日期

  @Column({ nullable: true })
  businessDate: Date; // 业务日期

  @Column({ length: 200 })
  summary: string; // 摘要

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ type: 'integer', default: 0 })
  attachmentCount: number; // 附件数

  @Column({ nullable: true })
  preparedById: string; // 制单人 ID

  @Column({ length: 100, nullable: true })
  preparedByName: string; // 制单人姓名

  @Column({ nullable: true })
  preparedDate: Date; // 制单日期

  @Column({ nullable: true })
  auditedById: string; // 审核人 ID

  @Column({ length: 100, nullable: true })
  auditedByName: string; // 审核人姓名

  @Column({ nullable: true })
  auditedDate: Date; // 审核日期

  @Column({ nullable: true })
  postedById: string; // 过账人 ID

  @Column({ length: 100, nullable: true })
  postedByName: string; // 过账人姓名

  @Column({ nullable: true })
  postedDate: Date; // 过账日期

  @Column({ nullable: true })
  relatedOrderId: string; // 关联业务单 ID

  @Column({ length: 50, nullable: true })
  relatedType: string; // 关联业务类型

  @Column({ length: 100, nullable: true })
  relatedNo: string; // 关联业务单号

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AccountingSubject)
  subject: AccountingSubject;

  @OneToMany(() => AccountingVoucherItem, item => item.voucher)
  items: AccountingVoucherItem[];
}
