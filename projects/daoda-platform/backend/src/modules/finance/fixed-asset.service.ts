/**
 * 固定资产管理服务
 * 资产台账、折旧计算、资产盘点、资产处置
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum AssetStatus {
  IN_USE = 'IN_USE', // 使用中
  IDLE = 'IDLE', // 闲置
  MAINTENANCE = 'MAINTENANCE', // 维修中
  DISPOSED = 'DISPOSED', // 已处置
  SCRAPPED = 'SCRAPPED', // 已报废
}

export enum AssetCategory {
  LAND = 'LAND', // 土地
  BUILDING = 'BUILDING', // 房屋建筑
  MACHINERY = 'MACHINERY', // 机器设备
  VEHICLE = 'VEHICLE', // 运输设备
  ELECTRONIC = 'ELECTRONIC', // 电子设备
  FURNITURE = 'FURNITURE', // 家具用具
  OFFICE = 'OFFICE', // 办公设备
  OTHER = 'OTHER', // 其他
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE', // 直线法
  DOUBLE_DECLINING = 'DOUBLE_DECLINING', // 双倍余额递减法
  SUM_OF_YEARS = 'SUM_OF_YEARS', // 年数总和法
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION', // 工作量法
}

export enum DisposeType {
  SALE = 'SALE', // 出售
  TRANSFER = 'TRANSFER', // 转让
  SCRAP = 'SCRAP', // 报废
  DONATION = 'DONATION', // 捐赠
  LOSS = 'LOSS', // 丢失
}

// ========== 导出接口类型 ==========

export interface FixedAsset {
  id: string
  assetCode: string // 资产编号
  assetName: string // 资产名称
  category: AssetCategory // 资产分类
  specification?: string // 规格型号
  brand?: string // 品牌
  model?: string // 型号
  unit?: string // 单位
  quantity: number // 数量

  // 价值信息
  originalValue: number // 原值
  residualValue: number // 残值
  netValue: number // 净值
  accumulatedDepreciation: number // 累计折旧

  // 折旧信息
  depreciationMethod: DepreciationMethod // 折旧方法
  usefulLife: number // 使用年限（月）
  usedMonths: number // 已使用月数
  monthlyDepreciation: number // 月折旧额

  // 时间信息
  purchaseDate: Date // 购置日期
  startDate: Date // 开始使用日期
  warrantyExpiry?: Date // 保修到期日

  // 位置信息
  departmentId?: string // 使用部门ID
  departmentName?: string // 使用部门名称
  location?: string // 存放地点
  custodianId?: string // 保管人ID
  custodianName?: string // 保管人姓名

  // 状态信息
  status: AssetStatus // 资产状态

  // 供应商信息
  supplierId?: string // 供应商ID
  supplierName?: string // 供应商名称
  invoiceNumber?: string // 发票号码

  // 附加信息
  notes?: string // 备注
  images?: string[] // 图片
  documents?: string[] // 文档

  // 系统字段
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface DepreciationRecord {
  id: string
  assetId: string
  assetCode: string
  assetName: string
  period: string // 期间 YYYY-MM
  depreciationAmount: number // 折旧金额
  accumulatedDepreciation: number // 累计折旧
  netValue: number // 净值
  status: 'PENDING' | 'POSTED' // 状态：待过账/已过账
  postedAt?: Date
  postedBy?: string
  createdAt: Date
}

export interface AssetInventory {
  id: string
  inventoryCode: string // 盘点编号
  inventoryDate: Date // 盘点日期
  departmentId?: string // 盘点部门
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

  // 统计信息
  totalAssets: number // 应盘数量
  countedAssets: number // 已盘数量
  normalAssets: number // 正常数量
  surplusAssets: number // 盘盈数量
  deficitAssets: number // 盘亏数量

  notes?: string
  createdById: string
  createdByName: string
  createdAt: Date
  completedAt?: Date
}

export interface AssetInventoryItem {
  id: string
  inventoryId: string
  assetId: string
  assetCode: string
  assetName: string
  bookQuantity: number // 账面数量
  actualQuantity: number // 实盘数量
  difference: number // 差异
  differenceType: 'NORMAL' | 'SURPLUS' | 'DEFICIT'
  bookValue: number // 账面价值
  actualValue: number // 实盘价值
  notes?: string
  countedBy: string
  countedAt: Date
}

export interface AssetDispose {
  id: string
  disposeCode: string // 处置编号
  assetId: string
  assetCode: string
  assetName: string

  disposeType: DisposeType // 处置方式
  disposeDate: Date // 处置日期
  disposeReason: string // 处置原因

  // 价值信息
  bookValue: number // 账面价值
  accumulatedDepreciation: number // 累计折旧
  netValue: number // 净值
  disposeValue: number // 处置价值（出售收入等）
  gainLoss: number // 损益

  // 审批信息
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  approvedBy?: string
  approvedAt?: Date

  notes?: string
  createdBy: string
  createdAt: Date
}

@Injectable()
export class FixedAssetService {
  // 资产存储
  private assets: Map<string, FixedAsset> = new Map()

  // 折旧记录存储
  private depreciations: Map<string, DepreciationRecord> = new Map()

  // 盘点记录存储
  private inventories: Map<string, AssetInventory> = new Map()
  private inventoryItems: Map<string, AssetInventoryItem> = new Map()

  // 处置记录存储
  private disposes: Map<string, AssetDispose> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    // 示例资产数据
    const sampleAssets: Partial<FixedAsset>[] = [
      {
        id: 'asset-001',
        assetCode: 'FA-2026-001',
        assetName: 'Dell PowerEdge R740 服务器',
        category: AssetCategory.ELECTRONIC,
        specification: '2U机架式服务器',
        brand: 'Dell',
        model: 'PowerEdge R740',
        unit: '台',
        quantity: 1,
        originalValue: 150000,
        residualValue: 15000,
        netValue: 142500,
        accumulatedDepreciation: 7500,
        depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
        usefulLife: 60,
        usedMonths: 3,
        monthlyDepreciation: 2250,
        purchaseDate: new Date('2026-01-15'),
        startDate: new Date('2026-01-20'),
        departmentId: 'dept-001',
        departmentName: '信息技术部',
        location: '机房A区',
        custodianId: 'user-001',
        custodianName: '张三',
        status: AssetStatus.IN_USE,
        supplierId: 'supplier-001',
        supplierName: '戴尔科技',
        invoiceNumber: 'INV-2026-001',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'asset-002',
        assetCode: 'FA-2026-002',
        assetName: '奔驰 V260 商务车',
        category: AssetCategory.VEHICLE,
        specification: '7座商务车',
        brand: 'Mercedes-Benz',
        model: 'V260',
        unit: '辆',
        quantity: 1,
        originalValue: 450000,
        residualValue: 45000,
        netValue: 427500,
        accumulatedDepreciation: 22500,
        depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
        usefulLife: 120,
        usedMonths: 6,
        monthlyDepreciation: 3375,
        purchaseDate: new Date('2025-10-01'),
        startDate: new Date('2025-10-10'),
        departmentId: 'dept-002',
        departmentName: '行政部',
        location: '公司停车场',
        custodianId: 'user-002',
        custodianName: '李四',
        status: AssetStatus.IN_USE,
        supplierId: 'supplier-002',
        supplierName: '奔驰4S店',
        invoiceNumber: 'INV-2025-088',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'asset-003',
        assetCode: 'FA-2026-003',
        assetName: '办公室空调',
        category: AssetCategory.ELECTRONIC,
        specification: '5匹柜式空调',
        brand: '格力',
        model: 'KFR-120LW',
        unit: '台',
        quantity: 10,
        originalValue: 80000,
        residualValue: 8000,
        netValue: 76000,
        accumulatedDepreciation: 4000,
        depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
        usefulLife: 120,
        usedMonths: 6,
        monthlyDepreciation: 600,
        purchaseDate: new Date('2025-10-01'),
        startDate: new Date('2025-10-15'),
        departmentId: 'dept-002',
        departmentName: '行政部',
        location: '各办公室',
        status: AssetStatus.IN_USE,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleAssets.forEach((asset) => {
      this.assets.set(asset.id!, asset as FixedAsset)
    })
  }

  // ========== 资产管理 ==========

  async getAssets(params?: {
    category?: AssetCategory
    status?: AssetStatus
    departmentId?: string
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let list = Array.from(this.assets.values())

    if (params?.category) {
      list = list.filter((a) => a.category === params.category)
    }
    if (params?.status) {
      list = list.filter((a) => a.status === params.status)
    }
    if (params?.departmentId) {
      list = list.filter((a) => a.departmentId === params.departmentId)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (a) => a.assetCode.toLowerCase().includes(kw) || a.assetName.toLowerCase().includes(kw),
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

  async getAsset(id: string): Promise<FixedAsset | null> {
    return this.assets.get(id) || null
  }

  async createAsset(asset: Partial<FixedAsset>): Promise<FixedAsset> {
    const id = `asset-${Date.now()}`
    const assetCode =
      asset.assetCode ||
      `FA-${new Date().getFullYear()}-${String(this.assets.size + 1).padStart(3, '0')}`

    // 计算月折旧额
    const monthlyDepreciation = this.calculateMonthlyDepreciation(
      asset.originalValue || 0,
      asset.residualValue || 0,
      asset.usefulLife || 60,
      asset.depreciationMethod || DepreciationMethod.STRAIGHT_LINE,
    )

    const newAsset: FixedAsset = {
      id,
      assetCode,
      assetName: asset.assetName!,
      category: asset.category || AssetCategory.OTHER,
      specification: asset.specification,
      brand: asset.brand,
      model: asset.model,
      unit: asset.unit || '件',
      quantity: asset.quantity || 1,
      originalValue: asset.originalValue || 0,
      residualValue: asset.residualValue || 0,
      netValue: asset.originalValue || 0,
      accumulatedDepreciation: 0,
      depreciationMethod: asset.depreciationMethod || DepreciationMethod.STRAIGHT_LINE,
      usefulLife: asset.usefulLife || 60,
      usedMonths: 0,
      monthlyDepreciation,
      purchaseDate: asset.purchaseDate || new Date(),
      startDate: asset.startDate || new Date(),
      warrantyExpiry: asset.warrantyExpiry,
      departmentId: asset.departmentId,
      departmentName: asset.departmentName,
      location: asset.location,
      custodianId: asset.custodianId,
      custodianName: asset.custodianName,
      status: AssetStatus.IN_USE,
      supplierId: asset.supplierId,
      supplierName: asset.supplierName,
      invoiceNumber: asset.invoiceNumber,
      notes: asset.notes,
      images: asset.images || [],
      documents: asset.documents || [],
      tenantId: asset.tenantId || 'tenant-001',
      createdBy: asset.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.assets.set(id, newAsset)
    return newAsset
  }

  async updateAsset(id: string, updates: Partial<FixedAsset>): Promise<FixedAsset | null> {
    const asset = this.assets.get(id)
    if (!asset) return null

    const updated = {
      ...asset,
      ...updates,
      updatedAt: new Date(),
    }
    this.assets.set(id, updated)
    return updated
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id)
  }

  // ========== 折旧管理 ==========

  private calculateMonthlyDepreciation(
    originalValue: number,
    residualValue: number,
    usefulLife: number,
    method: DepreciationMethod,
  ): number {
    switch (method) {
      case DepreciationMethod.STRAIGHT_LINE:
        return (originalValue - residualValue) / usefulLife
      case DepreciationMethod.DOUBLE_DECLINING:
        return (originalValue * 2) / usefulLife
      default:
        return (originalValue - residualValue) / usefulLife
    }
  }

  async calculateDepreciation(assetId: string, period: string): Promise<DepreciationRecord> {
    const asset = this.assets.get(assetId)
    if (!asset) throw new Error('资产不存在')

    const monthlyDep = asset.monthlyDepreciation
    const newAccDep = asset.accumulatedDepreciation + monthlyDep
    const newNetValue = asset.originalValue - newAccDep

    const record: DepreciationRecord = {
      id: `dep-${Date.now()}`,
      assetId,
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      period,
      depreciationAmount: monthlyDep,
      accumulatedDepreciation: newAccDep,
      netValue: newNetValue,
      status: 'PENDING',
      createdAt: new Date(),
    }

    this.depreciations.set(record.id, record)
    return record
  }

  async postDepreciation(id: string, postedBy: string): Promise<DepreciationRecord | null> {
    const record = this.depreciations.get(id)
    if (!record) return null

    const asset = this.assets.get(record.assetId)
    if (!asset) return null

    // 更新资产折旧信息
    asset.accumulatedDepreciation = record.accumulatedDepreciation
    asset.netValue = record.netValue
    asset.usedMonths += 1
    asset.updatedAt = new Date()
    this.assets.set(asset.id, asset)

    // 更新折旧记录状态
    record.status = 'POSTED'
    record.postedAt = new Date()
    record.postedBy = postedBy
    this.depreciations.set(id, record)

    return record
  }

  async getDepreciationRecords(params?: { assetId?: string; period?: string; status?: string }) {
    let list = Array.from(this.depreciations.values())

    if (params?.assetId) {
      list = list.filter((r) => r.assetId === params.assetId)
    }
    if (params?.period) {
      list = list.filter((r) => r.period === params.period)
    }
    if (params?.status) {
      list = list.filter((r) => r.status === params.status)
    }

    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // ========== 盘点管理 ==========

  async createInventory(inventory: Partial<AssetInventory>): Promise<AssetInventory> {
    const id = `inv-${Date.now()}`
    const inventoryCode = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(this.inventories.size + 1).padStart(3, '0')}`

    const newInventory: AssetInventory = {
      id,
      inventoryCode,
      inventoryDate: inventory.inventoryDate || new Date(),
      departmentId: inventory.departmentId,
      status: 'DRAFT',
      totalAssets: this.assets.size,
      countedAssets: 0,
      normalAssets: 0,
      surplusAssets: 0,
      deficitAssets: 0,
      notes: inventory.notes,
      createdById: inventory.createdById || 'admin',
      createdByName: inventory.createdByName || '管理员',
      createdAt: new Date(),
    }

    this.inventories.set(id, newInventory)
    return newInventory
  }

  async getInventories(params?: { status?: string }) {
    let list = Array.from(this.inventories.values())
    if (params?.status) {
      list = list.filter((i) => i.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getInventory(id: string): Promise<AssetInventory | null> {
    return this.inventories.get(id) || null
  }

  // ========== 处置管理 ==========

  async createDispose(dispose: Partial<AssetDispose>): Promise<AssetDispose> {
    const asset = this.assets.get(dispose.assetId!)
    if (!asset) throw new Error('资产不存在')

    const id = `disp-${Date.now()}`
    const disposeCode = `DISP-${new Date().getFullYear()}-${String(this.disposes.size + 1).padStart(3, '0')}`

    const gainLoss = (dispose.disposeValue || 0) - asset.netValue

    const newDispose: AssetDispose = {
      id,
      disposeCode,
      assetId: dispose.assetId!,
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      disposeType: dispose.disposeType || DisposeType.SCRAP,
      disposeDate: dispose.disposeDate || new Date(),
      disposeReason: dispose.disposeReason || '',
      bookValue: asset.originalValue,
      accumulatedDepreciation: asset.accumulatedDepreciation,
      netValue: asset.netValue,
      disposeValue: dispose.disposeValue || 0,
      gainLoss,
      status: 'PENDING',
      notes: dispose.notes,
      createdBy: dispose.createdBy || 'admin',
      createdAt: new Date(),
    }

    this.disposes.set(id, newDispose)
    return newDispose
  }

  async getDisposes(params?: { status?: string }) {
    let list = Array.from(this.disposes.values())
    if (params?.status) {
      list = list.filter((d) => d.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async approveDispose(id: string, approvedBy: string): Promise<AssetDispose | null> {
    const dispose = this.disposes.get(id)
    if (!dispose) return null

    dispose.status = 'APPROVED'
    dispose.approvedBy = approvedBy
    dispose.approvedAt = new Date()
    this.disposes.set(id, dispose)

    // 更新资产状态
    const asset = this.assets.get(dispose.assetId)
    if (asset) {
      asset.status = AssetStatus.DISPOSED
      asset.updatedAt = new Date()
      this.assets.set(asset.id, asset)
    }

    return dispose
  }

  // ========== 统计 ==========

  async getStats() {
    const assets = Array.from(this.assets.values())

    return {
      totalAssets: assets.length,
      totalOriginalValue: assets.reduce((sum, a) => sum + a.originalValue, 0),
      totalNetValue: assets.reduce((sum, a) => sum + a.netValue, 0),
      totalDepreciation: assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0),
      byCategory: this.groupBy(assets, 'category'),
      byStatus: this.groupBy(assets, 'status'),
      byDepartment: this.groupBy(assets, 'departmentName'),
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
