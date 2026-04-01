/**
 * 质检管理服务
 * 产品质量控制与检验
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

export interface QualityInspection {
  id: string
  inspectionNo: string
  type: 'PURCHASE' | 'PRODUCTION' | 'FINISHED' // 采购检验、生产检验、成品检验
  productId: string
  productName: string
  batchNo?: string
  quantity: number
  passQuantity: number
  failQuantity: number
  passRate: number
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'PARTIAL'
  inspectorId: string
  inspectionDate: Date
  result?: string
  remark?: string
  createdAt: Date
  updatedAt: Date
}

export interface InspectionItem {
  id: string
  inspectionId: string
  standardId: string
  standardName: string
  standardValue: string
  actualValue: string
  isPass: boolean
  remark?: string
}

export interface QualityStandard {
  id: string
  productId: string
  name: string
  category: 'APPEARANCE' | 'DIMENSION' | 'FUNCTION' | 'MATERIAL' | 'OTHER'
  standardValue: string
  tolerance?: string
  isRequired: boolean
  sortOrder: number
}

@Injectable()
export class QualityInspectionService {
  private readonly logger = new Logger(QualityInspectionService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储
  private inspections: Map<string, QualityInspection> = new Map()
  private inspectionItems: Map<string, InspectionItem[]> = new Map()
  private standards: Map<string, QualityStandard[]> = new Map()

  /**
   * 创建质检单
   */
  async create(data: {
    type: 'PURCHASE' | 'PRODUCTION' | 'FINISHED'
    productId: string
    batchNo?: string
    quantity: number
    inspectorId: string
  }): Promise<QualityInspection> {
    // 生成质检单号
    const inspectionNo = `QC${Date.now().toString(36).toUpperCase()}`

    // 获取质检标准
    const standards = this.standards.get(data.productId) || []

    const inspection: QualityInspection = {
      id: Date.now().toString(),
      inspectionNo,
      type: data.type,
      productId: data.productId,
      productName: '',
      batchNo: data.batchNo,
      quantity: data.quantity,
      passQuantity: 0,
      failQuantity: 0,
      passRate: 0,
      status: 'PENDING',
      inspectorId: data.inspectorId,
      inspectionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // 创建检验项
    const items: InspectionItem[] = standards.map((s) => ({
      id: `${inspection.id}-${s.id}`,
      inspectionId: inspection.id,
      standardId: s.id,
      standardName: s.name,
      standardValue: s.standardValue,
      actualValue: '',
      isPass: false,
    }))

    this.inspections.set(inspection.id, inspection)
    this.inspectionItems.set(inspection.id, items)

    this.logger.log(`创建质检单: ${inspectionNo}`)
    return inspection
  }

  /**
   * 开始质检
   */
  async start(id: string) {
    const inspection = this.inspections.get(id)

    if (!inspection) {
      throw new NotFoundException('质检单不存在')
    }

    if (inspection.status !== 'PENDING') {
      throw new BadRequestException('只能开始待检状态的质检单')
    }

    inspection.status = 'IN_PROGRESS'
    inspection.updatedAt = new Date()
    this.inspections.set(id, inspection)

    this.logger.log(`质检单 ${inspection.inspectionNo} 已开始`)
    return inspection
  }

  /**
   * 检验单个项目
   */
  async inspectItem(
    id: string,
    standardId: string,
    data: {
      actualValue: string
      isPass: boolean
      remark?: string
    },
  ) {
    const inspection = this.inspections.get(id)

    if (!inspection) {
      throw new NotFoundException('质检单不存在')
    }

    if (inspection.status !== 'IN_PROGRESS') {
      throw new BadRequestException('质检单未开始或已完成')
    }

    const items = this.inspectionItems.get(id) || []
    const item = items.find((i) => i.standardId === standardId)

    if (!item) {
      throw new NotFoundException('检验项不存在')
    }

    item.actualValue = data.actualValue
    item.isPass = data.isPass
    item.remark = data.remark

    this.inspectionItems.set(id, items)

    return item
  }

  /**
   * 完成质检
   */
  async complete(
    id: string,
    data: {
      passQuantity: number
      failQuantity: number
      result?: string
      remark?: string
    },
  ) {
    const inspection = this.inspections.get(id)

    if (!inspection) {
      throw new NotFoundException('质检单不存在')
    }

    if (inspection.status !== 'IN_PROGRESS') {
      throw new BadRequestException('质检单未开始或已完成')
    }

    inspection.passQuantity = data.passQuantity
    inspection.failQuantity = data.failQuantity
    inspection.passRate =
      inspection.quantity > 0 ? Math.round((data.passQuantity / inspection.quantity) * 100) : 0

    // 根据合格率判断状态
    if (inspection.passRate >= 95) {
      inspection.status = 'PASSED'
    } else if (inspection.passRate >= 60) {
      inspection.status = 'PARTIAL'
    } else {
      inspection.status = 'FAILED'
    }

    inspection.result = data.result
    inspection.remark = data.remark
    inspection.updatedAt = new Date()
    this.inspections.set(id, inspection)

    this.logger.log(`质检单 ${inspection.inspectionNo} 已完成, 合格率 ${inspection.passRate}%`)
    return inspection
  }

  /**
   * 获取质检单列表
   */
  async findAll(params: {
    page?: number
    pageSize?: number
    type?: string
    status?: string
    productId?: string
  }) {
    const { page = 1, pageSize = 10, type, status, productId } = params

    let list = Array.from(this.inspections.values())

    if (type) {
      list = list.filter((i) => i.type === type)
    }

    if (status) {
      list = list.filter((i) => i.status === status)
    }

    if (productId) {
      list = list.filter((i) => i.productId === productId)
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pagedList = list.slice(start, start + pageSize)

    return { list: pagedList, total, page, pageSize }
  }

  /**
   * 获取质检单详情
   */
  async findOne(id: string) {
    const inspection = this.inspections.get(id)

    if (!inspection) {
      throw new NotFoundException('质检单不存在')
    }

    const items = this.inspectionItems.get(id) || []

    return { ...inspection, items }
  }

  /**
   * 获取质检统计
   */
  async getStats() {
    const list = Array.from(this.inspections.values())

    const byType = {
      purchase: list.filter((i) => i.type === 'PURCHASE').length,
      production: list.filter((i) => i.type === 'PRODUCTION').length,
      finished: list.filter((i) => i.type === 'FINISHED').length,
    }

    const byStatus = {
      pending: list.filter((i) => i.status === 'PENDING').length,
      inProgress: list.filter((i) => i.status === 'IN_PROGRESS').length,
      passed: list.filter((i) => i.status === 'PASSED').length,
      partial: list.filter((i) => i.status === 'PARTIAL').length,
      failed: list.filter((i) => i.status === 'FAILED').length,
    }

    const avgPassRate =
      list.length > 0 ? Math.round(list.reduce((sum, i) => sum + i.passRate, 0) / list.length) : 0

    return {
      total: list.length,
      byType,
      byStatus,
      avgPassRate,
    }
  }

  /**
   * 设置质检标准
   */
  async setStandards(productId: string, standards: QualityStandard[]) {
    this.standards.set(productId, standards)
    this.logger.log(`设置产品 ${productId} 质检标准: ${standards.length}项`)
    return standards
  }

  /**
   * 获取质检标准
   */
  getStandards(productId: string) {
    return this.standards.get(productId) || []
  }

  /**
   * 获取不合格记录
   */
  async getFailedRecords(limit: number = 10) {
    const list = Array.from(this.inspections.values())
      .filter((i) => i.status === 'FAILED' || i.status === 'PARTIAL')
      .slice(0, limit)

    return list
  }
}
