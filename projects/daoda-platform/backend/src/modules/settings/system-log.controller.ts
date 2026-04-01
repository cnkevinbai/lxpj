/**
 * 系统日志审计控制器
 * 操作日志、登录日志、访问日志、审计报表 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { SystemLogService, LogType, LoginResult, AccessResourceType } from './system-log.service'

@Controller('api/settings/system-log')
export class SystemLogController {
  constructor(private readonly service: SystemLogService) {}

  // ========== 操作日志 ==========

  @Get('logs')
  async getLogs(
    @Query('logType') logType?: LogType,
    @Query('module') module?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.service.getLogs({
      logType,
      module,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      pageSize,
    })
  }

  @Get('logs/:id')
  async getLogDetail(@Param('id') id: string) {
    return this.service.getLogDetail(id)
  }

  // ========== 登录日志 ==========

  @Get('login-logs')
  async getLoginLogs(
    @Query('userId') userId?: string,
    @Query('loginType') loginType?: string,
    @Query('result') result?: LoginResult,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.service.getLoginLogs({
      userId,
      loginType,
      result,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      pageSize,
    })
  }

  // ========== 访问日志 ==========

  @Get('access-logs')
  async getAccessLogs(
    @Query('userId') userId?: string,
    @Query('resourceType') resourceType?: AccessResourceType,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.service.getAccessLogs({
      userId,
      resourceType,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      pageSize,
    })
  }

  // ========== 审计报表 ==========

  @Get('audit-reports')
  async getAuditReports(
    @Query('reportType') reportType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getAuditReports({
      reportType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })
  }

  @Post('audit-reports/generate')
  async generateAuditReport(
    @Body()
    params: {
      reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
      startDate: string
      endDate: string
    },
  ) {
    return this.service.generateAuditReport({
      reportType: params.reportType,
      startDate: new Date(params.startDate),
      endDate: new Date(params.endDate),
    })
  }

  // ========== 日志统计 ==========

  @Get('statistics')
  async getLogStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getLogStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }

  // ========== 日志清理 ==========

  @Post('clean')
  async cleanExpiredLogs(@Body() body: { retentionDays: number }) {
    return this.service.cleanExpiredLogs(body.retentionDays)
  }

  // ========== 日志导出 ==========

  @Post('export')
  async exportLogs(
    @Body()
    params: {
      logType?: LogType
      startDate?: string
      endDate?: string
      format?: 'JSON' | 'CSV' | 'EXCEL'
    },
  ) {
    return this.service.exportLogs({
      logType: params.logType,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      format: params.format,
    })
  }
}
