/**
 * 操作日志服务
 * 处理操作日志的 CRUD 操作
 */
import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { LogStatus } from '@prisma/client'
import { LogQueryDto, LogListResponse, LogResponse } from './log.dto'

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 创建操作日志
   */
  async create(data: any): Promise<any> {
    return this.prisma.operationLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        module: data.module,
        ip: data.ip,
        userAgent: data.userAgent,
        params: data.params,
        duration: data.duration,
        status: data.status || LogStatus.SUCCESS,
        error: data.error,
      },
    })
  }

  /**
   * 获取操作日志详情
   */
  async findOne(id: string): Promise<LogResponse> {
    const log = await this.prisma.operationLog.findUnique({
      where: { id },
    })
    if (!log) {
      throw new NotFoundException('操作日志不存在')
    }
    return this.mapToResponse(log)
  }

  /**
   * 获取操作日志列表（分页）
   */
  async findAll(query: LogQueryDto): Promise<LogListResponse> {
    const {
      page = 1,
      pageSize = 10,
      username,
      action,
      method,
      status,
      startTime,
      endTime,
      includeParams = false,
    } = query

    // 构建查询条件
    const where: any = {}

    if (username) {
      where.username = { contains: username, mode: 'insensitive' }
    }

    if (action) {
      where.operation = { contains: action, mode: 'insensitive' }
    }

    if (method) {
      where.method = method
    }

    if (status) {
      where.status = status
    }

    // 时间范围筛选
    if (startTime || endTime) {
      where.createdAt = {}
      if (startTime) {
        where.createdAt.gte = new Date(startTime)
      }
      if (endTime) {
        where.createdAt.lte = new Date(endTime)
      }
    }

    // 查询总数
    const total = await this.prisma.operationLog.count({ where })

    // 查询列表
    const list = await this.prisma.operationLog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    const logs = list.map((log) => this.mapToResponse(log))
    return {
      list: includeParams ? logs : logs.map((log) => ({ ...log, params: null })),
      total,
      page,
      pageSize,
    }
  }

  /**
   * 批量查询操作日志
   */
  async findMany(
    userId?: string,
    action?: string,
    status?: LogStatus,
    startTime?: string,
    endTime?: string,
  ): Promise<any[]> {
    // 构建查询条件
    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (action) {
      where.operation = { contains: action, mode: 'insensitive' }
    }

    if (status) {
      where.status = status
    }

    // 时间范围筛选
    if (startTime || endTime) {
      where.createdAt = {}
      if (startTime) {
        where.createdAt.gte = new Date(startTime)
      }
      if (endTime) {
        where.createdAt.lte = new Date(endTime)
      }
    }

    // 查询列表
    return this.prisma.operationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * 删除操作日志
   */
  async delete(id: string): Promise<void> {
    // 检查日志是否存在
    const log = await this.prisma.operationLog.findUnique({
      where: { id },
    })
    if (!log) {
      throw new NotFoundException('操作日志不存在')
    }

    // 删除
    await this.prisma.operationLog.delete({
      where: { id },
    })

    this.logger.log(`删除操作日志: ${id}`)
  }

  /**
   * 清空操作日志
   */
  async clear(): Promise<number> {
    const result = await this.prisma.operationLog.deleteMany({})
    this.logger.log(`清空操作日志: ${result.count} 条记录`)
    return result.count
  }

  /**
   * 批量清除日志（超过指定天数）
   */
  async clearOldLogs(days: number = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const result = await this.prisma.operationLog.deleteMany({
      where: {
        createdAt: {
          lte: cutoffDate,
        },
      },
    })

    this.logger.log(`批量清除操作日志: ${result.count} 条记录`)
    return result.count
  }

  /**
   * 获取操作日志统计
   */
  async getStatistics(startTime?: string, endTime?: string): Promise<any> {
    // 构建时间范围
    const where: any = {}
    if (startTime || endTime) {
      where.createdAt = {}
      if (startTime) {
        where.createdAt.gte = new Date(startTime)
      }
      if (endTime) {
        where.createdAt.lte = new Date(endTime)
      }
    }

    // 按状态统计
    const statusCount = await this.prisma.operationLog.groupBy({
      by: ['status'],
      where,
      _count: true,
    })

    // 按天统计（最近30天）
    const dailyCount = await this.prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as successCount,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failCount
      FROM operation_logs
      WHERE createdAt >= COALESCE(${startTime}, NOW() - INTERVAL '30 days')
        AND createdAt <= COALESCE(${endTime}, NOW())
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
      LIMIT 30
    `

    return {
      statusCount,
      dailyCount,
    }
  }

  /**
   * 映射到响应 DTO
   */
  private mapToResponse(log: any): LogResponse {
    return {
      id: log.id,
      userId: log.userId || null,
      username: log.username || null,
      action: log.operation,
      method: log.method,
      path: log.url,
      ip: log.ip || null,
      userAgent: log.userAgent || null,
      params: log.params || null,
      result: log.result || null,
      duration: log.duration || null,
      status: log.status,
      createdAt: log.createdAt,
    }
  }
}
