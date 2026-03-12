import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, LessThan, MoreThanOrEqual } from 'typeorm'
import { AuditLog, ActionType, EntityType } from './entities/audit-log.entity'
import { ExportLimit, ExportRecord } from './entities/export-limit.entity'

interface CreateLogDto {
  action: ActionType
  entityType: EntityType
  entityId?: string
  userId: string
  userName: string
  changes?: Record<string, any>
  remark?: string
  ip: string
  userAgent?: string
}

interface ExportCheckResult {
  allowed: boolean
  reason?: string
  remainingDaily?: number
  remainingSingle?: number
  requiresApproval?: boolean
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(ExportLimit)
    private exportLimitRepository: Repository<ExportLimit>,
    @InjectRepository(ExportRecord)
    private exportRecordRepository: Repository<ExportRecord>,
  ) {}

  async create(data: CreateLogDto): Promise<AuditLog> {
    const log = this.auditLogRepository.create(data)
    return this.auditLogRepository.save(log)
  }

  /**
   * 记录敏感操作（带异常检测）
   */
  async recordSensitiveAction(
    action: ActionType,
    entityType: EntityType,
    userId: string,
    userName: string,
    ip: string,
    changes?: Record<string, any>,
    remark?: string,
  ): Promise<AuditLog> {
    const log = await this.create({
      action,
      entityType,
      userId,
      userName,
      ip,
      changes,
      remark,
    })

    // 检测异常操作
    await this.detectAnomalies(userId, action, entityType)

    return log
  }

  /**
   * 异常操作检测
   */
  private async detectAnomalies(
    userId: string,
    action: ActionType,
    entityType: EntityType,
  ): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 检查今日操作频率
    const todayCount = await this.auditLogRepository.count({
      where: {
        userId,
        action,
        entityType,
        createdAt: MoreThanOrEqual(today),
      },
    })

    // 阈值告警
    const threshold = this.getAnomalyThreshold(action, entityType)
    if (todayCount > threshold) {
      // 记录告警日志（可以集成通知系统）
      console.warn(`[AUDIT ANOMALY] User ${userId} exceeded threshold for ${action} ${entityType}: ${todayCount}/${threshold}`)
      
      // 可以在此添加通知管理员的逻辑
    }
  }

  /**
   * 获取异常检测阈值
   */
  private getAnomalyThreshold(action: ActionType, entityType: EntityType): number {
    const thresholds: Record<string, number> = {
      'EXPORT-customer': 5,
      'EXPORT-lead': 5,
      'EXPORT-opportunity': 5,
      'EXPORT-order': 5,
      'DELETE-customer': 10,
      'DELETE-lead': 10,
      'LOGIN-user': 5, // 登录失败检测
    }
    return thresholds[`${action}-${entityType}`] || 50
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      userId?: string
      entityType?: string
      action?: string
      startDate?: string
      endDate?: string
    },
  ) {
    const query = this.auditLogRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.userId) {
      query.andWhere('log.userId = :userId', { userId: filters.userId })
    }
    if (filters?.entityType) {
      query.andWhere('log.entityType = :entityType', { entityType: filters.entityType })
    }
    if (filters?.action) {
      query.andWhere('log.action = :action', { action: filters.action })
    }
    if (filters?.startDate) {
      query.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate })
    }
    if (filters?.endDate) {
      query.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findByEntity(entityType: EntityType, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    })
  }

  // ==================== 数据导出限制管理 ====================

  /**
   * 检查导出权限
   */
  async checkExportLimit(
    userId: string,
    dataType: 'customer' | 'lead' | 'opportunity' | 'order' | 'dealer' | 'all',
    recordCount: number,
  ): Promise<ExportCheckResult> {
    const today = new Date().toISOString().split('T')[0]

    // 获取用户导出限制配置
    let limitConfig = await this.exportLimitRepository.findOne({
      where: { userId, dataType },
    })

    // 如果没有个人配置，使用默认配置
    if (!limitConfig) {
      limitConfig = await this.exportLimitRepository.findOne({
        where: { userId: 'default', dataType },
      })

      if (!limitConfig) {
        // 创建默认配置
        limitConfig = this.exportLimitRepository.create({
          userId: 'default',
          dataType,
          dailyLimit: 10,
          singleLimit: 1000,
          requiresApproval: false,
        })
        await this.exportLimitRepository.save(limitConfig)
      }
    }

    // 重置今日计数（如果是新的一天）
    if (limitConfig.lastResetDate !== today) {
      limitConfig.todayCount = 0
      limitConfig.todayRecordCount = 0
      limitConfig.lastResetDate = today
      await this.exportLimitRepository.save(limitConfig)
    }

    // 检查限制
    const remainingDaily = limitConfig.dailyLimit - limitConfig.todayCount
    const remainingSingle = limitConfig.singleLimit

    if (remainingDaily <= 0) {
      return {
        allowed: false,
        reason: '今日导出次数已用完，请明日再试或联系管理员',
        remainingDaily: 0,
        remainingSingle,
        requiresApproval: limitConfig.requiresApproval,
      }
    }

    if (recordCount > remainingSingle) {
      return {
        allowed: false,
        reason: `单次导出记录数不能超过 ${remainingSingle} 条`,
        remainingDaily,
        remainingSingle,
        requiresApproval: limitConfig.requiresApproval,
      }
    }

    return {
      allowed: true,
      remainingDaily,
      remainingSingle,
      requiresApproval: limitConfig.requiresApproval,
    }
  }

  /**
   * 创建导出记录
   */
  async createExportRecord(
    userId: string,
    userName: string,
    dataType: string,
    recordCount: number,
    ip: string,
    userAgent?: string,
    reason?: string,
  ): Promise<ExportRecord> {
    const today = new Date().toISOString().split('T')[0]

    // 更新导出计数
    const limitConfig = await this.exportLimitRepository.findOne({
      where: { userId, dataType: dataType as any },
    })

    if (limitConfig) {
      if (limitConfig.lastResetDate !== today) {
        limitConfig.todayCount = 1
        limitConfig.todayRecordCount = recordCount
        limitConfig.lastResetDate = today
      } else {
        limitConfig.todayCount += 1
        limitConfig.todayRecordCount += recordCount
      }
      await this.exportLimitRepository.save(limitConfig)
    }

    // 创建导出记录
    const record = this.exportRecordRepository.create({
      userId,
      userName,
      dataType,
      recordCount,
      status: limitConfig?.requiresApproval ? 'pending' : 'completed',
      reason,
      ip,
      userAgent,
    })

    return this.exportRecordRepository.save(record)
  }

  /**
   * 获取导出记录列表
   */
  async getExportRecords(
    page: number = 1,
    limit: number = 20,
    filters?: {
      userId?: string
      status?: string
      dataType?: string
      startDate?: string
      endDate?: string
    },
  ) {
    const query = this.exportRecordRepository.createQueryBuilder('record')
      .orderBy('record.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.userId) {
      query.andWhere('record.userId = :userId', { userId: filters.userId })
    }
    if (filters?.status) {
      query.andWhere('record.status = :status', { status: filters.status })
    }
    if (filters?.dataType) {
      query.andWhere('record.dataType = :dataType', { dataType: filters.dataType })
    }
    if (filters?.startDate) {
      query.andWhere('record.createdAt >= :startDate', { startDate: filters.startDate })
    }
    if (filters?.endDate) {
      query.andWhere('record.createdAt <= :endDate', { endDate: filters.endDate })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 审批导出请求
   */
  async approveExport(
    recordId: string,
    approverId: string,
    approverName: string,
    approved: boolean,
    rejectReason?: string,
  ): Promise<ExportRecord> {
    const record = await this.exportRecordRepository.findOne({ where: { id: recordId } })
    if (!record) {
      throw new BadRequestException('导出记录不存在')
    }

    if (record.status !== 'pending') {
      throw new BadRequestException('该导出记录已处理')
    }

    record.status = approved ? 'approved' : 'rejected'
    record.approverId = approverId
    record.approverName = approverName
    record.approvedAt = new Date()
    record.rejectReason = rejectReason

    return this.exportRecordRepository.save(record)
  }

  async export(filters?: any): Promise<AuditLog[]> {
    const query = this.auditLogRepository.createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC')

    if (filters?.startDate) {
      query.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate })
    }
    if (filters?.endDate) {
      query.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate })
    }

    return query.getMany()
  }
}
