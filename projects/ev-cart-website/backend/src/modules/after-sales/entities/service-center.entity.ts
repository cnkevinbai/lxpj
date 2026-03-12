/**
 * 服务网点实体
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

export type CenterType =
  | 'self'          // 自营
  | 'authorized'    // 授权

@Entity('service_centers')
export class ServiceCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 })
  @Index()
  name: string

  @Column({ type: 'varchar', length: 30 })
  type: CenterType

  @Column({ type: 'varchar', length: 50 })
  @Index()
  province: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  city: string

  @Column({ type: 'varchar', length: 300 })
  address: string

  @Column({ type: 'varchar', length: 20 })
  phone: string

  @Column({ type: 'varchar', length: 100 })
  manager: string

  @Column({ type: 'varchar', length: 20 })
  managerPhone: string

  @Column({ type: 'jsonb', nullable: true })
  serviceScope?: string[]  // 服务范围

  @Column({ type: 'varchar', length: 100 })
  workingHours: string  // 工作时间

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  longitude: number  // 经度

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  latitude: number  // 纬度

  @Column({ type: 'integer', default: 0 })
  technicianCount: number  // 技术人员数量

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
