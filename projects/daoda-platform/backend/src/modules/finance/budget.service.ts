/**
 * 预算管理服务
 * 预算编制、预算执行、预算控制、预算分析
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum BudgetType {
  ANNUAL = 'ANNUAL', // 年度预算
  QUARTERLY = 'QUARTERLY', // 季度预算
  MONTHLY = 'MONTHLY', // 月度预算
  PROJECT = 'PROJECT', // 项目预算
  DEPARTMENT = 'DEPARTMENT', // 部门预算
}

export enum BudgetStatus {
  DRAFT = 'DRAFT', // 草稿
  SUBMITTED = 'SUBMITTED', // 已提交
  APPROVED = 'APPROVED', // 已审批
  REJECTED = 'REJECTED', // 已拒绝
  EXECUTING = 'EXECUTING', // 执行中
  COMPLETED = 'COMPLETED', // 已完成
  CLOSED = 'CLOSED', // 已关闭
}

export enum BudgetCategory {
  REVENUE = 'REVENUE', // 收入
  EXPENSE = 'EXPENSE', // 支出
  CAPEX = 'CAPEX', // 资本性支出
  OPEX = 'OPEX', // 运营支出
  HR = 'HR', // 人力成本
  MARKETING = 'MARKETING', // 营销费用
  R_D = 'R_D', // 研发费用
  ADMIN = 'ADMIN', // 管理费用
  PRODUCTION = 'PRODUCTION', // 生产成本
  OTHER = 'OTHER', // 其他
}

export enum ControlLevel {
  NONE = 'NONE', // 无控制
  SOFT = 'SOFT', // 软控制（提醒）
  HARD = 'HARD', // 硬控制（禁止超支）
  APPROVAL = 'APPROVAL', // 审批控制
}

// ========== 导出接口类型 ==========

export interface Budget {
  id: string
  budgetCode: string // 预算编号
  budgetName: string // 预算名称
  budgetType: BudgetType // 预算类型
  category: BudgetCategory // 预算分类

  // 时间范围
  fiscalYear: number // 财年
  startDate: Date // 开始日期
  endDate: Date // 结束日期

  // 组织范围
  departmentId?: string // 部门ID
  departmentName?: string // 部门名称
  projectId?: string // 项目ID
  projectName?: string // 项目名称

  // 金额信息
  budgetAmount: number // 预算金额
  usedAmount: number // 已用金额
  availableAmount: number // 可用金额
  committedAmount: number // 已承诺金额

  // 控制设置
  controlLevel: ControlLevel // 控制级别
  alertThreshold: number // 预警阈值（百分比）

  // 状态
  status: BudgetStatus

  // 审批信息
  submittedAt?: Date
  submittedBy?: string
  approvedAt?: Date
  approvedBy?: string
  rejectedAt?: Date
  rejectedBy?: string
  rejectReason?: string

  // 附加信息
  description?: string
  notes?: string

  // 系统字段
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface BudgetItem {
  id: string
  budgetId: string
  itemId: string // 预算项ID
  itemName: string // 预算项名称
  parentId?: string // 父项ID

  // 金额信息
  budgetAmount: number // 预算金额
  usedAmount: number // 已用金额
  availableAmount: number // 可用金额

  // 月度分解
  monthlyBudgets: {
    // 月度预算
    month: number // 月份 1-12
    amount: number // 金额
    used: number // 已用
  }[]

  // 科目关联
  accountId?: string // 科目ID
  accountCode?: string // 科目编码
  accountName?: string // 科目名称

  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface BudgetExecution {
  id: string
  budgetId: string
  budgetCode: string
  budgetName: string
  itemId?: string
  itemName?: string

  // 业务关联
  businessType: string // 业务类型
  businessId: string // 业务ID
  businessCode: string // 业务单号
  businessDate: Date // 业务日期

  // 金额信息
  amount: number // 金额
  executeType: 'BUDGET' | 'ACTUAL' | 'FORECAST' // 执行类型

  // 部门信息
  departmentId?: string
  departmentName?: string

  description?: string
  createdAt: Date
}

export interface BudgetAlert {
  id: string
  budgetId: string
  budgetCode: string
  budgetName: string
  alertType: 'THRESHOLD' | 'EXCEEDED' | 'NEAR_LIMIT'
  alertLevel: 'INFO' | 'WARNING' | 'ERROR'
  message: string
  usagePercent: number
  budgetAmount: number
  usedAmount: number
  isRead: boolean
  createdAt: Date
}

@Injectable()
export class BudgetService {
  // 预算存储
  private budgets: Map<string, Budget> = new Map()

  // 预算项存储
  private budgetItems: Map<string, BudgetItem> = new Map()

  // 执行记录存储
  private executions: Map<string, BudgetExecution> = new Map()

  // 预警记录存储
  private alerts: Map<string, BudgetAlert> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    const sampleBudgets: Partial<Budget>[] = [
      {
        id: 'budget-001',
        budgetCode: 'BUD-2026-001',
        budgetName: '2026年度运营预算',
        budgetType: BudgetType.ANNUAL,
        category: BudgetCategory.OPEX,
        fiscalYear: 2026,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        budgetAmount: 5000000,
        usedAmount: 1250000,
        availableAmount: 3750000,
        committedAmount: 500000,
        controlLevel: ControlLevel.SOFT,
        alertThreshold: 80,
        status: BudgetStatus.EXECUTING,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'budget-002',
        budgetCode: 'BUD-2026-002',
        budgetName: '2026年营销费用预算',
        budgetType: BudgetType.ANNUAL,
        category: BudgetCategory.MARKETING,
        fiscalYear: 2026,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        budgetAmount: 2000000,
        usedAmount: 450000,
        availableAmount: 1550000,
        committedAmount: 200000,
        controlLevel: ControlLevel.HARD,
        alertThreshold: 90,
        status: BudgetStatus.EXECUTING,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'budget-003',
        budgetCode: 'BUD-2026-003',
        budgetName: '研发部门年度预算',
        budgetType: BudgetType.DEPARTMENT,
        category: BudgetCategory.R_D,
        fiscalYear: 2026,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        departmentId: 'dept-rd',
        departmentName: '研发部',
        budgetAmount: 3000000,
        usedAmount: 750000,
        availableAmount: 2250000,
        committedAmount: 300000,
        controlLevel: ControlLevel.APPROVAL,
        alertThreshold: 85,
        status: BudgetStatus.EXECUTING,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleBudgets.forEach((budget) => {
      this.budgets.set(budget.id!, budget as Budget)
    })
  }

  // ========== 预算管理 ==========

  async getBudgets(params?: {
    budgetType?: BudgetType
    category?: BudgetCategory
    status?: BudgetStatus
    departmentId?: string
    fiscalYear?: number
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let list = Array.from(this.budgets.values())

    if (params?.budgetType) {
      list = list.filter((b) => b.budgetType === params.budgetType)
    }
    if (params?.category) {
      list = list.filter((b) => b.category === params.category)
    }
    if (params?.status) {
      list = list.filter((b) => b.status === params.status)
    }
    if (params?.departmentId) {
      list = list.filter((b) => b.departmentId === params.departmentId)
    }
    if (params?.fiscalYear) {
      list = list.filter((b) => b.fiscalYear === params.fiscalYear)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (b) => b.budgetCode.toLowerCase().includes(kw) || b.budgetName.toLowerCase().includes(kw),
      )
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = list.length
    const start = (page - 1) * pageSize
    const data = list.slice(start, start + pageSize)

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async getBudget(id: string): Promise<Budget | null> {
    return this.budgets.get(id) || null
  }

  async createBudget(budget: Partial<Budget>): Promise<Budget> {
    const id = `budget-${Date.now()}`
    const budgetCode =
      budget.budgetCode ||
      `BUD-${new Date().getFullYear()}-${String(this.budgets.size + 1).padStart(3, '0')}`

    const newBudget: Budget = {
      id,
      budgetCode,
      budgetName: budget.budgetName!,
      budgetType: budget.budgetType || BudgetType.ANNUAL,
      category: budget.category || BudgetCategory.OTHER,
      fiscalYear: budget.fiscalYear || new Date().getFullYear(),
      startDate: budget.startDate || new Date(),
      endDate: budget.endDate || new Date(),
      departmentId: budget.departmentId,
      departmentName: budget.departmentName,
      projectId: budget.projectId,
      projectName: budget.projectName,
      budgetAmount: budget.budgetAmount || 0,
      usedAmount: 0,
      availableAmount: budget.budgetAmount || 0,
      committedAmount: 0,
      controlLevel: budget.controlLevel || ControlLevel.SOFT,
      alertThreshold: budget.alertThreshold || 80,
      status: BudgetStatus.DRAFT,
      description: budget.description,
      notes: budget.notes,
      tenantId: budget.tenantId || 'tenant-001',
      createdBy: budget.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.budgets.set(id, newBudget)
    return newBudget
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    const budget = this.budgets.get(id)
    if (!budget) return null

    // 只有草稿状态可以修改
    if (budget.status !== BudgetStatus.DRAFT) {
      throw new Error('只有草稿状态的预算可以修改')
    }

    const updated = {
      ...budget,
      ...updates,
      availableAmount: (updates.budgetAmount || budget.budgetAmount) - budget.usedAmount,
      updatedAt: new Date(),
    }
    this.budgets.set(id, updated)
    return updated
  }

  async deleteBudget(id: string): Promise<boolean> {
    const budget = this.budgets.get(id)
    if (!budget) return false

    // 只有草稿状态可以删除
    if (budget.status !== BudgetStatus.DRAFT) {
      throw new Error('只有草稿状态的预算可以删除')
    }

    return this.budgets.delete(id)
  }

  // ========== 预算审批 ==========

  async submitBudget(id: string, submittedBy: string): Promise<Budget | null> {
    const budget = this.budgets.get(id)
    if (!budget) return null

    budget.status = BudgetStatus.SUBMITTED
    budget.submittedAt = new Date()
    budget.submittedBy = submittedBy
    budget.updatedAt = new Date()
    this.budgets.set(id, budget)
    return budget
  }

  async approveBudget(id: string, approvedBy: string): Promise<Budget | null> {
    const budget = this.budgets.get(id)
    if (!budget) return null

    budget.status = BudgetStatus.APPROVED
    budget.approvedAt = new Date()
    budget.approvedBy = approvedBy
    budget.updatedAt = new Date()
    this.budgets.set(id, budget)
    return budget
  }

  async rejectBudget(id: string, rejectedBy: string, reason: string): Promise<Budget | null> {
    const budget = this.budgets.get(id)
    if (!budget) return null

    budget.status = BudgetStatus.REJECTED
    budget.rejectedAt = new Date()
    budget.rejectedBy = rejectedBy
    budget.rejectReason = reason
    budget.updatedAt = new Date()
    this.budgets.set(id, budget)
    return budget
  }

  // ========== 预算执行 ==========

  async executeBudget(params: {
    budgetId: string
    itemId?: string
    amount: number
    businessType: string
    businessId: string
    businessCode: string
    departmentId?: string
    description?: string
  }): Promise<BudgetExecution> {
    const budget = this.budgets.get(params.budgetId)
    if (!budget) throw new Error('预算不存在')

    // 检查控制级别
    const usagePercent = ((budget.usedAmount + params.amount) / budget.budgetAmount) * 100

    if (budget.controlLevel === ControlLevel.HARD && usagePercent > 100) {
      throw new Error('预算已超支，无法执行')
    }

    // 创建执行记录
    const execution: BudgetExecution = {
      id: `exec-${Date.now()}`,
      budgetId: params.budgetId,
      budgetCode: budget.budgetCode,
      budgetName: budget.budgetName,
      itemId: params.itemId,
      itemName: params.itemId ? this.budgetItems.get(params.itemId)?.itemName : undefined,
      businessType: params.businessType,
      businessId: params.businessId,
      businessCode: params.businessCode,
      businessDate: new Date(),
      amount: params.amount,
      executeType: 'ACTUAL',
      departmentId: params.departmentId,
      description: params.description,
      createdAt: new Date(),
    }

    this.executions.set(execution.id, execution)

    // 更新预算使用情况
    budget.usedAmount += params.amount
    budget.availableAmount = budget.budgetAmount - budget.usedAmount
    budget.updatedAt = new Date()
    this.budgets.set(budget.id, budget)

    // 检查是否需要预警
    if (usagePercent >= budget.alertThreshold) {
      await this.createAlert(budget, usagePercent)
    }

    return execution
  }

  async getExecutions(budgetId: string, params?: { page?: number; pageSize?: number }) {
    let list = Array.from(this.executions.values()).filter((e) => e.budgetId === budgetId)
    list = list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = list.length
    const start = (page - 1) * pageSize
    const data = list.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  }

  // ========== 预算预警 ==========

  private async createAlert(budget: Budget, usagePercent: number): Promise<BudgetAlert> {
    const alertType =
      usagePercent >= 100 ? 'EXCEEDED' : usagePercent >= 95 ? 'NEAR_LIMIT' : 'THRESHOLD'
    const alertLevel = usagePercent >= 100 ? 'ERROR' : usagePercent >= 95 ? 'WARNING' : 'INFO'

    const alert: BudgetAlert = {
      id: `alert-${Date.now()}`,
      budgetId: budget.id,
      budgetCode: budget.budgetCode,
      budgetName: budget.budgetName,
      alertType,
      alertLevel,
      message: `预算 [${budget.budgetName}] 使用率已达 ${usagePercent.toFixed(1)}%`,
      usagePercent,
      budgetAmount: budget.budgetAmount,
      usedAmount: budget.usedAmount,
      isRead: false,
      createdAt: new Date(),
    }

    this.alerts.set(alert.id, alert)
    return alert
  }

  async getAlerts(params?: { isRead?: boolean }) {
    let list = Array.from(this.alerts.values())
    if (params?.isRead !== undefined) {
      list = list.filter((a) => a.isRead === params.isRead)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async markAlertRead(id: string): Promise<boolean> {
    const alert = this.alerts.get(id)
    if (!alert) return false
    alert.isRead = true
    this.alerts.set(id, alert)
    return true
  }

  // ========== 预算分析 ==========

  async getBudgetAnalysis(budgetId: string) {
    const budget = this.budgets.get(budgetId)
    if (!budget) return null

    const executions = Array.from(this.executions.values()).filter((e) => e.budgetId === budgetId)

    return {
      budget: {
        code: budget.budgetCode,
        name: budget.budgetName,
        amount: budget.budgetAmount,
        used: budget.usedAmount,
        available: budget.availableAmount,
        committed: budget.committedAmount,
        usagePercent: (budget.usedAmount / budget.budgetAmount) * 100,
      },
      summary: {
        totalExecutions: executions.length,
        totalAmount: executions.reduce((sum, e) => sum + e.amount, 0),
        avgAmount:
          executions.length > 0
            ? executions.reduce((sum, e) => sum + e.amount, 0) / executions.length
            : 0,
      },
      byBusinessType: this.groupBy(executions, 'businessType'),
      byMonth: this.groupByMonth(executions),
    }
  }

  // ========== 统计 ==========

  async getStats() {
    const budgets = Array.from(this.budgets.values())
    const alerts = Array.from(this.alerts.values())

    return {
      totalBudgets: budgets.length,
      totalBudgetAmount: budgets.reduce((sum, b) => sum + b.budgetAmount, 0),
      totalUsedAmount: budgets.reduce((sum, b) => sum + b.usedAmount, 0),
      totalAvailableAmount: budgets.reduce((sum, b) => sum + b.availableAmount, 0),
      byStatus: this.groupBy(budgets, 'status'),
      byType: this.groupBy(budgets, 'budgetType'),
      byCategory: this.groupBy(budgets, 'category'),
      alerts: {
        total: alerts.length,
        unread: alerts.filter((a) => !a.isRead).length,
      },
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

  private groupByMonth(items: BudgetExecution[]) {
    const result: Record<string, number> = {}
    items.forEach((item) => {
      const month = new Date(item.businessDate).getMonth() + 1
      const key = `${month}月`
      result[key] = (result[key] || 0) + item.amount
    })
    return result
  }
}
