/**
 * 税务管理服务
 * 税种设置、税金计算、纳税申报、发票税务
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum TaxType {
  VAT = 'VAT', // 增值税
  INCOME_TAX = 'INCOME_TAX', // 企业所得税
  PERSONAL_INCOME = 'PERSONAL_INCOME', // 个人所得税
  SURCHARGE = 'SURCHARGE', // 附加税
  STAMP_DUTY = 'STAMP_DUTY', // 印花税
  PROPERTY_TAX = 'PROPERTY_TAX', // 房产税
  LAND_TAX = 'LAND_TAX', // 土地使用税
  CONSUMPTION = 'CONSUMPTION', // 消费税
}

export enum TaxRate {
  VAT_GENERAL = 0.13, // 增值税一般税率 13%
  VAT_LOW = 0.09, // 增值税低税率 9%
  VAT_LOWEST = 0.06, // 增值税最低税率 6%
  VAT_SMALL = 0.03, // 小规模纳税人 3%
  INCOME_GENERAL = 0.25, // 企业所得税 25%
  INCOME_SMALL = 0.2, // 小型微利企业 20%
  INCOME_HIGH = 0.15, // 高新技术企业 15%
}

export enum DeclarationStatus {
  DRAFT = 'DRAFT', // 草稿
  SUBMITTED = 'SUBMITTED', // 已提交
  APPROVED = 'APPROVED', // 已通过
  REJECTED = 'REJECTED', // 已驳回
  PAID = 'PAID', // 已缴税
}

export enum TaxPeriod {
  MONTHLY = 'MONTHLY', // 月度
  QUARTERLY = 'QUARTERLY', // 季度
  YEARLY = 'YEARLY', // 年度
}

// ========== 导出接口类型 ==========

export interface TaxConfig {
  id: string
  taxType: TaxType
  taxTypeName: string
  rate: number // 税率
  calculationMethod: 'RATE' | 'FIXED' | 'PROGRESSIVE' // 计算方式

  // 进项税额抵扣
  deductible: boolean
  deductionRule?: string

  // 申报周期
  declarationPeriod: TaxPeriod
  declarationDeadline: number // 申报截止日（每月第几天）
  paymentDeadline: number // 缴税截止日

  // 优惠政策
  preferentialPolicy?: string
  preferentialRate?: number

  // 会计科目
  accountId?: string
  accountCode?: string

  status: 'ACTIVE' | 'INACTIVE'
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface TaxCalculation {
  id: string
  calculationCode: string
  taxType: TaxType
  period: string // 期间 YYYY-MM

  // 计税依据
  taxableAmount: number // 计税金额
  taxableType: 'SALES' | 'INCOME' | 'PROPERTY' // 计税类型

  // 税率
  appliedRate: number
  preferentialRate?: number

  // 税额
  calculatedTax: number // 计算税额
  deductionAmount: number // 抵扣金额
  payableTax: number // 应纳税额
  paidTax: number // 已缴税额

  // 关联
  relatedInvoices?: string[] // 关联发票

  status: 'PENDING' | 'CALCULATED' | 'DECLARED' | 'PAID'

  tenantId: string
  calculatedBy: string
  calculatedAt: Date
}

export interface TaxDeclaration {
  id: string
  declarationCode: string
  taxType: TaxType
  period: string // 申报期间 YYYY-MM

  // 申报信息
  taxableIncome: number // 应税收入
  taxAmount: number // 应纳税额
  deductionAmount: number // 减免金额
  actualTax: number // 实际应缴

  // 已缴信息
  prepaidTax?: number // 预缴税额
  supplementaryTax?: number // 补缴税额
  refundTax?: number // 退税金额

  // 时间
  declarationDate?: Date
  paymentDate?: Date

  // 状态
  status: DeclarationStatus

  // 附件
  attachments?: string[]

  // 备注
  notes?: string

  tenantId: string
  declaredBy: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceTaxInfo {
  id: string
  invoiceId: string
  invoiceCode: string
  invoiceNumber: string

  // 发票类型
  invoiceType: 'ORDINARY' | 'SPECIAL' // 普票/专票

  // 税务信息
  taxType: TaxType
  taxRate: number
  taxAmount: number

  // 进项/销项
  direction: 'INPUT' | 'OUTPUT' // 进项/销项

  // 抵扣
  deductible: boolean
  deductionAmount?: number

  // 认证
  certified: boolean
  certifiedDate?: Date

  // 期间
  period: string

  tenantId: string
  createdAt: Date
}

export interface TaxReminder {
  id: string
  taxType: TaxType
  reminderType: 'DECLARATION' | 'PAYMENT' // 申报/缴税
  period: string

  dueDate: Date
  daysRemaining: number

  isCompleted: boolean
  completedAt?: Date

  createdAt: Date
}

@Injectable()
export class TaxManagementService {
  // 税种配置存储
  private taxConfigs: Map<string, TaxConfig> = new Map()

  // 税金计算存储
  private taxCalculations: Map<string, TaxCalculation> = new Map()

  // 纳税申报存储
  private taxDeclarations: Map<string, TaxDeclaration> = new Map()

  // 发票税务信息存储
  private invoiceTaxInfos: Map<string, InvoiceTaxInfo> = new Map()

  // 税务提醒存储
  private taxReminders: Map<string, TaxReminder> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    // 示例税种配置
    const sampleConfigs: Partial<TaxConfig>[] = [
      {
        id: 'tax-config-001',
        taxType: TaxType.VAT,
        taxTypeName: '增值税',
        rate: 0.13,
        calculationMethod: 'RATE',
        deductible: true,
        declarationPeriod: TaxPeriod.MONTHLY,
        declarationDeadline: 15,
        paymentDeadline: 15,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tax-config-002',
        taxType: TaxType.INCOME_TAX,
        taxTypeName: '企业所得税',
        rate: 0.25,
        calculationMethod: 'PROGRESSIVE',
        deductible: false,
        declarationPeriod: TaxPeriod.QUARTERLY,
        declarationDeadline: 15,
        paymentDeadline: 15,
        preferentialPolicy: '高新技术企业优惠',
        preferentialRate: 0.15,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tax-config-003',
        taxType: TaxType.SURCHARGE,
        taxTypeName: '城市维护建设税',
        rate: 0.07,
        calculationMethod: 'RATE',
        deductible: false,
        declarationPeriod: TaxPeriod.MONTHLY,
        declarationDeadline: 15,
        paymentDeadline: 15,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleConfigs.forEach((config) => {
      this.taxConfigs.set(config.id!, config as TaxConfig)
    })

    // 示例纳税申报
    const sampleDeclarations: Partial<TaxDeclaration>[] = [
      {
        id: 'declaration-001',
        declarationCode: 'TAX-2026-03-001',
        taxType: TaxType.VAT,
        period: '2026-03',
        taxableIncome: 1500000,
        taxAmount: 195000,
        deductionAmount: 85000,
        actualTax: 110000,
        status: DeclarationStatus.PAID,
        paymentDate: new Date('2026-04-10'),
        tenantId: 'tenant-001',
        declaredBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleDeclarations.forEach((dec) => {
      this.taxDeclarations.set(dec.id!, dec as TaxDeclaration)
    })
  }

  // ========== 税种配置管理 ==========

  async getTaxConfigs(params?: { taxType?: TaxType; status?: string }) {
    let list = Array.from(this.taxConfigs.values())
    if (params?.taxType) {
      list = list.filter((c) => c.taxType === params.taxType)
    }
    if (params?.status) {
      list = list.filter((c) => c.status === params.status)
    }
    return list
  }

  async getTaxConfig(id: string): Promise<TaxConfig | null> {
    return this.taxConfigs.get(id) || null
  }

  async createTaxConfig(config: Partial<TaxConfig>): Promise<TaxConfig> {
    const id = `tax-config-${Date.now()}`

    const newConfig: TaxConfig = {
      id,
      taxType: config.taxType!,
      taxTypeName: config.taxTypeName!,
      rate: config.rate || 0,
      calculationMethod: config.calculationMethod || 'RATE',
      deductible: config.deductible || false,
      declarationPeriod: config.declarationPeriod || TaxPeriod.MONTHLY,
      declarationDeadline: config.declarationDeadline || 15,
      paymentDeadline: config.paymentDeadline || 15,
      preferentialPolicy: config.preferentialPolicy,
      preferentialRate: config.preferentialRate,
      accountId: config.accountId,
      accountCode: config.accountCode,
      status: 'ACTIVE',
      tenantId: config.tenantId || 'tenant-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.taxConfigs.set(id, newConfig)
    return newConfig
  }

  // ========== 税金计算 ==========

  async calculateTax(params: {
    taxType: TaxType
    period: string
    taxableAmount: number
    taxableType: 'SALES' | 'INCOME' | 'PROPERTY'
    deductionAmount?: number
  }): Promise<TaxCalculation> {
    const config = Array.from(this.taxConfigs.values()).find((c) => c.taxType === params.taxType)
    if (!config) throw new Error('税种配置不存在')

    const id = `calc-${Date.now()}`
    const calculationCode = `CALC-${params.period}-${String(this.taxCalculations.size + 1).padStart(3, '0')}`

    const rate = config.preferentialRate || config.rate
    const calculatedTax = params.taxableAmount * rate
    const deductionAmount = params.deductionAmount || 0
    const payableTax = Math.max(0, calculatedTax - deductionAmount)

    const calculation: TaxCalculation = {
      id,
      calculationCode,
      taxType: params.taxType,
      period: params.period,
      taxableAmount: params.taxableAmount,
      taxableType: params.taxableType,
      appliedRate: rate,
      preferentialRate: config.preferentialRate,
      calculatedTax,
      deductionAmount,
      payableTax,
      paidTax: 0,
      status: 'CALCULATED',
      tenantId: 'tenant-001',
      calculatedBy: 'admin',
      calculatedAt: new Date(),
    }

    this.taxCalculations.set(id, calculation)
    return calculation
  }

  async getTaxCalculations(params?: { taxType?: TaxType; period?: string; status?: string }) {
    let list = Array.from(this.taxCalculations.values())
    if (params?.taxType) {
      list = list.filter((c) => c.taxType === params.taxType)
    }
    if (params?.period) {
      list = list.filter((c) => c.period === params.period)
    }
    if (params?.status) {
      list = list.filter((c) => c.status === params.status)
    }
    return list.sort((a, b) => b.calculatedAt.getTime() - a.calculatedAt.getTime())
  }

  // ========== 纳税申报 ==========

  async getTaxDeclarations(params?: {
    taxType?: TaxType
    period?: string
    status?: DeclarationStatus
  }) {
    let list = Array.from(this.taxDeclarations.values())
    if (params?.taxType) {
      list = list.filter((d) => d.taxType === params.taxType)
    }
    if (params?.period) {
      list = list.filter((d) => d.period === params.period)
    }
    if (params?.status) {
      list = list.filter((d) => d.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async createTaxDeclaration(declaration: Partial<TaxDeclaration>): Promise<TaxDeclaration> {
    const id = `declaration-${Date.now()}`
    const declarationCode = `TAX-${declaration.period}-${String(this.taxDeclarations.size + 1).padStart(3, '0')}`

    const newDeclaration: TaxDeclaration = {
      id,
      declarationCode,
      taxType: declaration.taxType!,
      period: declaration.period!,
      taxableIncome: declaration.taxableIncome || 0,
      taxAmount: declaration.taxAmount || 0,
      deductionAmount: declaration.deductionAmount || 0,
      actualTax: declaration.actualTax || 0,
      prepaidTax: declaration.prepaidTax,
      supplementaryTax: declaration.supplementaryTax,
      refundTax: declaration.refundTax,
      status: DeclarationStatus.DRAFT,
      attachments: declaration.attachments || [],
      notes: declaration.notes,
      tenantId: declaration.tenantId || 'tenant-001',
      declaredBy: declaration.declaredBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.taxDeclarations.set(id, newDeclaration)
    return newDeclaration
  }

  async submitDeclaration(id: string): Promise<TaxDeclaration | null> {
    const declaration = this.taxDeclarations.get(id)
    if (!declaration) return null

    declaration.status = DeclarationStatus.SUBMITTED
    declaration.declarationDate = new Date()
    declaration.updatedAt = new Date()
    this.taxDeclarations.set(id, declaration)
    return declaration
  }

  async approveDeclaration(id: string): Promise<TaxDeclaration | null> {
    const declaration = this.taxDeclarations.get(id)
    if (!declaration) return null

    declaration.status = DeclarationStatus.APPROVED
    declaration.updatedAt = new Date()
    this.taxDeclarations.set(id, declaration)
    return declaration
  }

  async payTax(id: string): Promise<TaxDeclaration | null> {
    const declaration = this.taxDeclarations.get(id)
    if (!declaration) return null

    declaration.status = DeclarationStatus.PAID
    declaration.paymentDate = new Date()
    declaration.updatedAt = new Date()
    this.taxDeclarations.set(id, declaration)
    return declaration
  }

  // ========== 发票税务信息 ==========

  async getInvoiceTaxInfos(params?: {
    direction?: 'INPUT' | 'OUTPUT'
    period?: string
    certified?: boolean
  }) {
    let list = Array.from(this.invoiceTaxInfos.values())
    if (params?.direction) {
      list = list.filter((i) => i.direction === params.direction)
    }
    if (params?.period) {
      list = list.filter((i) => i.period === params.period)
    }
    if (params?.certified !== undefined) {
      list = list.filter((i) => i.certified === params.certified)
    }
    return list
  }

  async certifyInvoice(id: string): Promise<InvoiceTaxInfo | null> {
    const info = this.invoiceTaxInfos.get(id)
    if (!info) return null

    info.certified = true
    info.certifiedDate = new Date()
    this.invoiceTaxInfos.set(id, info)
    return info
  }

  // ========== 税务提醒 ==========

  async getTaxReminders(params?: { isCompleted?: boolean }) {
    let list = Array.from(this.taxReminders.values())
    if (params?.isCompleted !== undefined) {
      list = list.filter((r) => r.isCompleted === params.isCompleted)
    }
    return list.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  async completeReminder(id: string): Promise<TaxReminder | null> {
    const reminder = this.taxReminders.get(id)
    if (!reminder) return null

    reminder.isCompleted = true
    reminder.completedAt = new Date()
    this.taxReminders.set(id, reminder)
    return reminder
  }

  // ========== 统计 ==========

  async getStats() {
    const declarations = Array.from(this.taxDeclarations.values())
    const calculations = Array.from(this.taxCalculations.values())

    const currentPeriod = new Date().toISOString().slice(0, 7)
    const currentPeriodDeclarations = declarations.filter((d) => d.period === currentPeriod)

    return {
      currentPeriod: {
        period: currentPeriod,
        totalTax: currentPeriodDeclarations.reduce((sum, d) => sum + d.actualTax, 0),
        paidTax: currentPeriodDeclarations
          .filter((d) => d.status === DeclarationStatus.PAID)
          .reduce((sum, d) => sum + d.actualTax, 0),
        pendingTax: currentPeriodDeclarations
          .filter((d) => d.status !== DeclarationStatus.PAID)
          .reduce((sum, d) => sum + d.actualTax, 0),
      },
      declarations: {
        total: declarations.length,
        paid: declarations.filter((d) => d.status === DeclarationStatus.PAID).length,
        pending: declarations.filter((d) => d.status !== DeclarationStatus.PAID).length,
      },
      calculations: {
        total: calculations.length,
        totalTaxable: calculations.reduce((sum, c) => sum + c.taxableAmount, 0),
        totalPayable: calculations.reduce((sum, c) => sum + c.payableTax, 0),
      },
      byTaxType: this.groupBy(declarations, 'taxType'),
    }
  }

  private groupBy(items: any[], key: string) {
    const result: Record<string, number> = {}
    items.forEach((item) => {
      const k = item[key] || '未分类'
      result[k] = (result[k] || 0) + 1
    })
    return result
  }
}
