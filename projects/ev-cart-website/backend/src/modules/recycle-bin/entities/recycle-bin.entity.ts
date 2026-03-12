import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

export type EntityType =
  | 'lead'
  | 'customer'
  | 'opportunity'
  | 'order'
  | 'product'
  | 'purchase'
  | 'inventory'

@Entity('recycle_bin')
export class RecycleBin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  entityType: EntityType

  @Column({ type: 'uuid' })
  @Index()
  originalId: string

  @Column({ type: 'jsonb' })
  data: Record<string, any>

  @Column({ type: 'uuid' })
  @Index()
  deletedBy: string

  @Column({ type: 'varchar', length: 100 })
  deletedByName: string

  @Column({ type: 'varchar', length: 45 })
  ip: string

  @CreateDateColumn()
  @Index()
  deletedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  restoredAt?: Date

  @Column({ type: 'boolean', default: false })
  @Index()
  isRestored: boolean

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  permanentlyDeletedAt?: Date
}
