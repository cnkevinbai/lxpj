import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 权限实体
 */
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 100 })
  name: string // 权限名称

  @Column({ length: 200, nullable: true })
  description: string // 权限描述

  @Column({ length: 50 })
  module: string // 所属模块

  @Column({ length: 50 })
  action: string // 操作类型：create, read, update, delete

  @Column({ length: 50, default: 'both' })
  businessType: string // domestic, foreign, both

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
