import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Tree, TreeParent, TreeChildren, Index } from 'typeorm';
import { AccountingVoucher } from './accounting-voucher.entity';

/**
 * 会计科目实体（树形结构）
 */
@Entity('accounting_subjects')
@Tree('closure-table')
@Index(['subjectCode', 'status'])
export class AccountingSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  subjectCode: string; // 科目编码

  @Column({ length: 200 })
  subjectName: string; // 科目名称

  @Column({ length: 50 })
  subjectType: 'asset' | 'liability' | 'equity' | 'cost' | 'profit_loss'; // 科目类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column({ default: 0 })
  level: number; // 科目级次

  @TreeParent()
  parent: AccountingSubject;

  @TreeChildren()
  children: AccountingSubject[];

  @Column({ length: 500, nullable: true })
  fullName: string; // 完整路径名称

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number; // 余额

  @Column({ length: 50, default: 'debit' })
  balanceDirection: 'debit' | 'credit'; // 余额方向

  @Column({ type: 'boolean', default: false })
  isCashSubject: boolean; // 是否现金科目

  @Column({ type: 'boolean', default: false })
  isBankSubject: boolean; // 是否银行科目

  @Column({ type: 'boolean', default: false })
  canUse: boolean; // 是否可以使用

  @Column({ type: 'boolean', default: true })
  needAuxiliary: boolean; // 是否需要辅助核算

  @Column('simple-array', { nullable: true })
  auxiliaryTypes: string[]; // 辅助核算类型

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AccountingVoucher, voucher => voucher.subject)
  vouchers: AccountingVoucher[];
}
