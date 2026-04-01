/**
 * 总账管理服务
 * 科目设置、凭证管理、账簿查询
 */
import { Injectable } from '@nestjs/common'

// 科目类型枚举
export enum AccountType {
  ASSET = 'ASSET', // 资产类
  LIABILITY = 'LIABILITY', // 负债类
  EQUITY = 'EQUITY', // 所有者权益类
  REVENUE = 'REVENUE', // 收入类
  EXPENSE = 'EXPENSE', // 费用类
}

// 科目级别枚举
export enum AccountLevel {
  LEVEL_1 = 1, // 一级科目
  LEVEL_2 = 2, // 二级科目
  LEVEL_3 = 3, // 三级科目
  LEVEL_4 = 4, // 四级科目
}

// 凭证状态枚举
export enum VoucherStatus {
  DRAFT = 'DRAFT', // 草稿
  SUBMITTED = 'SUBMITTED', // 待审核
  APPROVED = 'APPROVED', // 已审核
  REJECTED = 'REJECTED', // 已驳回
  POSTED = 'POSTED', // 已过账
}

// 凭证类型枚举
export enum VoucherType {
  RECEIPT = 'RECEIPT', // 收款凭证
  PAYMENT = 'PAYMENT', // 付款凭证
  TRANSFER = 'TRANSFER', // 转账凭证
  GENERAL = 'GENERAL', // 通用凭证
}

// 会计科目接口
export interface Account {
  id: string
  code: string // 科目编码 如:1001
  name: string // 科目名称
  type: AccountType
  level: AccountLevel
  parentId?: string
  parentCode?: string
  parentName?: string

  // 科目属性
  isLeaf: boolean // 是否末级科目
  direction: 'debit' | 'credit' // 借贷方向
  currency?: string // 外币科目

  // 余额方向
  balanceDirection: 'debit' | 'credit'

  // 期初余额
  openingBalance: number
  openingDebit?: number
  openingCredit?: number

  // 本期发生额
  currentDebit: number
  currentCredit: number

  // 期末余额
  endingBalance: number

  // 状态
  status: 'active' | 'inactive'

  createdAt: Date
  updatedAt: Date
}

// 会计凭证接口
export interface Voucher {
  id: string
  voucherNo: string // 凭证号
  voucherDate: Date // 凭证日期
  voucherType: VoucherType
  status: VoucherStatus

  // 凭证信息
  description?: string // 摘要
  attachments?: string[] // 附件

  // 凭证分录
  entries: VoucherEntry[]

  // 合计金额
  totalDebit: number
  totalCredit: number

  // 审核/过账信息
  createdBy: string
  reviewedBy?: string
  reviewedAt?: Date
  postedBy?: string
  postedAt?: Date

  createdAt: Date
  updatedAt: Date
}

// 凭证分录接口
export interface VoucherEntry {
  id: string
  voucherId: string

  accountId: string
  accountCode: string
  accountName: string

  description?: string // 分录摘要

  debit: number // 借方金额
  credit: number // 贷方金额

  // 辅助核算
  auxiliary?: {
    departmentId?: string
    projectId?: string
    customerId?: string
    supplierId?: string
    employeeId?: string
  }
}

// 账簿查询接口
export interface LedgerQuery {
  accountId?: string
  accountCode?: string
  startDate: Date
  endDate: Date
  period?: string // 会计期间 如:2026-03
}

// 账簿明细接口
export interface LedgerDetail {
  date: Date
  voucherNo: string
  voucherId: string
  description?: string

  debit: number
  credit: number
  balance: number // 余额

  direction: 'debit' | 'credit'
}

// 科目余额表接口
export interface AccountBalance {
  accountCode: string
  accountName: string
  accountType: AccountType

  openingBalance: number
  currentDebit: number
  currentCredit: number
  endingBalance: number

  direction: 'debit' | 'credit'
}

// 总账统计接口
export interface LedgerStats {
  totalAccounts: number
  activeAccounts: number
  leafAccounts: number

