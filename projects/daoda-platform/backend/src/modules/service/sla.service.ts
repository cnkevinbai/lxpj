/**
 * SLA服务级别管理服务
 * 服务级别定义、响应时间、解决时间管理
 */
import { Injectable } from '@nestjs/common'

// SLA级别枚举
export enum SLALevel {
  CRITICAL = 'CRITICAL', // 严重 - 最高优先级
  HIGH = 'HIGH', // 高
  MEDIUM = 'MEDIUM', // 中
  LOW = 'LOW', // 低
}

// SLA状态枚举
export enum SLAStatus {
  ACTIVE = 'ACTIVE', // 正常
  INACTIVE = 'INACTIVE', // 停用
  DRAFT = 'DRAFT', // 草稿
}

// SLA类型枚举
export enum SLAType {
  RESPONSE = 'RESPONSE', // 响应时间
  RESOLUTION = 'RESOLUTION', // 解决时间
  UPTIME = 'UPTIME', // 服务可用性
}

// SLA定义接口
export interface SLADefinition {
  id: string
  name: string
  code: string
  level: SLALevel
  status: SLAStatus
  description?: string

  // 响应时间要求
  responseTimeMinutes: number
  responseTimeHours: number

  // 解决时间要求
  resolutionTimeHours: number
  resolutionTimeDays: number

  // 可用性要求 (百分比)
  uptimeTarget?: number

  // 工作时间定义
  workHoursStart: string // 如 "09:00"
  workHoursEnd: string // 如 "18:00"
  workDays: number[] // [1,2,3,4,5] = 周一到周五

  // 通知设置
  notifyBeforeMinutes: number // 提前多少分钟通知
  escalationLevels: number // 升级层级数

  // 统计
  totalTickets?: number
  metTickets?: number
  breachedTickets?: number
  complianceRate?: number

  createdAt: Date
  updatedAt: Date
}

// SLA统计接口
export interface SLAStats {
  totalSLAs: number
  activeSLAs: number
  avgResponseTime: number
  avgResolutionTime: number
  avgCompliance: number
  breachedToday: number
  breachedThisWeek: number
  breachedThisMonth: number
}

// SLA记录接口 (工单关联的SLA执行记录)
export interface SLARecord {
  id: string
  ticketId: string
  slaId: string
  slaName: string
  slaLevel: SLALevel

  // 时间记录
  createdAt: Date
  firstResponseAt?: Date
  resolvedAt?: Date

  // SLA时间计算
  responseDueAt: Date
  resolutionDueAt: Date

  // 状态
  responseMet?: boolean
  resolutionMet?: boolean

  // 耗时(分钟)
  responseTimeMinutes?: number
  resolutionTimeMinutes?: number

  // 升级记录
  escalations?: number
  currentEscalationLevel?: number
}

@Injectable()
export class SLAService {
  private slaDefinitions: Map<string, SLADefinition> = new Map()
  private slaRecords: Map<string, SLARecord> = new Map()

  constructor() {
    this.initDefaultSLAs()
  }

