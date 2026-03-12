import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

/**
 * 供应商实体
 */
@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  supplierCode: string; // 供应商编码

  @Column({ length: 200 })
  supplierName: string; // 供应商名称

  @Column({ length: 50 })
  supplierType: 'manufacturer' | 'trader' | 'service'; // 供应商类型

  @Column({ length: 100, nullable: true })
  contactPerson: string; // 联系人

  @Column({ length: 50, nullable: true })
  contactPhone: string; // 联系电话

  @Column({ length: 100, nullable: true })
  contactEmail: string; // 联系邮箱

  @Column({ length: 500, nullable: true })
  address: string; // 地址

  @Column({ length: 100, nullable: true })
  city: string; // 城市

  @Column({ length: 100, nullable: true })
  province: string; // 省份

  @Column({ length: 100, nullable: true })
  country: string; // 国家

  @Column({ length: 100, nullable: true })
  website: string; // 网站

  @Column('text', { nullable: true })
  businessScope: string; // 经营范围

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'blacklisted'; // 状态

  @Column({ length: 50, default: 'A' })
  level: string; // 供应商等级（A/B/C/D）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditLimit: number; // 信用额度

  @Column({ length: 50, nullable: true })
  paymentTerms: string; // 付款条件

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityScore: number; // 质量评分（0-100）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  deliveryScore: number; // 交货评分（0-100）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  serviceScore: number; // 服务评分（0-100）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPurchaseAmount: number; // 总采购金额

  @Column({ default: 0 })
  totalOrders: number; // 总订单数

  @Column({ nullable: true })
  lastOrderDate: Date; // 最近订单日期

  @Column('text', { nullable: true })
  notes: string; // 备注

  @Column('simple-array', { nullable: true })
  certifications: string[]; // 资质证书

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PurchaseOrder, order => order.supplier)
  orders: PurchaseOrder[];
}
