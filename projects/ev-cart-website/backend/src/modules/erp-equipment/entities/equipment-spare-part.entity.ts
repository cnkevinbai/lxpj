import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 备品备件实体
 */
@Entity('equipment_spare_parts')
@Index(['partCode', 'status'])
@Index(['category', 'status'])
export class EquipmentSparePart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  partCode: string; // 配件编码

  @Column({ length: 200 })
  partName: string; // 配件名称

  @Column({ length: 100, nullable: true })
  partModel: string; // 配件型号

  @Column({ length: 50 })
  category: string; // 配件分类

  @Column({ length: 200, nullable: true })
  categoryName: string; // 分类名称

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'discontinued'; // 状态

  @Column({ length: 200, nullable: true })
  applicableEquipment: string; // 适用设备

  @Column('simple-array', { nullable: true })
  applicableEquipmentIds: string[]; // 适用设备 ID 列表

  @Column({ length: 50, nullable: true })
  unit: string; // 单位

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  stockQuantity: number; // 库存数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  minStock: number; // 最低库存

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  maxStock: number; // 最高库存

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  safetyStock: number; // 安全库存

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number; // 单价

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalValue: number; // 总价值

  @Column({ length: 200, nullable: true })
  supplier: string; // 供应商

  @Column({ length: 100, nullable: true })
  supplierContact: string; // 供应商联系

  @Column({ type: 'integer', default: 0 })
  leadTime: number; // 采购提前期（天）

  @Column({ type: 'integer', default: 0 })
  usageCount: number; // 使用次数

  @Column({ type: 'datetime', nullable: true })
  lastUsageDate: Date; // 最后使用日期

  @Column({ type: 'datetime', nullable: true })
  lastPurchaseDate: Date; // 最后采购日期

  @Column({ type: 'datetime', nullable: true })
  nextPurchaseDate: Date; // 下次采购日期

  @Column('text', { nullable: true })
  specification: string; // 规格参数

  @Column('text', { nullable: true })
  remark: string; // 备注

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
