/**
 * 预算管理服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  BudgetService,
  BudgetType,
  BudgetStatus,
  BudgetCategory,
  ControlLevel,
} from './budget.service'

describe('BudgetService', () => {
  let service: BudgetService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetService],
    }).compile()

    service = module.get<BudgetService>(BudgetService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getBudgets', () => {
    it('should return paginated budgets list', async () => {
      const result = await service.getBudgets({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should filter by budget type', async () => {
      const result = await service.getBudgets({ budgetType: BudgetType.ANNUAL })

      result.data.forEach((budget) => {
        expect(budget.budgetType).toBe(BudgetType.ANNUAL)
      })
    })

    it('should filter by status', async () => {
      const result = await service.getBudgets({ status: BudgetStatus.EXECUTING })

      result.data.forEach((budget) => {
        expect(budget.status).toBe(BudgetStatus.EXECUTING)
      })
    })
  })

  describe('getBudget', () => {
    it('should return a budget by id', async () => {
      const result = await service.getBudget('budget-001')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('budget-001')
    })

    it('should return null for non-existent budget', async () => {
      const result = await service.getBudget('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('createBudget', () => {
    it('should create a new budget', async () => {
      const newBudget = {
        budgetName: '测试预算',
        budgetType: BudgetType.ANNUAL,
        category: BudgetCategory.OPEX,
        budgetAmount: 1000000,
        fiscalYear: 2026,
        controlLevel: ControlLevel.SOFT,
      }

      const result = await service.createBudget(newBudget)

      expect(result).toBeDefined()
      expect(result.budgetName).toBe('测试预算')
      expect(result.status).toBe(BudgetStatus.DRAFT)
      expect(result.availableAmount).toBe(1000000)
    })
  })

  describe('submitBudget', () => {
    it('should submit a budget', async () => {
      const newBudget = await service.createBudget({
        budgetName: '待提交预算',
        budgetType: BudgetType.MONTHLY,
        category: BudgetCategory.OTHER,
        budgetAmount: 50000,
      })

      const result = await service.submitBudget(newBudget.id, 'admin')

      expect(result).not.toBeNull()
      expect(result?.status).toBe(BudgetStatus.SUBMITTED)
      expect(result?.submittedBy).toBe('admin')
    })
  })

  describe('getStats', () => {
    it('should return budget statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('totalBudgets')
      expect(result).toHaveProperty('totalBudgetAmount')
      expect(result).toHaveProperty('byStatus')
      expect(result).toHaveProperty('byType')
    })
  })
})
