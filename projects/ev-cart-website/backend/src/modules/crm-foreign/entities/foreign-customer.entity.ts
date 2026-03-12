import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ForeignContact } from './foreign-contact.entity';

/**
 * 外贸客户实体
 * 支持多语言、多币种、多时区
 */
@Entity('foreign_customers')
export class ForeignCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  customerCode: string; // 客户编码

  @Column({ length: 200 })
  customerName: string; // 客户名称（英文）

  @Column({ length: 200, nullable: true })
  customerNameLocal: string; // 客户名称（本地语言）

  @Column({ length: 50 })
  customerType: 'company' | 'individual' | 'government'; // 客户类型

  // ========== 联系信息 ==========
  
  @Column({ length: 200, nullable: true })
  contactPerson: string; // 联系人

  @Column({ length: 100, nullable: true })
  contactTitle: string; // 职位

  @Column({ length: 50, nullable: true })
  contactPhone: string; // 电话

  @Column({ length: 100, nullable: true })
  contactWhatsapp: string; // WhatsApp

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
  state: string; // 州/省

  @Column({ length: 100, nullable: true })
  postalCode: string; // 邮编

  @Column({ length: 100 })
  country: string; // 国家

  @Column({ length: 10, nullable: true })
  timezone: string; // 时区

  // ========== 业务信息 ==========
  
  @Column({ length: 50, nullable: true })
  industry: string; // 行业

  @Column({ length: 50, nullable: true })
  source: string; // 客户来源（展会/网站/推荐等）

  @Column({ length: 50, default: 'USD' })
  currency: string; // 默认币种

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditLimit: number; // 信用额度

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'blacklisted'; // 状态

  @Column({ length: 50, default: 'A' })
  level: string; // 客户等级（A/B/C/D）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalOrders: number; // 总订单数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number; // 总金额

  @Column({ nullable: true })
  lastOrderDate: Date; // 最近订单日期

  // ========== 备注 ==========
  
  @Column('text', { nullable: true })
  notes: string; // 备注

  @Column('simple-array', { nullable: true })
  tags: string[]; // 标签

  @Column({ nullable: true })
  ownerUserId: string; // 负责人 ID

  @Column({ length: 100, nullable: true })
  ownerUserName: string; // 负责人姓名

  // ========== 时间戳 ==========
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联联系人
  @OneToMany(() => ForeignContact, contact => contact.customer)
  contacts: ForeignContact[];
}
