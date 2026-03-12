import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('system_settings')
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  category: string

  @Column({ length: 100 })
  keyName: string

  @Column({ type: 'text', nullable: true })
  valueText: string

  @Column({ type: 'jsonb', nullable: true })
  valueJson: object

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string

  @CreateDateColumn()
  updatedAt: Date
}
