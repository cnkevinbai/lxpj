/**
 * 报表中心控制器
 * API 接口：报表模板、报表实例、报表订阅、仪表盘、KPI指标
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { ReportCenterService, ReportType, ExportFormat } from './report-center.service'

@Controller('api/common/report-center')
export class ReportCenterController {
  constructor(private readonly service: ReportCenterService) {}

  // ========== 报表模板 ==========

  @Get('templates')
  getTemplates(@Query() params?: { category?: string; reportType?: string }) {
    const typedParams = params?.reportType
      ? { ...params, reportType: params.reportType as ReportType }
      : params
    return this.service.getTemplates(typedParams as any)
  }

  @Get('templates/:id')
  getTemplate(@Param('id') id: string) {
    return this.service.getTemplate(id)
  }

  @Post('templates')
  createTemplate(@Body() template: any) {
    return this.service.createTemplate(template)
  }

  @Post('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateTemplate(id, updates)
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.service.deleteTemplate(id)
  }

  // ========== 报表实例 ==========

  @Post('generate')
  generateReport(@Body() params: any) {
    return this.service.generateReport(params)
  }

  @Get('reports')
  getReports(@Query() params?: any) {
    return this.service.getReports(params)
  }

  @Get('reports/:id')
  getReport(@Param('id') id: string) {
    return this.service.getReport(id)
  }

  @Delete('reports/:id')
  deleteReport(@Param('id') id: string) {
    return this.service.deleteReport(id)
  }

  @Post('reports/:id/export')
  exportReport(@Param('id') id: string, @Body('format') format: string) {
    return this.service.exportReport(id, format as ExportFormat)
  }

  // ========== 报表订阅 ==========

  @Get('subscriptions')
  getSubscriptions() {
    return this.service.getSubscriptions()
  }

  @Post('subscriptions')
  createSubscription(@Body() sub: any) {
    return this.service.createSubscription(sub)
  }

  @Post('subscriptions/:id')
  updateSubscription(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateSubscription(id, updates)
  }

  @Delete('subscriptions/:id')
  deleteSubscription(@Param('id') id: string) {
    return this.service.deleteSubscription(id)
  }

  @Post('subscriptions/:id/toggle')
  toggleSubscription(@Param('id') id: string, @Body('enabled') enabled: boolean) {
    return this.service.toggleSubscription(id, enabled)
  }

  // ========== 仪表盘 ==========

  @Get('dashboards')
  getDashboards() {
    return this.service.getDashboards()
  }

  @Get('dashboards/:id')
  getDashboard(@Param('id') id: string) {
    return this.service.getDashboard(id)
  }

  @Get('dashboards/default')
  getDefaultDashboard() {
    return this.service.getDefaultDashboard()
  }

  @Post('dashboards')
  createDashboard(@Body() dashboard: any) {
    return this.service.createDashboard(dashboard)
  }

  @Post('dashboards/:id')
  updateDashboard(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateDashboard(id, updates)
  }

  @Delete('dashboards/:id')
  deleteDashboard(@Param('id') id: string) {
    return this.service.deleteDashboard(id)
  }

  @Post('dashboards/:id/set-default')
  setDefaultDashboard(@Param('id') id: string) {
    return this.service.setDefaultDashboard(id)
  }

  // ========== KPI指标 ==========

  @Get('kpi')
  getKPIMetrics(@Query('module') module?: string) {
    return this.service.getKPIMetrics(module ? { module } : undefined)
  }

  @Post('kpi/refresh')
  refreshKPIs() {
    return this.service.refreshKPIs()
  }

  // ========== 统计 ==========

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }
}
