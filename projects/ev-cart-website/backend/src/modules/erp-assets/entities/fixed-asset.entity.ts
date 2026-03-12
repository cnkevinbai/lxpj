import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 固定资产实体
 * 完整的固定资产管理
 */
@Entity('fixed_assets')
export class FixedAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  assetCode: string; // 资产编码

  @Column({ length: 200 })
  assetName: string; // 资产名称

  @Column({ length: 50 })
  assetType: 'building' | 'machine' | 'vehicle' | 'equipment' | 'computer' | 'furniture' | 'other'; // 资产类型

  @Column({ length: 500, nullable: true })
  specification: string; // 规格型号

  @Column({ nullable: true })
  supplierId: string; // 供应商 ID

  @Column({ length: 200, nullable: true })
  supplierName: string; // 供应商名称

  // ========== 价值信息 ==========
  
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  originalValue: number; // 原值

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  accumulatedDepreciation: number; // 累计折旧

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netValue: number; // 净值

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5 })
  salvageRate: number; // 残值率（%）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  salvageValue: number; // 残值

  // ========== 折旧信息 ==========
  
  @Column({ length: 50, default: 'straight_line' })
  depreciationMethod: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production'; // 折旧方法

  @Column()
  usefulLife: number; // 使用年限（月）

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  monthlyDepreciation: number; // 月折旧额

  @Column({ nullable: true })
  depreciationStartDate: Date; // 折旧开始日期

  @Column({ nullable: true })
  depreciationEndDate: Date; // 折旧结束日期

  @Column({ default: false })
  isDepreciating: boolean; // 是否正在折旧

  // ========== 使用信息 ==========
  
  @Column({ length: 50, default: 'available' })
  status: 'available' | 'in_use' | 'maintenance' | 'retired' | 'disposed'; // 状态

  @Column({ nullable: true })
  departmentId: string; // 使用部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 使用部门

  @Column({ nullable: true })
  responsibleUserId: string; // 责任人 ID

  @Column({ length: 100, nullable: true })
  responsibleUserName: string; // 责任人

  @Column({ nullable: true })
  location: string; // 存放地点

  @Column({ nullable: true })
  purchaseDate: Date; // 购置日期

  @Column({ nullable: true })
  useStartDate: Date; // 启用日期

  // ========== 维护信息 ==========
  
  @Column({ nullable: true })
  lastMaintenanceDate: Date; // 最后维护日期

  @Column({ type: 'text', nullable: true })
  maintenanceRecord: string; // 维护记录

  @Column({ nullable: true })
  nextMaintenanceDate: Date; // 下次维护日期

  // ========== 备注 ==========
  
  @Column('text', { nullable: true })
  notes: string; // 备注

  @Column('simple-array', { nullable: true })
  images: string[]; // 图片

  // ========== 时间戳 ==========
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
