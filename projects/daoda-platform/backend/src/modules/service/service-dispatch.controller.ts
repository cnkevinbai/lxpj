/**
 * 服务调度控制器
 * 工程师排班、任务分配、工作量平衡 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import {
  ServiceDispatchService,
  ScheduleStatus,
  ServiceType,
  Priority,
} from './service-dispatch.service'

@Controller('api/service/dispatch')
export class ServiceDispatchController {
  constructor(private readonly service: ServiceDispatchService) {}

  // ========== 工程师管理 ==========

  @Get('engineers')
  async getEngineers(
    @Query('status') status?: string,
    @Query('skills') skills?: string,
    @Query('region') region?: string,
  ) {
    return this.service.getEngineers({ status: status as any, skill: skills })
  }

  @Get('engineers/:id')
  async getEngineer(@Param('id') id: string) {
    return this.service.getEngineer(id)
  }

  // ========== 服务任务 ==========

  @Get('tasks')
  async getServiceTasks(
    @Query('status') status?: string,
    @Query('priority') priority?: Priority,
    @Query('type') type?: ServiceType,
    @Query('assignedEngineerId') assignedEngineerId?: string,
  ) {
    return this.service.getServiceTasks({ status, priority, type, engineerId: assignedEngineerId })
  }

  @Get('tasks/:id')
  async getServiceTask(@Param('id') id: string) {
    return this.service.getServiceTask(id)
  }

  // ========== 排班记录 ==========

  @Get('schedules')
  async getScheduleRecords(
    @Query('engineerId') engineerId?: string,
    @Query('date') date?: string,
    @Query('shift') shift?: string,
  ) {
    return this.service.getScheduleRecords({ engineerId, date: date ? new Date(date) : undefined })
  }

  // ========== 调度建议 ==========

  @Get('tasks/:taskId/suggestions')
  async getScheduleSuggestions(@Param('taskId') taskId: string) {
    return this.service.getScheduleSuggestions(taskId)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getDispatchStats() {
    return this.service.getDispatchStats()
  }

  @Get('stats/workload')
  async getWorkloadBalance() {
    return this.service.getWorkloadBalance()
  }
}
