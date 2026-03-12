import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('system_dictionary')
export class SystemDictionary {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  category: string

  @Column({ length: 100 })
  itemKey: string

  @Column({ length: 255 })
  itemValue: string

  @Column({ default: 0 })
  sortOrder: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
