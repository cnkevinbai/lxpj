import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

/**
 * 统一客户数据模型
 * 整合 CRM 和 ERP 的客户数据，提供 360° 客户视图
 */
@Entity('unified_customers')
export class UnifiedCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ========== 基础信息 ==========
  
  @Column({ length: 50, unique: true })
  customerCode: string; // 统一客户编码

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 50 })
  customerType: 'individual' | 'enterprise' | 'government'; // 客户类型

  @Column({ length: 100, nullable: true })
  industry: string; // 行业

  @Column({ length: 50, nullable: true })
  source: string; // 客户来源（官网/展会/推荐等）

  // ========== 联系信息 ==========
  
  @Column({ length: 100, nullable: true })
  contactPerson: string;

  @Column({ length: 50, nullable: true })
  contactPhone: string;

  @Column({ length: 100, nullable: true })
  contactEmail: string;

  @Column({ length: 50, nullable: true })
  contactTitle: string; // 职位

  @Column('text', { nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 20, nullable: true })
  postalCode: string;

  // ========== CRM 数据 ==========
  
  @Column({ nullable: true })
  crmCustomerId: string; // CRM 客户 ID

  @Column({ nullable: true })
  crmOwnerId: string; // CRM 负责人 ID

  @Column({ length: 50, nullable: true })
  crmStatus: string; // CRM 客户状态

  @Column({ nullable: true })
  crmLeadScore: number; // 线索评分

  @Column('text', { nullable: true })
  crmTags: string[]; // CRM 标签

  @Column('text', { nullable: true })
  crmNotes: string; // CRM 备注

  // ========== ERP 数据 ==========
  
  @Column({ nullable: true })
  erpCustomerId: string; // ERP 客户 ID

  @Column({ length: 50, nullable: true })
  erpCustomerCode: string; // ERP 客户编码

  @Column({ length: 50, nullable: true })
  erpCreditLevel: string; // ERP 信用等级

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  erpCreditLimit: number; // ERP 信用额度

  @Column({ length: 50, nullable: true })
  erpPaymentTerms: string; // ERP 付款条件

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  erpOutstandingBalance: number; // ERP 未结余额

  // ========== 统计数据 ==========
  
  @Column({ default: 0 })
  totalOpportunities: number; // 总商机数

  @Column({ default: 0 })
  wonOpportunities: number; // 赢单商机数

  @Column({ default: 0 })
  totalOrders: number; // 总订单数

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number; // 总营收

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lastOrderAmount: number; // 最近订单金额

  @Column({ nullable: true })
  lastOrderDate: Date; // 最近订单日期

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lifetimeValue: number; // 客户终身价值

  // ========== 互动数据 ==========
  
  @Column({ default: 0 })
  totalInteractions: number; // 总互动次数

  @Column({ nullable: true })
  lastInteractionDate: Date; // 最近互动时间

  @Column({ type: 'text', nullable: true })
  lastInteractionType: string; // 最近互动类型

  @Column({ default: 0 })
  websiteVisits: number; // 网站访问次数

  @Column({ nullable: true })
  lastWebsiteVisit: Date; // 最近网站访问

  // ========== 状态 ==========
  
  @Column({ length: 20, default: 'active' })
  status: 'active' | 'inactive' | 'blacklisted';

  @Column({ nullable: true })
  blacklistedReason: string; // 拉黑原因

  @Column({ default: false })
  isVip: boolean; // 是否 VIP

  @Column({ nullable: true })
  vipLevel: string; // VIP 等级

  @Column({ default: false })
  isDeleted: boolean; // 软删除

  // ========== 时间戳 ==========
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  mergedAt: Date; // 数据合并时间

  @Column({ nullable: true })
  lastSyncedAt: Date; // 最后同步时间
}
