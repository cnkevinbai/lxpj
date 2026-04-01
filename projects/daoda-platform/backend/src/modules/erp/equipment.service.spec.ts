/**
 * 设备管理服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  EquipmentService,
  EquipmentStatus,
  EquipmentCategory,
  MaintenanceType,
  FaultLevel,
} from './equipment.service'

describe('EquipmentService', () => {
  let service: EquipmentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentService],
    }).compile()

    service = module.get<EquipmentService>(EquipmentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getEquipments', () => {
    it('should return paginated equipments list', async () => {
      const result = await service.getEquipments({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should filter by category', async () => {
      const result = await service.getEquipments({ category: EquipmentCategory.PRODUCTION })

      result.data.forEach((equipment) => {
        expect(equipment.category).toBe(EquipmentCategory.PRODUCTION)
      })
    })

    it('should filter by status', async () => {
      const result = await service.getEquipments({ status: EquipmentStatus.RUNNING })

      result.data.forEach((equipment) => {
        expect(equipment.status).toBe(EquipmentStatus.RUNNING)
      })
    })
  })

  describe('getEquipment', () => {
    it('should return an equipment by id', async () => {
      const result = await service.getEquipment('eq-001')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('eq-001')
      expect(result?.equipmentName).toContain('CNC')
    })

    it('should return null for non-existent equipment', async () => {
      const result = await service.getEquipment('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('createEquipment', () => {
    it('should create a new equipment', async () => {
      const newEquipment = {
        equipmentName: '测试设备',
        category: EquipmentCategory.PRODUCTION,
        specification: 'TEST-100',
        brand: '测试品牌',
        originalValue: 50000,
      }

      const result = await service.createEquipment(newEquipment)

      expect(result).toBeDefined()
      expect(result.equipmentName).toBe('测试设备')
      expect(result.status).toBe(EquipmentStatus.IDLE)
      expect(result.totalFaults).toBe(0)
    })
  })

  describe('createMaintenancePlan', () => {
    it('should create a maintenance plan', async () => {
      const result = await service.createMaintenancePlan({
        equipmentId: 'eq-001',
        maintenanceType: MaintenanceType.MONTHLY,
        scheduledDate: new Date(),
      })

      expect(result).toBeDefined()
      expect(result.equipmentId).toBe('eq-001')
      expect(result.status).toBe('PENDING')
    })
  })

  describe('createFaultReport', () => {
    it('should create a fault report', async () => {
      const result = await service.createFaultReport({
        equipmentId: 'eq-001',
        faultLevel: FaultLevel.MINOR,
        faultDescription: '设备轻微故障',
        reportedBy: 'operator-001',
        reporterName: '操作员',
      })

      expect(result).toBeDefined()
      expect(result.equipmentId).toBe('eq-001')
      expect(result.status).toBe('REPORTED')

      // 检查设备状态已更新
      const equipment = await service.getEquipment('eq-001')
      expect(equipment?.status).toBe(EquipmentStatus.FAULT)
    })
  })

  describe('getStats', () => {
    it('should return equipment statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('totalEquipments')
      expect(result).toHaveProperty('totalValue')
      expect(result).toHaveProperty('byStatus')
      expect(result).toHaveProperty('byCategory')
      expect(result).toHaveProperty('maintenance')
      expect(result).toHaveProperty('faults')
    })
  })
})
