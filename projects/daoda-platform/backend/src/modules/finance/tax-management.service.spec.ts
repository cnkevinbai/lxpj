/**
 * 税务管理服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  TaxManagementService,
  TaxType,
  DeclarationStatus,
  TaxPeriod,
} from './tax-management.service'

describe('TaxManagementService', () => {
  let service: TaxManagementService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxManagementService],
    }).compile()

    service = module.get<TaxManagementService>(TaxManagementService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getTaxConfigs', () => {
    it('should return tax configs list', async () => {
      const result = await service.getTaxConfigs()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should filter by tax type', async () => {
      const result = await service.getTaxConfigs({ taxType: TaxType.VAT })

      result.forEach((config) => {
        expect(config.taxType).toBe(TaxType.VAT)
      })
    })
  })

  describe('getTaxConfig', () => {
    it('should return a tax config by id', async () => {
      const result = await service.getTaxConfig('tax-config-001')

      expect(result).not.toBeNull()
      expect(result?.taxType).toBe(TaxType.VAT)
      expect(result?.rate).toBe(0.13)
    })
  })

  describe('createTaxConfig', () => {
    it('should create a new tax config', async () => {
      const result = await service.createTaxConfig({
        taxType: TaxType.STAMP_DUTY,
        taxTypeName: '印花税',
        rate: 0.0003,
        calculationMethod: 'RATE',
        declarationPeriod: TaxPeriod.MONTHLY,
      })

      expect(result).toBeDefined()
      expect(result.taxType).toBe(TaxType.STAMP_DUTY)
      expect(result.status).toBe('ACTIVE')
    })
  })

  describe('calculateTax', () => {
    it('should calculate tax amount', async () => {
      const result = await service.calculateTax({
        taxType: TaxType.VAT,
        period: '2026-04',
        taxableAmount: 100000,
        taxableType: 'SALES',
        deductionAmount: 5000,
      })

      expect(result).toBeDefined()
      expect(result.taxType).toBe(TaxType.VAT)
      expect(result.period).toBe('2026-04')
      expect(result.taxableAmount).toBe(100000)
      expect(result.calculatedTax).toBeGreaterThan(0)
      expect(result.payableTax).toBe(result.calculatedTax - 5000)
      expect(result.status).toBe('CALCULATED')
    })
  })

  describe('getTaxDeclarations', () => {
    it('should return tax declarations list', async () => {
      const result = await service.getTaxDeclarations()

      expect(Array.isArray(result)).toBe(true)
    })

    it('should filter by status', async () => {
      const result = await service.getTaxDeclarations({ status: DeclarationStatus.PAID })

      result.forEach((declaration) => {
        expect(declaration.status).toBe(DeclarationStatus.PAID)
      })
    })
  })

  describe('createTaxDeclaration', () => {
    it('should create a new tax declaration', async () => {
      const result = await service.createTaxDeclaration({
        taxType: TaxType.VAT,
        period: '2026-04',
        taxableIncome: 500000,
        taxAmount: 65000,
        deductionAmount: 15000,
        actualTax: 50000,
        declaredBy: 'admin',
      })

      expect(result).toBeDefined()
      expect(result.taxType).toBe(TaxType.VAT)
      expect(result.status).toBe(DeclarationStatus.DRAFT)
    })
  })

  describe('getStats', () => {
    it('should return tax statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('currentPeriod')
      expect(result).toHaveProperty('declarations')
      expect(result).toHaveProperty('calculations')
      expect(result).toHaveProperty('byTaxType')
    })
  })
})
