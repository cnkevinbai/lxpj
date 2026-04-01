/**
 * 流程监控控制器
 * 流程执行监控、性能分析、瓶颈识别 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ProcessMonitoringService, ProcessStatus } from './process-monitoring.service'

@Controller('api/workflow/process-monitoring')
export class ProcessMonitoringController {
  constructor(private readonly service: ProcessMonitoringService) {}

  // ========== 流程实例监控 ==========

  @Get('instances')
  async getProcessInstances(
    @Query('definitionId') definitionId?: string,
    @Query('status') status?: ProcessStatus,
    @Query('initiatorId') initiatorId?: string,
  ) {
    return this.service.getProcessInstances({ definitionId, status, initiatorId })
  }

  @Get('instances/:id')
  async getProcessInstance(@Param('id') id: string) {
    return this.service.getProcessInstance(id)
  }

  // ========== 节点执行详情 ==========

  @Get('instances/:processId/nodes/:nodeId')
  async getNodeExecutionDetails(
    @Param('processId') processId: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.service.getNodeExecutionDetails(processId, nodeId)
  }

  // ========== 性能指标 ==========

  @Get('metrics')
  async getProcessMetrics(@Query('definitionId') definitionId?: string) {
    return this.service.getProcessMetrics(definitionId)
  }

  // ========== 流程告警 ==========

  @Get('alerts')
  async getProcessAlerts(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('resolved') resolved?: string,
  ) {
    return this.service.getProcessAlerts({ type, severity, resolved: resolved === 'true' })
  }

  @Post('alerts/:id/resolve')
  async resolveAlert(@Param('id') id: string, @Body() body: { resolvedBy: string }) {
    return this.service.resolveAlert(id, body.resolvedBy)
  }

  // ========== 瓶颈分析 ==========

  @Get('bottleneck-analysis')
  async getBottleneckAnalysis() {
    return this.service.getBottleneckAnalysis()
  }

  // ========== 监控统计 ==========

  @Get('stats')
  async getMonitoringStats() {
    return this.service.getMonitoringStats()
  }
}
