/**
 * SLA 管理控制器
 * 服务级别协议定义与监控 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { SLAService, SLALevel } from './sla.service'

@Controller('api/service/sla')
export class SlaController {
  constructor(private readonly service: SLAService) {}

  // ========== SLA 定义 ==========

  @Get()
  async getAll() {
    return this.service.getAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.getById(id)
  }

  @Get('level/:level')
  async getByLevel(@Param('level') level: SLALevel) {
    return this.service.getByLevel(level)
  }

  @Post()
  async create(
    @Body()
    data: Partial<{
      name: string
      level: SLALevel
      responseTime: number
      resolutionTime: number
      availability: number
      description: string
    }>,
  ) {
    return this.service.create(data)
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      name: string
      level: SLALevel
      responseTime: number
      resolutionTime: number
      availability: number
      description: string
    }>,
  ) {
    return this.service.update(id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id)
  }

  // ========== SLA 激活/停用 ==========

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    return this.service.activate(id)
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.service.deactivate(id)
  }

  // ========== SLA 记录 ==========

  @Post('records')
  async createRecord(@Body() body: { ticketId: string; slaLevel: SLALevel }) {
    return this.service.createRecord(body.ticketId, body.slaLevel)
  }

  @Post('records/:recordId/first-response')
  async recordFirstResponse(@Param('recordId') recordId: string) {
    return this.service.recordFirstResponse(recordId)
  }

  @Post('records/:recordId/resolution')
  async recordResolution(@Param('recordId') recordId: string) {
    return this.service.recordResolution(recordId)
  }

  @Post('records/:recordId/escalate')
  async escalate(@Param('recordId') recordId: string) {
    return this.service.escalate(recordId)
  }

  @Get('records/ticket/:ticketId')
  async getRecordByTicketId(@Param('ticketId') ticketId: string) {
    return this.service.getRecordByTicketId(ticketId)
  }

  // ========== SLA 监控 ==========

  @Get('expiring')
  async getExpiringTickets(@Query('minutes') minutes?: number) {
    return this.service.getExpiringTickets(minutes)
  }

  @Get('breached')
  async getBreachedTickets() {
    return this.service.getBreachedTickets()
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}
