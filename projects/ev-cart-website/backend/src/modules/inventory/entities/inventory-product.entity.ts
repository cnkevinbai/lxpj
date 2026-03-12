import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { InventoryTransaction } from './inventory-transaction.entity'

@Entity('inventory_products')
export class InventoryProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true })
  productCode: string

  @Column({ length: 200 })
  productName: string

  @Column({ length: 100, nullable: true })
  category: string

  @Column({ length: 255, nullable: true })
  specification: string

  @Column({ length: 20, default: '件' })
  unit: string

  @Column({ default: 0 })
  quantity: number

  @Column({ default: 0 })
  safeStock: number

  @Column({ default: 0 })
  minStock: number

  @Column({ default: 0 })
  maxStock: number

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  unitCost: number

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  unitPrice: number

  @Column({ type: 'uuid', nullable: true })
  warehouseId: string

  @Column({ length: 100, nullable: true })
  warehouseName: string

  @Column({ length: 100, nullable: true })
  location: string

  @Column({ type: 'uuid', nullable: true })
  supplierId: string

  @Column({ length: 200, nullable: true })
  supplierName: string

  @Column({ nullable: true })
  lastStockCheck: Date

  @Column({ default: 'active' })
  status: string

  @OneToMany(() => InventoryTransaction, (transaction) => transaction.product)
  transactions: InventoryTransaction[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
