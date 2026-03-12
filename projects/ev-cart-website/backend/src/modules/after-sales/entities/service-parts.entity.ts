import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 服务配件实体
 */
@Entity('service_parts')
export class ServicePart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  partCode: string; // 配件编码

  @Column({ length: 200 })
  partName: string; // 配件名称

  @Column({ length: 100, nullable: true })
  partModel: string; // 配件型号

  @Column({ length: 50 })
  unit: string; // 单位

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number; // 单价

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costPrice: number; // 成本价

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  stockQuantity: number; // 库存数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  minStock: number; // 最小库存

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  maxStock: number; // 最大库存

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'discontinued' | 'out_of_stock';

  @Column({ nullable: true })
  supplierId: string; // 供应商 ID

  @Column({ length: 200, nullable: true })
  supplierName: string; // 供应商名称

  @Column({ nullable: true })
  leadTime: number; // 采购提前期（天）

  @Column({ length: 500, nullable: true })
  applicableProducts: string; // 适用产品

  @Column('text', { nullable: true })
  description: string; // 描述

  @Column('simple-array', { nullable: true })
  images: string[]; // 图片

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
