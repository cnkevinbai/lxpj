/**
 * 服务备件实体
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

@Entity('service_parts')
export class ServicePart {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index()
  partNo: string

  @Column({ type: 'varchar', length: 200 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'jsonb', nullable: true })
  applicableProducts?: string[]  // 适用产品

  @Column({ type: 'integer', default: 0 })
  stockQuantity: number

  @Column({ type: 'integer', default: 0 })
  safetyStock: number  // 安全库存

  @Column({ type: 'varchar', length: 20 })
  unit: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'varchar', length: 50 })
  warehouseLocation: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
