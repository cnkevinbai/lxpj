import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Customer } from './customer.entity';
import { ContractItem } from './contract-item.entity';

/**
 * 合同实体（国内 + 外贸）
 */
@Entity('contracts')
@Index(['customerId', 'status'])
@Index(['salespersonId', 'status'])
@Index(['contractType', 'status'])
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  contractNo: string; // 合同编号

  @Column({ length: 50, default: 'domestic' })
  contractType: 'domestic' | 'foreign'; // 合同类型

  @ManyToOne(() => Customer, customer => customer.opportunities)
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string; // 客户名称

  @Column({ length: 50 })
  type: 'sales' | 'purchase' | 'service' | 'distribution'; // 合同类型

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'expired'; // 状态

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 合同总金额

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  exchangeRate: number; // 汇率（外贸用）

  @Column({ nullable: true })
  signDate: Date; // 签订日期

  @Column({ nullable: true })
  startDate: Date; // 生效日期

  @Column({ nullable: true })
  endDate: Date; // 到期日期

  @Column({ nullable: true })
  deliveryDate: Date; // 交货日期

  // ========== 付款条款 ==========
  
  @Column({ length: 100, nullable: true })
  paymentTerms: string; // 付款条件

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  depositRate: number; // 定金比例

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  depositAmount: number; // 定金金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number; // 已付金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  remainingAmount: number; // 未付金额

  @Column({ nullable: true })
  lastPaymentDate: Date; // 最后付款日期

  // ========== 外贸专用 ==========
  
  @Column({ length: 50, nullable: true })
  incoterms: string; // 贸易术语

  @Column({ length: 200, nullable: true })
  portOfLoading: string; // 装运港

  @Column({ length: 200, nullable: true })
  portOfDestination: string; // 目的港

  @Column({ nullable: true })
  lcNo: string; // 信用证号

  @Column({ length: 200, nullable: true })
  lcBank: string; // 开证行

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  lcAmount: number; // 信用证金额

  @Column({ nullable: true })
  packingDate: Date; // 包装日期

  @Column({ nullable: true })
  inspectionDate: Date; // 商检日期

  @Column({ nullable: true })
  customsDate: Date; // 报关日期

  @Column({ length: 100, nullable: true })
  customsNo: string; // 报关单号

  // ========== 执行信息 ==========
  
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  deliveredAmount: number; // 已执行金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  deliveredRate: number; // 执行比例

  @Column({ nullable: true })
  completedDate: Date; // 完成日期

  @Column('text', { nullable: true })
  notes: string; // 备注

  // ========== 负责人 ==========
  
  @Column({ nullable: true })
  salespersonId: string; // 销售员 ID

  @Column({ length: 100, nullable: true })
  salespersonName: string; // 销售员姓名

  @Column({ nullable: true })
  assistantId: string; // 助理 ID

  @Column({ nullable: true })
  approverId: string; // 审批人 ID

  @Column({ nullable: true })
  approvedAt: Date; // 审批时间

  // ========== 附件 ==========
  
  @Column('simple-array', { nullable: true })
  attachments: string[]; // 附件

  @Column('text', { nullable: true })
  termsAndConditions: string; // 条款

  // ========== 时间戳 ==========
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联合同项
  @OneToMany(() => ContractItem, item => item.contract)
  items: ContractItem[];
}
