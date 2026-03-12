import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

/**
 * 货币实体
 * 支持多币种结算、汇率管理
 */
@Entity('currencies')
export class Currency {
  @PrimaryColumn({ length: 3 })
  code: string // USD, EUR, CNY, etc.

  @Column({ length: 50 })
  name: string // 美元，欧元，人民币

  @Column({ length: 10 })
  symbol: string // $, €, ¥

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 1 })
  @Index()
  rateToCNY: number // 对人民币汇率

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 1 })
  rateToUSD: number // 对美元汇率

  @Column({ length: 10, default: 'CNY' })
  baseCurrency: string // 基础货币

  @Column({ type: 'boolean', default: true })
  enabled: boolean // 是否启用

  @Column({ type: 'int', default: 0 })
  precision: number // 小数位数

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any> // 额外信息（国家、地区等）

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

/**
 * 汇率历史记录
 */
@Entity('currency_rates_history')
export class CurrencyRateHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 3 })
  @Index()
  fromCurrency: string

  @Column({ length: 3 })
  @Index()
  toCurrency: string

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  rate: number

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  inverseRate?: number

  @Column({ length: 50, nullable: true })
  source?: string // 汇率来源（银行、API 等）

  @Column({ type: 'timestamp' })
  @Index()
  rateDate: Date

  @Column({ type: 'text', nullable: true })
  remark?: string

  @CreateDateColumn()
  createdAt: Date
}