  totalVouchers: number
  postedVouchers: number
  pendingVouchers: number

  currentDebit: number
  currentCredit: number

  currentPeriod: string
}

@Injectable()
export class LedgerService {
  private accounts: Map<string, Account> = new Map()
  private vouchers: Map<string, Voucher> = new Map()
  private currentPeriod: string = '2026-03'

  constructor() {
    this.initDefaultAccounts()
    this.initDefaultVouchers()
  }

  // 初始化默认科目表
  private initDefaultAccounts() {
    const defaultAccounts = [
      // 一级科目 - 资产类
      {
        code: '1001',
        name: '库存现金',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1002',
        name: '银行存款',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1012',
        name: '其他货币资金',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1101',
        name: '应收账款',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1121',
        name: '应收票据',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1122',
        name: '应收利息',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1221',
        name: '其他应收款',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1401',
        name: '原材料',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1405',
        name: '库存商品',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1601',
        name: '固定资产',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '1602',
        name: '累计折旧',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },

      // 一级科目 - 负债类
      {
        code: '2001',
        name: '短期借款',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '2201',
        name: '应付账款',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '2202',
        name: '应付票据',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '2211',
        name: '应付职工薪酬',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '2221',
        name: '应交税费',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '2241',
        name: '其他应付款',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },

      // 一级科目 - 所有者权益类
      {
        code: '3001',
        name: '实收资本',
        type: AccountType.EQUITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '3002',
        name: '资本公积',
        type: AccountType.EQUITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '3101',
        name: '盈余公积',
        type: AccountType.EQUITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '3103',
        name: '本年利润',
        type: AccountType.EQUITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '3104',
        name: '利润分配',
        type: AccountType.EQUITY,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },

      // 一级科目 - 收入类
      {
        code: '4001',
        name: '主营业务收入',
        type: AccountType.REVENUE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '4051',
        name: '其他业务收入',
        type: AccountType.REVENUE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },
      {
        code: '4111',
        name: '投资收益',
        type: AccountType.REVENUE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'credit',
      },

      // 一级科目 - 费用类
      {
        code: '5001',
        name: '主营业务成本',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '5051',
        name: '其他业务成本',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '5101',
        name: '销售费用',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '5102',
        name: '管理费用',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '5103',
        name: '财务费用',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },
      {
        code: '5301',
        name: '营业外支出',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_1,
        balanceDirection: 'debit',
      },

      // 二级科目示例
      {
        code: '1002-01',
        name: '工商银行',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_2,
        parentCode: '1002',
        balanceDirection: 'debit',
      },
      {
        code: '1002-02',
        name: '建设银行',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_2,
        parentCode: '1002',
        balanceDirection: 'debit',
      },
      {
        code: '1101-01',
        name: '客户A',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_2,
        parentCode: '1101',
        balanceDirection: 'debit',
      },
      {
        code: '1101-02',
        name: '客户B',
        type: AccountType.ASSET,
        level: AccountLevel.LEVEL_2,
        parentCode: '1101',
        balanceDirection: 'debit',
      },
      {
        code: '2201-01',
        name: '供应商A',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_2,
        parentCode: '2201',
        balanceDirection: 'credit',
      },
      {
        code: '2201-02',
        name: '供应商B',
        type: AccountType.LIABILITY,
        level: AccountLevel.LEVEL_2,
        parentCode: '2201',
        balanceDirection: 'credit',
      },
      {
        code: '5101-01',
        name: '广告费',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_2,
        parentCode: '5101',
        balanceDirection: 'debit',
      },
      {
        code: '5101-02',
        name: '差旅费',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_2,
        parentCode: '5101',
        balanceDirection: 'debit',
      },
      {
        code: '5102-01',
        name: '办公费',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_2,
        parentCode: '5102',
        balanceDirection: 'debit',
      },
      {
        code: '5102-02',
        name: '招待费',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_2,
        parentCode: '5102',
        balanceDirection: 'debit',
      },
      {
        code: '5102-03',
        name: '工资',
        type: AccountType.EXPENSE,
        level: AccountLevel.LEVEL_2,
        parentCode: '5102',
        balanceDirection: 'debit',
      },
    ]

    defaultAccounts.forEach((acc) => {
      const id = `ACC-${acc.code}`
      const account: Account = {
        id,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        level: acc.level,
        parentId: acc.parentCode ? `ACC-${acc.parentCode}` : undefined,
        parentCode: acc.parentCode,
        parentName: acc.parentCode
          ? defaultAccounts.find((a) => a.code === acc.parentCode)?.name
          : undefined,
        isLeaf: !defaultAccounts.some((a) => a.parentCode === acc.code),
        direction: acc.balanceDirection === 'debit' ? 'debit' : 'credit',
        balanceDirection: acc.balanceDirection as 'debit' | 'credit',
        openingBalance: Math.random() * 1000000,
        currentDebit: Math.random() * 500000,
        currentCredit: Math.random() * 400000,
        endingBalance: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // 计算期末余额
      if (account.balanceDirection === 'debit') {
        account.endingBalance =
          account.openingBalance + account.currentDebit - account.currentCredit
      } else {
        account.endingBalance =
          account.openingBalance - account.currentDebit + account.currentCredit
      }

      this.accounts.set(id, account)
    })
  }

  // 初始化默认凭证
  private initDefaultVouchers() {
    const voucher1: Voucher = {
      id: 'VCH-001',
      voucherNo: '记-001',
      voucherDate: new Date('2026-03-01'),
      voucherType: VoucherType.RECEIPT,
      status: VoucherStatus.POSTED,
      description: '收到客户A货款',
      entries: [
        {
          id: 'ENT-001',
          voucherId: 'VCH-001',
          accountId: 'ACC-1002-01',
          accountCode: '1002-01',
          accountName: '工商银行',
          description: '收到货款',
          debit: 50000,
          credit: 0,
        },
        {
          id: 'ENT-002',
          voucherId: 'VCH-001',
          accountId: 'ACC-1101-01',
          accountCode: '1101-01',
          accountName: '客户A',
          description: '冲减应收',
          debit: 0,
          credit: 50000,
        },
      ],
      totalDebit: 50000,
      totalCredit: 50000,
      createdBy: 'admin',
      reviewedBy: 'finance_mgr',
      reviewedAt: new Date('2026-03-01'),
      postedBy: 'admin',
      postedAt: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.vouchers.set(voucher1.id, voucher1)

    const voucher2: Voucher = {
      id: 'VCH-002',
      voucherNo: '记-002',
      voucherDate: new Date('2026-03-02'),
      voucherType: VoucherType.PAYMENT,
      status: VoucherStatus.POSTED,
      description: '支付供应商B采购款',
      entries: [
        {
          id: 'ENT-003',
          voucherId: 'VCH-002',
          accountId: 'ACC-2201-02',
          accountCode: '2201-02',
          accountName: '供应商B',
          description: '冲减应付',
          debit: 30000,
          credit: 0,
        },
        {
          id: 'ENT-004',
          voucherId: 'VCH-002',
          accountId: 'ACC-1002-02',
          accountCode: '1002-02',
          accountName: '建设银行',
          description: '支付采购款',
          debit: 0,
          credit: 30000,
        },
      ],
      totalDebit: 30000,
      totalCredit: 30000,
      createdBy: 'admin',
      reviewedBy: 'finance_mgr',
      reviewedAt: new Date('2026-03-02'),
      postedBy: 'admin',
      postedAt: new Date('2026-03-02'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.vouchers.set(voucher2.id, voucher2)

    // 待审核凭证
    const voucher3: Voucher = {
      id: 'VCH-003',
      voucherNo: '记-003',
      voucherDate: new Date('2026-03-15'),
      voucherType: VoucherType.GENERAL,
      status: VoucherStatus.SUBMITTED,
      description: '工资发放',
      entries: [
        {
          id: 'ENT-005',
          voucherId: 'VCH-003',
          accountId: 'ACC-5102-03',
          accountCode: '5102-03',
          accountName: '工资',
          description: '管理费用-工资',
          debit: 20000,
          credit: 0,
        },
        {
          id: 'ENT-006',
          voucherId: 'VCH-003',
          accountId: 'ACC-2211',
          accountCode: '2211',
          accountName: '应付职工薪酬',
          description: '应付工资',
          debit: 0,
          credit: 20000,
        },
      ],
      totalDebit: 20000,
      totalCredit: 20000,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.vouchers.set(voucher3.id, voucher3)
  }

  // 科目管理
  async getAllAccounts(type?: AccountType, level?: AccountLevel): Promise<Account[]> {
    let accounts = Array.from(this.accounts.values())

    if (type) accounts = accounts.filter((a) => a.type === type)
    if (level) accounts = accounts.filter((a) => a.level === level)

    return accounts.sort((a, b) => a.code.localeCompare(b.code))
  }

  async getAccountTree(parentCode?: string): Promise<Account[]> {
    const accounts = Array.from(this.accounts.values())

    if (!parentCode) {
      // 返回一级科目
      return accounts.filter((a) => a.level === AccountLevel.LEVEL_1)
    }

    return accounts.filter((a) => a.parentCode === parentCode)
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.accounts.get(id) || null
  }

  async getAccountByCode(code: string): Promise<Account | null> {
    return Array.from(this.accounts.values()).find((a) => a.code === code) || null
  }

  async createAccount(data: Partial<Account>): Promise<Account> {
    const id = `ACC-${data.code}`

    const account: Account = {
      id,
      code: data.code || '',
      name: data.name || '',
      type: data.type || AccountType.ASSET,
      level: data.level || AccountLevel.LEVEL_2,
      parentId: data.parentId,
      parentCode: data.parentCode,
      parentName: data.parentName,
      isLeaf: true,
      direction: data.balanceDirection === 'debit' ? 'debit' : 'credit',
      balanceDirection: data.balanceDirection || 'debit',
      openingBalance: data.openingBalance || 0,
      currentDebit: 0,
      currentCredit: 0,
      endingBalance: data.openingBalance || 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.accounts.set(id, account)
    return account
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<Account | null> {
    const account = this.accounts.get(id)
    if (!account) return null

    const updated: Account = {
      ...account,
      ...data,
      updatedAt: new Date(),
    }

    this.accounts.set(id, updated)
    return updated
  }

  async deleteAccount(id: string): Promise<{ success: boolean; message: string }> {
    const account = this.accounts.get(id)
    if (!account) return { success: false, message: '科目不存在' }

    // 检查是否有子科目
    const children = Array.from(this.accounts.values()).filter((a) => a.parentId === id)
    if (children.length > 0) {
      return { success: false, message: '存在子科目，请先删除子科目' }
    }

    // 检查是否有余额
    if (account.endingBalance !== 0) {
      return { success: false, message: '科目有余额，无法删除' }
    }

    this.accounts.delete(id)
    return { success: true, message: '删除成功' }
  }

  // 凭证管理
  async getAllVouchers(
    status?: VoucherStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Voucher[]> {
    let vouchers = Array.from(this.vouchers.values())

    if (status) vouchers = vouchers.filter((v) => v.status === status)
    if (startDate) vouchers = vouchers.filter((v) => v.voucherDate >= startDate)
    if (endDate) vouchers = vouchers.filter((v) => v.voucherDate <= endDate)

    return vouchers.sort((a, b) => b.voucherDate.getTime() - a.voucherDate.getTime())
  }

  async getVoucherById(id: string): Promise<Voucher | null> {
    return this.vouchers.get(id) || null
  }

  async createVoucher(data: Partial<Voucher>): Promise<Voucher> {
    const id = `VCH-${Date.now().toString(36).toUpperCase()}`
    const voucherNo = `记-${this.vouchers.size + 1}`

    const totalDebit = data.entries?.reduce((sum, e) => sum + e.debit, 0) || 0
    const totalCredit = data.entries?.reduce((sum, e) => sum + e.credit, 0) || 0

    const voucher: Voucher = {
      id,
      voucherNo,
      voucherDate: data.voucherDate || new Date(),
      voucherType: data.voucherType || VoucherType.GENERAL,
      status: VoucherStatus.DRAFT,
      description: data.description,
      entries: data.entries || [],
      totalDebit,
      totalCredit,
      createdBy: data.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.vouchers.set(id, voucher)
    return voucher
  }

  async updateVoucher(id: string, data: Partial<Voucher>): Promise<Voucher | null> {
    const voucher = this.vouchers.get(id)
    if (!voucher) return null

    // 只有草稿状态可以修改
    if (voucher.status !== VoucherStatus.DRAFT) {
      return null
    }

    const totalDebit = data.entries?.reduce((sum, e) => sum + e.debit, 0) || voucher.totalDebit
    const totalCredit = data.entries?.reduce((sum, e) => sum + e.credit, 0) || voucher.totalCredit

    const updated: Voucher = {
      ...voucher,
      ...data,
      totalDebit,
      totalCredit,
      updatedAt: new Date(),
    }

    this.vouchers.set(id, updated)
    return updated
  }

  async deleteVoucher(id: string): Promise<{ success: boolean; message: string }> {
    const voucher = this.vouchers.get(id)
    if (!voucher) return { success: false, message: '凭证不存在' }

    if (voucher.status === VoucherStatus.POSTED) {
      return { success: false, message: '已过账凭证无法删除' }
    }

    this.vouchers.delete(id)
    return { success: true, message: '删除成功' }
  }

  async submitVoucher(id: string): Promise<Voucher | null> {
    const voucher = this.vouchers.get(id)
    if (!voucher || voucher.status !== VoucherStatus.DRAFT) return null

    // 检查借贷平衡
    if (voucher.totalDebit !== voucher.totalCredit) {
      return null
    }

    voucher.status = VoucherStatus.SUBMITTED
    voucher.updatedAt = new Date()
    return voucher
  }

  async approveVoucher(id: string, reviewer: string): Promise<Voucher | null> {
    const voucher = this.vouchers.get(id)
    if (!voucher || voucher.status !== VoucherStatus.SUBMITTED) return null

    voucher.status = VoucherStatus.APPROVED
    voucher.reviewedBy = reviewer
    voucher.reviewedAt = new Date()
    voucher.updatedAt = new Date()
    return voucher
  }

  async rejectVoucher(id: string, reviewer: string): Promise<Voucher | null> {
    const voucher = this.vouchers.get(id)
    if (!voucher || voucher.status !== VoucherStatus.SUBMITTED) return null

    voucher.status = VoucherStatus.REJECTED
    voucher.reviewedBy = reviewer
    voucher.reviewedAt = new Date()
    voucher.updatedAt = new Date()
    return voucher
  }

  async postVoucher(id: string, poster: string): Promise<Voucher | null> {
    const voucher = this.vouchers.get(id)
    if (!voucher || voucher.status !== VoucherStatus.APPROVED) return null

    // 更新科目余额
    for (const entry of voucher.entries) {
      const account = await this.getAccountByCode(entry.accountCode)
      if (account) {
        account.currentDebit += entry.debit
        account.currentCredit += entry.credit

        // 重新计算期末余额
        if (account.balanceDirection === 'debit') {
          account.endingBalance =
            account.openingBalance + account.currentDebit - account.currentCredit
        } else {
          account.endingBalance =
            account.openingBalance - account.currentDebit + account.currentCredit
        }
        account.updatedAt = new Date()
      }
    }

    voucher.status = VoucherStatus.POSTED
    voucher.postedBy = poster
    voucher.postedAt = new Date()
    voucher.updatedAt = new Date()
    return voucher
  }

  // 账簿查询
  async getLedger(query: LedgerQuery): Promise<LedgerDetail[]> {
    const account = query.accountId
      ? this.accounts.get(query.accountId)
      : query.accountCode
        ? await this.getAccountByCode(query.accountCode)
        : null

    if (!account) return []

    const details: LedgerDetail[] = []
    let balance = account.openingBalance

    // 按日期查询凭证分录
    const vouchers = Array.from(this.vouchers.values())
      .filter((v) => v.status === VoucherStatus.POSTED)
      .filter((v) => v.voucherDate >= query.startDate && v.voucherDate <= query.endDate)
      .sort((a, b) => a.voucherDate.getTime() - b.voucherDate.getTime())

    for (const voucher of vouchers) {
      for (const entry of voucher.entries) {
        if (entry.accountCode === account.code) {
          // 计算余额
          if (account.balanceDirection === 'debit') {
            balance += entry.debit - entry.credit
          } else {
            balance += entry.credit - entry.debit
          }

          details.push({
            date: voucher.voucherDate,
            voucherNo: voucher.voucherNo,
            voucherId: voucher.id,
            description: entry.description || voucher.description,
            debit: entry.debit,
            credit: entry.credit,
            balance,
            direction: entry.debit > 0 ? 'debit' : 'credit',
          })
        }
      }
    }

    return details
  }

  // 科目余额表
  async getAccountBalances(type?: AccountType): Promise<AccountBalance[]> {
    let accounts = Array.from(this.accounts.values()).filter(
      (a) => a.level === AccountLevel.LEVEL_1,
    )

    if (type) accounts = accounts.filter((a) => a.type === type)

    return accounts.map((a) => ({
      accountCode: a.code,
      accountName: a.name,
      accountType: a.type,
      openingBalance: a.openingBalance,
      currentDebit: a.currentDebit,
      currentCredit: a.currentCredit,
      endingBalance: a.endingBalance,
      direction: a.balanceDirection,
    }))
  }

  // 试算平衡表
  async getTrialBalance(): Promise<{ debit: number; credit: number; balanced: boolean }> {
    const accounts = Array.from(this.accounts.values()).filter(
      (a) => a.level === AccountLevel.LEVEL_1,
    )

    const totalDebit = accounts
      .filter((a) => a.balanceDirection === 'debit')
      .reduce((sum, a) => sum + a.endingBalance, 0)

    const totalCredit = accounts
      .filter((a) => a.balanceDirection === 'credit')
      .reduce((sum, a) => sum + a.endingBalance, 0)

    return {
      debit: totalDebit,
      credit: totalCredit,
      balanced: Math.abs(totalDebit - totalCredit) < 0.01,
    }
  }

  // 统计
  async getStats(): Promise<LedgerStats> {
    const accounts = Array.from(this.accounts.values())
    const vouchers = Array.from(this.vouchers.values())

    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.status === 'active').length,
      leafAccounts: accounts.filter((a) => a.isLeaf).length,
      totalVouchers: vouchers.length,
      postedVouchers: vouchers.filter((v) => v.status === VoucherStatus.POSTED).length,
      pendingVouchers: vouchers.filter(
        (v) => v.status === VoucherStatus.SUBMITTED || v.status === VoucherStatus.APPROVED,
      ).length,
      currentDebit: vouchers
        .filter((v) => v.status === VoucherStatus.POSTED)
        .reduce((sum, v) => sum + v.totalDebit, 0),
      currentCredit: vouchers
        .filter((v) => v.status === VoucherStatus.POSTED)
        .reduce((sum, v) => sum + v.totalCredit, 0),
      currentPeriod: this.currentPeriod,
    }
  }

  // 设置会计期间
  async setCurrentPeriod(period: string): Promise<void> {
    this.currentPeriod = period
  }
}
