/**
 * 设备管理服务
 * 设备台账、维护保养、故障维修、设备巡检
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum EquipmentStatus {
  RUNNING = 'RUNNING', // 运行中
  IDLE = 'IDLE', // 闲置
  MAINTENANCE = 'MAINTENANCE', // 维护中
  FAULT = 'FAULT', // 故障
  SCRAPPED = 'SCRAPPED', // 报废
}

export enum EquipmentCategory {
  PRODUCTION = 'PRODUCTION', // 生产设备
  OFFICE = 'OFFICE', // 办公设备
  TRANSPORT = 'TRANSPORT', // 运输设备
  IT = 'IT', // IT设备
  MEASUREMENT = 'MEASUREMENT', // 计量设备
  SAFETY = 'SAVETY', // 安全设备
  OTHER = 'OTHER', // 其他
}

export enum MaintenanceType {
  DAILY = 'DAILY', // 日常保养
  WEEKLY = 'WEEKLY', // 周保养
  MONTHLY = 'MONTHLY', // 月保养
  QUARTERLY = 'QUARTERLY', // 季度保养
  YEARLY = 'YEARLY', // 年度保养
  EMERGENCY = 'EMERGENCY', // 应急保养
}

export enum MaintenanceStatus {
  PENDING = 'PENDING', // 待执行
  IN_PROGRESS = 'IN_PROGRESS', // 执行中
  COMPLETED = 'COMPLETED', // 已完成
  OVERDUE = 'OVERDUE', // 已超期
}

export enum FaultLevel {
  CRITICAL = 'CRITICAL', // 严重故障
  MAJOR = 'MAJOR', // 主要故障
  MINOR = 'MINOR', // 次要故障
  WARNING = 'WARNING', // 警告
}

export enum FaultStatus {
  REPORTED = 'REPORTED', // 已报告
  ASSIGNED = 'ASSIGNED', // 已派工
  REPAIRING = 'REPAIRING', // 维修中
  COMPLETED = 'COMPLETED', // 已完成
  CLOSED = 'CLOSED', // 已关闭
}

// ========== 导出接口类型 ==========

export interface Equipment {
  id: string
  equipmentCode: string // 设备编号
  equipmentName: string // 设备名称
  category: EquipmentCategory // 设备分类
  specification?: string // 规格型号
  brand?: string // 品牌
  model?: string // 型号

  // 基本信息
  manufacturer?: string // 制造商
  manufactureDate?: Date // 出厂日期
  purchaseDate?: Date // 购置日期
  installationDate?: Date // 安装日期
  warrantyExpiry?: Date // 保修到期

  // 价值信息
  originalValue?: number // 原值
  currentValue?: number // 现值

  // 使用信息
  status: EquipmentStatus // 设备状态
  departmentId?: string // 使用部门ID
  departmentName?: string // 使用部门名称
  location?: string // 安装地点
  custodianId?: string // 保管人ID
  custodianName?: string // 保管人姓名

  // 技术参数
  power?: string // 功率
  voltage?: string // 电压
  weight?: string // 重量
  dimensions?: string // 尺寸
  technicalParams?: Record<string, string> // 其他技术参数

  // 维护信息
  lastMaintenanceDate?: Date // 上次保养日期
  nextMaintenanceDate?: Date // 下次保养日期
  maintenanceCycle?: number // 保养周期（天）

  // 运行统计
  totalRunHours?: number // 累计运行小时
  totalFaults?: number // 累计故障次数

  // 附加信息
  images?: string[] // 图片
  documents?: string[] // 文档
  notes?: string // 备注

  // 系统字段
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface MaintenancePlan {
  id: string
  planCode: string // 计划编号
  planName: string // 计划名称
  equipmentId: string
  equipmentCode: string
  equipmentName: string

  maintenanceType: MaintenanceType
  scheduledDate: Date // 计划日期
  status: MaintenanceStatus

  // 执行信息
  actualDate?: Date // 实际执行日期
  executorId?: string // 执行人ID
  executorName?: string // 执行人姓名

  // 内容信息
  content?: string // 保养内容
  result?: string // 保养结果
  cost?: number // 费用
  parts?: string[] // 更换配件

  notes?: string
  createdAt: Date
  completedAt?: Date
}

export interface FaultReport {
  id: string
  faultCode: string // 故障编号
  equipmentId: string
  equipmentCode: string
  equipmentName: string

  // 故障信息
  faultLevel: FaultLevel
  faultType?: string // 故障类型
  faultDescription: string // 故障描述
  faultImages?: string[] // 故障图片

  // 发现信息
  reportedAt: Date // 报告时间
  reportedBy: string // 报告人
  reporterName: string // 报告人姓名

  // 维修信息
  status: FaultStatus
  assignedTo?: string // 指派人ID
  assigneeName?: string // 指派人姓名
  assignedAt?: Date
  startedAt?: Date
  completedAt?: Date

  // 维修结果
  repairMethod?: string // 维修方法
  repairParts?: string[] // 更换配件
  repairCost?: number // 维修费用
  repairHours?: number // 维修工时

  // 验收信息
  verifiedBy?: string // 验收人
  verifiedAt?: Date
  verifyResult?: string // 验收结果

  notes?: string
  createdAt: Date
}

export interface InspectionRecord {
  id: string
  inspectionCode: string // 巡检编号
  inspectionDate: Date // 巡检日期
  inspectorId: string // 巡检人ID
  inspectorName: string // 巡检人姓名
  location?: string // 巡检区域

  // 统计
  totalItems: number // 巡检项目数
  normalItems: number // 正常数
  abnormalItems: number // 异常数

  status: 'DRAFT' | 'COMPLETED' // 状态
  notes?: string
  createdAt: Date
}

export interface InspectionItem {
  id: string
  inspectionId: string
  equipmentId: string
  equipmentCode: string
  equipmentName: string

  checkItem: string // 检查项目
  checkResult: 'NORMAL' | 'ABNORMAL' // 检查结果
  abnormalDesc?: string // 异常描述
  images?: string[] // 图片

  createdAt: Date
}

@Injectable()
export class EquipmentService {
  // 设备存储
  private equipments: Map<string, Equipment> = new Map()

  // 保养计划存储
  private maintenancePlans: Map<string, MaintenancePlan> = new Map()

  // 故障报告存储
  private faultReports: Map<string, FaultReport> = new Map()

  // 巡检记录存储
  private inspections: Map<string, InspectionRecord> = new Map()
  private inspectionItems: Map<string, InspectionItem> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    const sampleEquipments: Partial<Equipment>[] = [
      {
        id: 'eq-001',
        equipmentCode: 'EQ-2026-001',
        equipmentName: 'CNC数控机床 #1',
        category: EquipmentCategory.PRODUCTION,
        specification: 'VMC850',
        brand: '发那科',
        model: 'FANUC 0i-TF',
        manufacturer: '发那科',
        manufactureDate: new Date('2024-06-01'),
        purchaseDate: new Date('2024-08-15'),
        installationDate: new Date('2024-09-01'),
        warrantyExpiry: new Date('2026-09-01'),
        originalValue: 850000,
        currentValue: 800000,
        status: EquipmentStatus.RUNNING,
        departmentId: 'dept-prod',
        departmentName: '生产部',
        location: '加工车间A区',
        custodianId: 'user-001',
        custodianName: '王师傅',
        power: '15KW',
        voltage: '380V',
        weight: '5500KG',
        lastMaintenanceDate: new Date('2026-03-15'),
        nextMaintenanceDate: new Date('2026-04-15'),
        maintenanceCycle: 30,
        totalRunHours: 2400,
        totalFaults: 2,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'eq-002',
        equipmentCode: 'EQ-2026-002',
        equipmentName: '注塑机 #1',
        category: EquipmentCategory.PRODUCTION,
        specification: '200T',
        brand: '海天',
        model: 'MA2000',
        manufacturer: '海天国际',
        manufactureDate: new Date('2023-03-01'),
        purchaseDate: new Date('2023-05-20'),
        installationDate: new Date('2023-06-10'),
        originalValue: 450000,
        currentValue: 400000,
        status: EquipmentStatus.RUNNING,
        departmentId: 'dept-prod',
        departmentName: '生产部',
        location: '注塑车间',
        power: '22KW',
        voltage: '380V',
        weight: '8500KG',
        lastMaintenanceDate: new Date('2026-03-01'),
        nextMaintenanceDate: new Date('2026-04-01'),
        maintenanceCycle: 30,
        totalRunHours: 3200,
        totalFaults: 1,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'eq-003',
        equipmentCode: 'EQ-2026-003',
        equipmentName: '叉车 #1',
        category: EquipmentCategory.TRANSPORT,
        specification: '3吨内燃叉车',
        brand: '合力',
        model: 'CPCD30',
        manufacturer: '安徽合力',
        purchaseDate: new Date('2025-01-10'),
        originalValue: 120000,
        currentValue: 110000,
        status: EquipmentStatus.RUNNING,
        departmentId: 'dept-wh',
        departmentName: '仓储部',
        location: '仓库区',
        lastMaintenanceDate: new Date('2026-02-20'),
        nextMaintenanceDate: new Date('2026-05-20'),
        maintenanceCycle: 90,
        totalRunHours: 800,
        totalFaults: 0,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleEquipments.forEach((eq) => {
      this.equipments.set(eq.id!, eq as Equipment)
    })
  }

  // ========== 设备管理 ==========

  async getEquipments(params?: {
    category?: EquipmentCategory
    status?: EquipmentStatus
    departmentId?: string
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let list = Array.from(this.equipments.values())

    if (params?.category) {
      list = list.filter((e) => e.category === params.category)
    }
    if (params?.status) {
      list = list.filter((e) => e.status === params.status)
    }
    if (params?.departmentId) {
      list = list.filter((e) => e.departmentId === params.departmentId)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (e) =>
          e.equipmentCode.toLowerCase().includes(kw) || e.equipmentName.toLowerCase().includes(kw),
      )
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = list.length
    const start = (page - 1) * pageSize
    const data = list.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  }

  async getEquipment(id: string): Promise<Equipment | null> {
    return this.equipments.get(id) || null
  }

  async createEquipment(equipment: Partial<Equipment>): Promise<Equipment> {
    const id = `eq-${Date.now()}`
    const equipmentCode =
      equipment.equipmentCode ||
      `EQ-${new Date().getFullYear()}-${String(this.equipments.size + 1).padStart(3, '0')}`

    const newEquipment: Equipment = {
      id,
      equipmentCode,
      equipmentName: equipment.equipmentName!,
      category: equipment.category || EquipmentCategory.OTHER,
      specification: equipment.specification,
      brand: equipment.brand,
      model: equipment.model,
      manufacturer: equipment.manufacturer,
      manufactureDate: equipment.manufactureDate,
      purchaseDate: equipment.purchaseDate,
      installationDate: equipment.installationDate,
      warrantyExpiry: equipment.warrantyExpiry,
      originalValue: equipment.originalValue,
      currentValue: equipment.currentValue,
      status: EquipmentStatus.IDLE,
      departmentId: equipment.departmentId,
      departmentName: equipment.departmentName,
      location: equipment.location,
      custodianId: equipment.custodianId,
      custodianName: equipment.custodianName,
      power: equipment.power,
      voltage: equipment.voltage,
      weight: equipment.weight,
      dimensions: equipment.dimensions,
      technicalParams: equipment.technicalParams,
      maintenanceCycle: equipment.maintenanceCycle || 30,
      totalRunHours: 0,
      totalFaults: 0,
      images: equipment.images || [],
      documents: equipment.documents || [],
      notes: equipment.notes,
      tenantId: equipment.tenantId || 'tenant-001',
      createdBy: equipment.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.equipments.set(id, newEquipment)
    return newEquipment
  }

  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment | null> {
    const equipment = this.equipments.get(id)
    if (!equipment) return null

    const updated = { ...equipment, ...updates, updatedAt: new Date() }
    this.equipments.set(id, updated)
    return updated
  }

  async deleteEquipment(id: string): Promise<boolean> {
    return this.equipments.delete(id)
  }

  // ========== 保养管理 ==========

  async createMaintenancePlan(plan: Partial<MaintenancePlan>): Promise<MaintenancePlan> {
    const equipment = this.equipments.get(plan.equipmentId!)
    if (!equipment) throw new Error('设备不存在')

    const id = `mp-${Date.now()}`
    const planCode = `MP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(this.maintenancePlans.size + 1).padStart(3, '0')}`

    const newPlan: MaintenancePlan = {
      id,
      planCode,
      planName: plan.planName || `${equipment.equipmentName} 保养计划`,
      equipmentId: plan.equipmentId!,
      equipmentCode: equipment.equipmentCode,
      equipmentName: equipment.equipmentName,
      maintenanceType: plan.maintenanceType || MaintenanceType.MONTHLY,
      scheduledDate: plan.scheduledDate || new Date(),
      status: MaintenanceStatus.PENDING,
      content: plan.content,
      notes: plan.notes,
      createdAt: new Date(),
    }

    this.maintenancePlans.set(id, newPlan)
    return newPlan
  }

  async getMaintenancePlans(params?: { equipmentId?: string; status?: MaintenanceStatus }) {
    let list = Array.from(this.maintenancePlans.values())
    if (params?.equipmentId) {
      list = list.filter((p) => p.equipmentId === params.equipmentId)
    }
    if (params?.status) {
      list = list.filter((p) => p.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async completeMaintenance(
    id: string,
    result: { executorId: string; executorName: string; result: string; cost?: number },
  ): Promise<MaintenancePlan | null> {
    const plan = this.maintenancePlans.get(id)
    if (!plan) return null

    plan.status = MaintenanceStatus.COMPLETED
    plan.actualDate = new Date()
    plan.executorId = result.executorId
    plan.executorName = result.executorName
    plan.result = result.result
    plan.cost = result.cost
    plan.completedAt = new Date()
    this.maintenancePlans.set(id, plan)

    // 更新设备保养信息
    const equipment = this.equipments.get(plan.equipmentId)
    if (equipment) {
      equipment.lastMaintenanceDate = plan.actualDate
      equipment.nextMaintenanceDate = new Date(
        Date.now() + (equipment.maintenanceCycle || 30) * 24 * 60 * 60 * 1000,
      )
      equipment.updatedAt = new Date()
      this.equipments.set(equipment.id, equipment)
    }

    return plan
  }

  // ========== 故障管理 ==========

  async createFaultReport(report: Partial<FaultReport>): Promise<FaultReport> {
    const equipment = this.equipments.get(report.equipmentId!)
    if (!equipment) throw new Error('设备不存在')

    const id = `fr-${Date.now()}`
    const faultCode = `FR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(this.faultReports.size + 1).padStart(3, '0')}`

    const newReport: FaultReport = {
      id,
      faultCode,
      equipmentId: report.equipmentId!,
      equipmentCode: equipment.equipmentCode,
      equipmentName: equipment.equipmentName,
      faultLevel: report.faultLevel || FaultLevel.MINOR,
      faultType: report.faultType,
      faultDescription: report.faultDescription!,
      faultImages: report.faultImages || [],
      reportedAt: new Date(),
      reportedBy: report.reportedBy || 'admin',
      reporterName: report.reporterName || '管理员',
      status: FaultStatus.REPORTED,
      notes: report.notes,
      createdAt: new Date(),
    }

    this.faultReports.set(id, newReport)

    // 更新设备状态
    equipment.status = EquipmentStatus.FAULT
    equipment.totalFaults = (equipment.totalFaults || 0) + 1
    equipment.updatedAt = new Date()
    this.equipments.set(equipment.id, equipment)

    return newReport
  }

  async getFaultReports(params?: { equipmentId?: string; status?: FaultStatus }) {
    let list = Array.from(this.faultReports.values())
    if (params?.equipmentId) {
      list = list.filter((r) => r.equipmentId === params.equipmentId)
    }
    if (params?.status) {
      list = list.filter((r) => r.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async assignFault(
    id: string,
    assigneeId: string,
    assigneeName: string,
  ): Promise<FaultReport | null> {
    const report = this.faultReports.get(id)
    if (!report) return null

    report.status = FaultStatus.ASSIGNED
    report.assignedTo = assigneeId
    report.assigneeName = assigneeName
    report.assignedAt = new Date()
    this.faultReports.set(id, report)
    return report
  }

  async completeFault(
    id: string,
    result: { repairMethod: string; cost?: number },
  ): Promise<FaultReport | null> {
    const report = this.faultReports.get(id)
    if (!report) return null

    report.status = FaultStatus.COMPLETED
    report.repairMethod = result.repairMethod
    report.repairCost = result.cost
    report.completedAt = new Date()
    this.faultReports.set(id, report)

    // 更新设备状态
    const equipment = this.equipments.get(report.equipmentId)
    if (equipment) {
      equipment.status = EquipmentStatus.RUNNING
      equipment.updatedAt = new Date()
      this.equipments.set(equipment.id, equipment)
    }

    return report
  }

  // ========== 统计 ==========

  async getStats() {
    const equipments = Array.from(this.equipments.values())
    const plans = Array.from(this.maintenancePlans.values())
    const faults = Array.from(this.faultReports.values())

    return {
      totalEquipments: equipments.length,
      totalValue: equipments.reduce((sum, e) => sum + (e.currentValue || 0), 0),
      byStatus: this.groupBy(equipments, 'status'),
      byCategory: this.groupBy(equipments, 'category'),
      maintenance: {
        total: plans.length,
        pending: plans.filter((p) => p.status === MaintenanceStatus.PENDING).length,
        completed: plans.filter((p) => p.status === MaintenanceStatus.COMPLETED).length,
      },
      faults: {
        total: faults.length,
        pending: faults.filter(
          (f) => f.status !== FaultStatus.COMPLETED && f.status !== FaultStatus.CLOSED,
        ).length,
        critical: faults.filter((f) => f.faultLevel === FaultLevel.CRITICAL).length,
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
}
