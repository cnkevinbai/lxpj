/**
 * 系统监控仪表盘控制器
 * API 接口：系统概览、服务监控、告警管理、任务监控、数据库监控、API监控、日志查看
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import {
  SystemMonitorDashboardService,
  ServiceStatus,
  AlertLevel,
  AlertStatus,
  MetricType,
  ServiceType,
  JobStatus,
  JobType,
  DatabaseType,
  LogLevel,
} from './system-monitor-dashboard.service'

@Controller('api/common/system-monitor')
export class SystemMonitorDashboardController {
  constructor(private readonly service: SystemMonitorDashboardService) {}

  // ========== 系统概览 ==========

  @Get('overview')
  getSystemOverview() {
    return this.service.getSystemOverview()
  }

  // ========== 服务监控 ==========

  @Get('services')
  getServices() {
    return this.service.getServices()
  }

  @Get('services/:id')
  getService(@Param('id') id: string) {
    return this.service.getService(id)
  }

  @Get('services/:id/health')
  getServiceHealth(@Param('id') id: string) {
    return this.service.getServiceHealth(id)
  }

  @Post('services/check-all')
  checkAllServices() {
    return this.service.checkAllServices()
  }

  @Post('services/:id/restart')
  restartService(@Param('id') id: string) {
    return this.service.restartService(id)
  }

  // ========== 性能指标 ==========

  @Get('metrics')
  getMetrics(@Query('type') type?: string) {
    return this.service.getMetrics(type ? (type as MetricType) : undefined)
  }

  @Get('metrics/:type/trend')
  getMetricTrend(@Param('type') type: string, @Query('period') period: string) {
    return this.service.getMetricTrend(type as MetricType, period as any)
  }

  @Post('metrics/refresh')
  refreshMetrics() {
    return this.service.refreshMetrics()
  }

  // ========== 告警管理 ==========

  @Get('alerts')
  getAlerts(@Query() params?: { status?: string; level?: string; source?: string }) {
    return this.service.getAlerts(params as any)
  }

  @Get('alerts/:id')
  getAlert(@Param('id') id: string) {
    return this.service.getAlert(id)
  }

  @Post('alerts')
  createAlert(@Body() alert: any) {
    return this.service.createAlert(alert)
  }

  @Post('alerts/:id/acknowledge')
  acknowledgeAlert(@Param('id') id: string, @Body('acknowledgedBy') acknowledgedBy: string) {
    return this.service.acknowledgeAlert(id, acknowledgedBy)
  }

  @Post('alerts/:id/resolve')
  resolveAlert(@Param('id') id: string) {
    return this.service.resolveAlert(id)
  }

  @Post('alerts/:id/silence')
  silenceAlert(
    @Param('id') id: string,
    @Body('duration') duration: number,
    @Body('silencedBy') silencedBy: string,
  ) {
    return this.service.silenceAlert(id, duration, silencedBy)
  }

  // ========== 告警规则 ==========

  @Get('alert-rules')
  getAlertRules() {
    return this.service.getAlertRules()
  }

  @Get('alert-rules/:id')
  getAlertRule(@Param('id') id: string) {
    return this.service.getAlertRule(id)
  }

  @Post('alert-rules')
  createAlertRule(@Body() rule: any) {
    return this.service.createAlertRule(rule)
  }

  @Post('alert-rules/:id')
  updateAlertRule(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateAlertRule(id, updates)
  }

  @Delete('alert-rules/:id')
  deleteAlertRule(@Param('id') id: string) {
    return this.service.deleteAlertRule(id)
  }

  // ========== 任务监控 ==========

  @Get('jobs')
  getJobs() {
    return this.service.getJobs()
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.service.getJob(id)
  }

  @Get('jobs/stats')
  getJobStats() {
    return this.service.getJobStats()
  }

  @Post('jobs/:id/cancel')
  cancelJob(@Param('id') id: string) {
    return this.service.cancelJob(id)
  }

  @Post('jobs/:id/retry')
  retryJob(@Param('id') id: string) {
    return this.service.retryJob(id)
  }

  // ========== 数据库监控 ==========

  @Get('databases')
  getDatabases() {
    return this.service.getDatabases()
  }

  @Get('databases/:id')
  getDatabase(@Param('id') id: string) {
    return this.service.getDatabase(id)
  }

  @Get('databases/stats')
  getDatabaseStats() {
    return this.service.getDatabaseStats()
  }

  // ========== API监控 ==========

  @Get('api-endpoints')
  getApiEndpoints() {
    return this.service.getApiEndpoints()
  }

  @Get('api-endpoints/detail')
  getApiEndpoint(@Query('path') path: string, @Query('method') method: string) {
    return this.service.getApiEndpoint(path, method)
  }

  @Get('api/stats')
  getApiStats() {
    return this.service.getApiStats()
  }

  // ========== 用户活动 ==========

  @Get('user-activity')
  getUserActivity() {
    return this.service.getUserActivity()
  }

  // ========== 日志查看 ==========

  @Get('logs')
  getLogs(
    @Query()
    params?: {
      level?: string
      service?: string
      source?: string
      search?: string
      limit?: number
    },
  ) {
    return this.service.getLogs(params as any)
  }

  @Get('logs/stats')
  getLogStats() {
    return this.service.getLogStats()
  }

  // ========== 系统操作 ==========

  @Post('cache/clear')
  clearCache() {
    return this.service.clearCache()
  }

  // ========== 统计 ==========

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }
}
