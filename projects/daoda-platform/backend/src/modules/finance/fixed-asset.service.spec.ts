/**
 * 固定资产管理服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  FixedAssetService,
  AssetStatus,
  AssetCategory,
  DepreciationMethod,
} from './fixed-asset.service'

describe('FixedAssetService', () => {
  let service: FixedAssetService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FixedAssetService],
    }).compile()

    service = module.get<FixedAssetService>(FixedAssetService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAssets', () => {
    it('should return paginated assets list', async () => {
      const result = await service.getAssets({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page', 1)
      expect(result).toHaveProperty('pageSize', 10)
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should filter by category', async () => {
      const result = await service.getAssets({ category: AssetCategory.ELECTRONIC })

      result.data.forEach((asset) => {
        expect(asset.category).toBe(AssetCategory.ELECTRONIC)
      })
    })

    it('should filter by status', async () => {
      const result = await service.getAssets({ status: AssetStatus.IN_USE })

      result.data.forEach((asset) => {
        expect(asset.status).toBe(AssetStatus.IN_USE)
      })
    })
  })

  describe('getAsset', () => {
    it('should return an asset by id', async () => {
      const result = await service.getAsset('asset-001')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('asset-001')
      expect(result?.assetCode).toBe('FA-2026-001')
    })

    it('should return null for non-existent asset', async () => {
      const result = await service.getAsset('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('createAsset', () => {
    it('should create a new asset', async () => {
      const newAsset = {
        assetName: '测试设备',
        category: AssetCategory.ELECTRONIC,
        originalValue: 10000,
        residualValue: 1000,
        usefulLife: 60,
        depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
      }

      const result = await service.createAsset(newAsset)

      expect(result).toBeDefined()
      expect(result.assetName).toBe('测试设备')
      expect(result.category).toBe(AssetCategory.ELECTRONIC)
      expect(result.status).toBe(AssetStatus.IN_USE)
      expect(result.monthlyDepreciation).toBeGreaterThan(0)
    })
  })

  describe('updateAsset', () => {
    it('should update an existing asset', async () => {
      const result = await service.updateAsset('asset-001', {
        assetName: '更新后的设备名称',
      })

      expect(result).not.toBeNull()
      expect(result?.assetName).toBe('更新后的设备名称')
    })
  })

  describe('getStats', () => {
    it('should return asset statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('totalAssets')
      expect(result).toHaveProperty('totalOriginalValue')
      expect(result).toHaveProperty('totalNetValue')
      expect(result).toHaveProperty('byCategory')
      expect(result).toHaveProperty('byStatus')
    })
  })
})