  // 初始化默认SLA定义
  private initDefaultSLAs() {
    const defaultSLAs: Partial<SLADefinition>[] = [
      {
        name: '严重故障SLA',
        code: 'SLA-CRIT',
        level: SLALevel.CRITICAL,
        status: SLAStatus.ACTIVE,
        description: '系统崩溃、核心功能不可用等严重问题',
        responseTimeMinutes: 15,
        responseTimeHours: 0.25,
        resolutionTimeHours: 4,
        resolutionTimeDays: 0.17,
        workHoursStart: '00:00',
        workHoursEnd: '23:59',
        workDays: [0, 1, 2, 3, 4, 5, 6], // 7x24
        notifyBeforeMinutes: 5,
        escalationLevels: 3,
      },
      {
        name: '高优先级SLA',
        code: 'SLA-HIGH',
        level: SLALevel.HIGH,
        status: SLAStatus.ACTIVE,
        description: '重要功能受损、影响业务运营',
        responseTimeMinutes: 30,
        responseTimeHours: 0.5,
        resolutionTimeHours: 8,
        resolutionTimeDays: 0.33,
        workHoursStart: '08:00',
        workHoursEnd: '20:00',
        workDays: [1, 2, 3, 4, 5, 6],
        notifyBeforeMinutes: 10,
        escalationLevels: 2,
      },
      {
        name: '中等优先级SLA',
        code: 'SLA-MED',
        level: SLALevel.MEDIUM,
        status: SLAStatus.ACTIVE,
        description: '功能异常但不影响核心业务',
        responseTimeMinutes: 60,
        responseTimeHours: 1,
        resolutionTimeHours: 24,
        resolutionTimeDays: 1,
        workHoursStart: '09:00',
        workHoursEnd: '18:00',
        workDays: [1, 2, 3, 4, 5],
        notifyBeforeMinutes: 15,
        escalationLevels: 1,
      },
      {
        name: '低优先级SLA',
        code: 'SLA-LOW',
        level: SLALevel.LOW,
        status: SLAStatus.ACTIVE,
        description: '咨询、建议、小问题',
        responseTimeMinutes: 240,
        responseTimeHours: 4,
        resolutionTimeHours: 72,
        resolutionTimeDays: 3,
        workHoursStart: '09:00',
        workHoursEnd: '18:00',
        workDays: [1, 2, 3, 4, 5],
        notifyBeforeMinutes: 30,
        escalationLevels: 0,
      },
    ]

    defaultSLAs.forEach((sla, index) => {
      const id = `SLA-${(index + 1).toString().padStart(3, '0')}`
      const definition: SLADefinition = {
        id,
        name: sla.name!,
        code: sla.code!,
        level: sla.level!,
        status: sla.status!,
        description: sla.description,
        responseTimeMinutes: sla.responseTimeMinutes!,
        responseTimeHours: sla.responseTimeHours!,
        resolutionTimeHours: sla.resolutionTimeHours!,
        resolutionTimeDays: sla.resolutionTimeDays!,
        uptimeTarget: sla.uptimeTarget,
        workHoursStart: sla.workHoursStart!,
        workHoursEnd: sla.workHoursEnd!,
        workDays: sla.workDays!,
        notifyBeforeMinutes: sla.notifyBeforeMinutes!,
        escalationLevels: sla.escalationLevels!,
        totalTickets: Math.floor(Math.random() * 100) + 10,
        metTickets: Math.floor(Math.random() * 80) + 8,
        breachedTickets: Math.floor(Math.random() * 20) + 2,
        complianceRate: Math.floor(Math.random() * 20) + 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.slaDefinitions.set(id, definition)
    })
  }

  // 获取所有SLA定义
  async getAll(): Promise<SLADefinition[]> {
    return Array.from(this.slaDefinitions.values()).sort((a, b) => {
      const levelOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
      return levelOrder[a.level] - levelOrder[b.level]
    })
  }

  // 获取单个SLA定义
  async getById(id: string): Promise<SLADefinition | null> {
    return this.slaDefinitions.get(id) || null
  }

  // 按级别获取SLA
  async getByLevel(level: SLALevel): Promise<SLADefinition[]> {
    return Array.from(this.slaDefinitions.values()).filter((sla) => sla.level === level)
  }

  // 创建SLA定义
  async create(data: Partial<SLADefinition>): Promise<SLADefinition> {
    const id = `SLA-${Date.now().toString(36).toUpperCase()}`

    const definition: SLADefinition = {
      id,
      name: data.name || '',
      code: data.code || '',
      level: data.level || SLALevel.MEDIUM,
      status: data.status || SLAStatus.DRAFT,
      description: data.description,
      responseTimeMinutes: data.responseTimeMinutes || 60,
      responseTimeHours: data.responseTimeHours || 1,
      resolutionTimeHours: data.resolutionTimeHours || 24,
      resolutionTimeDays: data.resolutionTimeDays || 1,
      uptimeTarget: data.uptimeTarget,
      workHoursStart: data.workHoursStart || '09:00',
      workHoursEnd: data.workHoursEnd || '18:00',
      workDays: data.workDays || [1, 2, 3, 4, 5],
      notifyBeforeMinutes: data.notifyBeforeMinutes || 15,
      escalationLevels: data.escalationLevels || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.slaDefinitions.set(id, definition)
    return definition
  }

  // 更新SLA定义
  async update(id: string, data: Partial<SLADefinition>): Promise<SLADefinition | null> {
    const sla = this.slaDefinitions.get(id)
    if (!sla) return null

    const updated: SLADefinition = {
      ...sla,
      ...data,
      updatedAt: new Date(),
    }

    this.slaDefinitions.set(id, updated)
    return updated
  }

  // 删除SLA定义
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const sla = this.slaDefinitions.get(id)
    if (!sla) {
      return { success: false, message: 'SLA不存在' }
    }

    if (sla.totalTickets && sla.totalTickets > 0) {
      return {
        success: false,
        message: `该SLA已关联 ${sla.totalTickets} 个工单，无法删除`,
      }
    }

    this.slaDefinitions.delete(id)
    return { success: true, message: '删除成功' }
  }

  // 激活SLA
  async activate(id: string): Promise<SLADefinition | null> {
    return this.update(id, { status: SLAStatus.ACTIVE })
  }

  // 停用SLA
  async deactivate(id: string): Promise<SLADefinition | null> {
    return this.update(id, { status: SLAStatus.INACTIVE })
  }

  // 创建SLA记录 (工单创建时调用)
  async createRecord(ticketId: string, slaLevel: SLALevel): Promise<SLARecord> {
    // 根据级别查找对应的SLA定义
    const sla = Array.from(this.slaDefinitions.values()).find(
      (s) => s.level === slaLevel && s.status === SLAStatus.ACTIVE,
    )

    if (!sla) {
      // 使用默认中等优先级
      const defaultSla = this.slaDefinitions.get('SLA-003')!
      return this.createSLARecord(ticketId, defaultSla)
    }

    return this.createSLARecord(ticketId, sla)
  }

  // 创建SLA记录内部方法
  private createSLARecord(ticketId: string, sla: SLADefinition): SLARecord {
    const id = `SLA-REC-${Date.now().toString(36).toUpperCase()}`
    const now = new Date()

    // 计算截止时间
    const responseDueAt = new Date(now.getTime() + sla.responseTimeMinutes * 60 * 1000)
    const resolutionDueAt = new Date(now.getTime() + sla.resolutionTimeHours * 60 * 60 * 1000)

    const record: SLARecord = {
      id,
      ticketId,
      slaId: sla.id,
      slaName: sla.name,
      slaLevel: sla.level,
      createdAt: now,
      responseDueAt,
      resolutionDueAt,
      escalations: 0,
      currentEscalationLevel: 0,
    }

    this.slaRecords.set(id, record)

    // 更新SLA统计
    sla.totalTickets = (sla.totalTickets || 0) + 1

    return record
  }

  // 记录首次响应
  async recordFirstResponse(recordId: string): Promise<SLARecord | null> {
    const record = this.slaRecords.get(recordId)
    if (!record) return null

    const now = new Date()
    const responseTimeMinutes = Math.round(
      (now.getTime() - record.createdAt.getTime()) / (60 * 1000),
    )

    const responseMet = now <= record.responseDueAt

    record.firstResponseAt = now
    record.responseTimeMinutes = responseTimeMinutes
    record.responseMet = responseMet

    // 更新SLA统计
    const sla = this.slaDefinitions.get(record.slaId)
    if (sla) {
      if (responseMet) {
        sla.metTickets = (sla.metTickets || 0) + 1
      } else {
        sla.breachedTickets = (sla.breachedTickets || 0) + 1
      }
      sla.complianceRate = Math.round(((sla.metTickets || 0) / (sla.totalTickets || 1)) * 100)
    }

    return record
  }

  // 记录解决时间
  async recordResolution(recordId: string): Promise<SLARecord | null> {
    const record = this.slaRecords.get(recordId)
    if (!record) return null

    const now = new Date()
    const resolutionTimeMinutes = Math.round(
      (now.getTime() - record.createdAt.getTime()) / (60 * 1000),
    )

    const resolutionMet = now <= record.resolutionDueAt

    record.resolvedAt = now
    record.resolutionTimeMinutes = resolutionTimeMinutes
    record.resolutionMet = resolutionMet

    return record
  }

  // 升级SLA
  async escalate(recordId: string): Promise<SLARecord | null> {
    const record = this.slaRecords.get(recordId)
    if (!record) return null

    const sla = this.slaDefinitions.get(record.slaId)
    if (!sla) return null

    const maxLevel = sla.escalationLevels
    if ((record.currentEscalationLevel || 0) >= maxLevel) {
      return record // 已达到最高升级级别
    }

    record.currentEscalationLevel = (record.currentEscalationLevel || 0) + 1
    record.escalations = (record.escalations || 0) + 1

    return record
  }

  // 获取SLA统计
  async getStats(): Promise<SLAStats> {
    const slas = Array.from(this.slaDefinitions.values())
    const records = Array.from(this.slaRecords.values())

    const activeSlas = slas.filter((s) => s.status === SLAStatus.ACTIVE)

    const avgCompliance =
      activeSlas.length > 0
        ? activeSlas.reduce((sum, s) => sum + (s.complianceRate || 0), 0) / activeSlas.length
        : 0

    const avgResponseTime =
      records.length > 0
        ? records.reduce((sum, r) => sum + (r.responseTimeMinutes || 0), 0) /
          records.filter((r) => r.responseTimeMinutes).length
        : 0

    const avgResolutionTime =
      records.length > 0
        ? records.reduce((sum, r) => sum + (r.resolutionTimeMinutes || 0), 0) /
          records.filter((r) => r.resolutionTimeMinutes).length
        : 0

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000)

    const breachedToday = records.filter(
      (r) => r.createdAt >= todayStart && (r.responseMet === false || r.resolutionMet === false),
    ).length

    const breachedThisWeek = records.filter(
      (r) => r.createdAt >= weekStart && (r.responseMet === false || r.resolutionMet === false),
    ).length

    const breachedThisMonth = records.filter(
      (r) => r.createdAt >= monthStart && (r.responseMet === false || r.resolutionMet === false),
    ).length

    return {
      totalSLAs: slas.length,
      activeSLAs: activeSlas.length,
      avgResponseTime: Math.round(avgResponseTime),
      avgResolutionTime: Math.round(avgResolutionTime),
      avgCompliance: Math.round(avgCompliance),
      breachedToday,
      breachedThisWeek,
      breachedThisMonth,
    }
  }

  // 获取即将超时的工单
  async getExpiringTickets(minutes: number = 30): Promise<SLARecord[]> {
    const now = new Date()
    const threshold = new Date(now.getTime() + minutes * 60 * 1000)

    return Array.from(this.slaRecords.values())
      .filter(
        (r) =>
          (!r.firstResponseAt && r.responseDueAt <= threshold) ||
          (!r.resolvedAt && r.resolutionDueAt <= threshold),
      )
      .sort((a, b) => a.responseDueAt.getTime() - b.responseDueAt.getTime())
  }

  // 获取已超时的工单
  async getBreachedTickets(): Promise<SLARecord[]> {
    return Array.from(this.slaRecords.values())
      .filter((r) => r.responseMet === false || r.resolutionMet === false)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 获取工单的SLA记录
  async getRecordByTicketId(ticketId: string): Promise<SLARecord | null> {
    return Array.from(this.slaRecords.values()).find((r) => r.ticketId === ticketId) || null
  }
}
