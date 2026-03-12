import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 库存实体
 */
@Entity('inventory')
@Index(['warehouseId', 'materialId'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  warehouseId: string; // 仓库 ID

  @Column({ length: 200 })
  warehouseName: string; // 仓库名称

  @Column()
  materialId: string; // 物料 ID

  @Column({ length: 200 })
  materialCode: string; // 物料编码

  @Column({ length: 200 })
  materialName: string; // 物料名称

  @Column({ length: 100, nullable: true })
  materialModel: string; // 物料型号

  @Column({ length: 50 })
  unit: string; // 单位

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  onHandQuantity: number; // 在手数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  allocatedQuantity: number; // 已分配数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  availableQuantity: number; // 可用数量

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  onOrderQuantity: number; // 在途数量

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitCost: number; // 单位成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalValue: number; // 总价值

  @Column({ nullable: true })
  minQuantity: number; // 最小库存

  @Column({ nullable: true })
  maxQuantity: number; // 最大库存

  @Column({ nullable: true })
  safetyStock: number; // 安全库存

  @Column({ nullable: true })
  reorderPoint: number; // 再订货点

  @Column({ length: 50, default: 'normal' })
  status: 'normal' | 'low' | 'out_of_stock' | 'overstock'; // 库存状态

  @Column({ nullable: true })
  lastStocktakeDate: Date; // 最后盘点日期

  @Column({ nullable: true })
  lastPurchaseDate: Date; // 最后采购日期

  @Column({ nullable: true })
  lastSaleDate: Date; // 最后销售日期

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
