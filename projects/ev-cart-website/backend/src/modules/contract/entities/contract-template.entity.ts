/**
 * 合同模板实体
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

@Entity('contract_templates')
export class ContractTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 })
  @Index()
  name: string

  @Column({ type: 'varchar', length: 50 })
  @Index()
  type: string

  @Column({ type: 'text' })
  content: string  // 模板内容 (含变量占位符)

  @Column({ type: 'jsonb', nullable: true })
  variables?: TemplateVariable[]  // 变量定义

  @Column({ type: 'jsonb', nullable: true })
  clauses?: TemplateClause[]  // 标准条款

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'integer', default: 1 })
  version: number

  @Column({ type: 'uuid', nullable: true })
  parentTemplateId?: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 100 })
  createdBy: string

  @Column({ type: 'varchar', length: 100 })
  updatedBy: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export interface TemplateVariable {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select'
  required: boolean
  defaultValue?: any
  options?: string[]
}

export interface TemplateClause {
  id: string
  title: string
  content: string
  required: boolean
  order: number
}
