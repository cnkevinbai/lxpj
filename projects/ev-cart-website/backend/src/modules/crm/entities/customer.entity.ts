import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Contact } from './contact.entity';
import { Opportunity } from './opportunity.entity';
import { ForeignOrder } from '../../crm-foreign/entities/foreign-order.entity';

/**
 * 统一客户实体（国内 + 外贸）
 */
@Entity('customers')
@Index(['customerType', 'status'])
@Index(['salespersonId', 'status'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  customerCode: string; // 客户编码

  @Column({ length: 50, default: 'domestic' })
  customerType: 'domestic' | 'foreign'; // 客户类型（国内/外贸）

  @Column({ length: 200 })
  customerName: string; // 客户名称

  @Column({ length: 200, nullable: true })
  customerNameLocal: string; // 本地语言名称（外贸用）

  @Column({ length: 50 })
  companyType: 'company' | 'individual' | 'government' | 'other'; // 公司类型

  @Column({ length: 100, nullable: true })
  industry: string; // 行业

  @Column({ length: 100, nullable: true })
  source: string; // 客户来源

  // ========== 联系信息 ==========
  
  @Column({ length: 100, nullable: true })
  contactPerson: string; // 联系人

  @Column({ length: 50, nullable: true })
  contactTitle: string; // 职位

  @Column({ length: 50, nullable: true })
  contactPhone: string; // 电话

  @Column({ length: 100, nullable: true })
  contactWhatsapp: string; // WhatsApp（外贸用）

  @Column({ length: 100, nullable: true })
  contactWechat: string; // 微信

  @Column({ length: 200, nullable: true })
  contactEmail: string; // 邮箱

  @Column({ length: 500, nullable: true })
  website: string; // 网站

  // ========== 地址信息 ==========
  
  @Column({ length: 500, nullable: true })
  address: string; // 地址

  @Column({ length: 100, nullable: true })
  city: string; // 城市

  @Column({ length: 100, nullable: true })
  province: string; // 省份

  @Column({ length: 100, nullable: true })
  postalCode: string; // 邮编

  @Column({ length: 100 })
  country: string; // 国家

  @Column({ length: 50, nullable: true })
  timezone: string; // 时区（外贸用）

  // ========== 业务信息 ==========
  
  @Column({ length: 50, default: 'A' })
  level: string; // 客户等级

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'blacklisted' | 'potential'; // 状态

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 默认币种

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditLimit: number; // 信用额度

  @Column({ length: 100, nullable: true })
  paymentTerms: string; // 付款条件

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalOrders: number; // 总订单数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  receivableAmount: number; // 应收金额

  @Column({ nullable: true })
  lastOrderDate: Date; // 最近订单日期

  @Column({ nullable: true })
  lastContactDate: Date; // 最近联系日期

  // ========== 外贸专用 ==========
  
  @Column({ length: 50, nullable: true })
  incoterms: string; // 贸易术语（FOB/CIF 等）

  @Column({ length: 200, nullable: true })
  portOfLoading: string; // 装运港

  @Column({ length: 200, nullable: true })
  portOfDestination: string; // 目的港

  @Column({ length: 100, nullable: true })
  bankName: string; // 银行名称

  @Column({ length: 100, nullable: true })
  bankAccount: string; // 银行账号

  @Column({ length: 100, nullable: true })
  swiftCode: string; // SWIFT 代码

  @Column({ length: 100, nullable: true })
  taxNo: string; // 税号

  @Column({ length: 100, nullable: true })
  importLicense: string; // 进口许可证

  // ========== 负责人 ==========
  
  @Column({ nullable: true })
  salespersonId: string; // 销售员 ID

  @Column({ length: 100, nullable: true })
  salespersonName: string; // 销售员姓名

  @Column({ nullable: true })
  assistantId: string; // 助理 ID

  @Column({ length: 100, nullable: true })
  assistantName: string; // 助理姓名

  // ========== 备注 ==========
  
  @Column('text', { nullable: true })
  notes: string; // 备注

  @Column('simple-array', { nullable: true })
  tags: string[]; // 标签

  @Column('simple-array', { nullable: true })
  certifications: string[]; // 资质证书

  // ========== 时间戳 ==========
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联联系人
  @OneToMany(() => Contact, contact => contact.customer)
  contacts: Contact[];

  // 关联商机
  @OneToMany(() => Opportunity, opportunity => opportunity.customer)
  opportunities: Opportunity[];

  // 关联外贸订单
  @OneToMany(() => ForeignOrder, order => order.customerId)
  foreignOrders: ForeignOrder[];
}
