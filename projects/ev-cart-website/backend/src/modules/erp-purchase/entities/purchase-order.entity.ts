import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * PurchaseOrder 实体
 */
@Entity('purchase-orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
