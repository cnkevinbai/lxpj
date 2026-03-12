import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AccountingVoucher } from './accounting-voucher.entity';
import { AccountingSubject } from './accounting-subject.entity';

/**
 * 会计凭证项实体
 */
@Entity('accounting_voucher_items')
export class AccountingVoucherItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountingVoucher, voucher => voucher.items)
  voucher: AccountingVoucher;

  @Column()
  voucherId: string;

  @ManyToOne(() => AccountingSubject)
  subject: AccountingSubject;

  @Column()
  subjectId: string;

  @Column({ length: 200 })
  subjectCode: string; // 科目编码

  @Column({ length: 200 })
  subjectName: string; // 科目名称

  @Column({ length: 50 })
  direction: 'debit' | 'credit'; // 方向（借/贷）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number; // 金额

  @Column({ nullable: true })
  customerId: string; // 客户 ID（辅助核算）

  @Column({ length: 200, nullable: true })
  customerName: string; // 客户名称

  @Column({ nullable: true })
  supplierId: string; // 供应商 ID

  @Column({ length: 200, nullable: true })
  supplierName: string; // 供应商名称

  @Column({ nullable: true })
  employeeId: string; // 员工 ID

  @Column({ length: 100, nullable: true })
  employeeName: string; // 员工姓名

  @Column({ nullable: true })
  departmentId: string; // 部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 部门名称

  @Column({ nullable: true })
  projectId: string; // 项目 ID

  @Column({ length: 200, nullable: true })
  projectName: string; // 项目名称

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;
}
