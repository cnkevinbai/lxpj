/**
 * 设备管理控制器
 * API 接口：设备台账、维护保养、故障维修、设备巡检
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import {
  EquipmentService,
  EquipmentStatus,
  EquipmentCategory,
  MaintenanceType,
  MaintenanceStatus,
  FaultLevel,
  FaultStatus,
} from './equipment.service'

@Controller('api/erp/equipment')
export class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  // ========== 设备管理 ==========

  @Get('list')
  getEquipments(@Query() params?: any) {
    return this.service.getEquipments(params)
  }

  @Get(':id')
  getEquipment(@Param('id') id: string) {
    return this.service.getEquipment(id)
  }

  @Post('create')
  createEquipment(@Body() equipment: any) {
    return this.service.createEquipment(equipment)
  }

  @Post(':id/update')
  updateEquipment(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateEquipment(id, updates)
  }

  @Delete(':id')
  deleteEquipment(@Param('id') id: string) {
    return this.service.deleteEquipment(id)
  }

  // ========== 保养管理 ==========

  @Post('maintenance/create')
  createMaintenancePlan(@Body() plan: any) {
    return this.service.createMaintenancePlan(plan)
  }

  @Get('maintenance/list')
  getMaintenancePlans(@Query() params?: any) {
    return this.service.getMaintenancePlans(params)
  }

  @Post('maintenance/:id/complete')
  completeMaintenance(@Param('id') id: string, @Body() result: any) {
    return this.service.completeMaintenance(id, result)
  }

  // ========== 故障管理 ==========

  @Post('fault/create')
  createFaultReport(@Body() report: any) {
    return this.service.createFaultReport(report)
  }

  @Get('fault/list')
  getFaultReports(@Query() params?: any) {
    return this.service.getFaultReports(params)
  }

  @Post('fault/:id/assign')
  assignFault(
    @Param('id') id: string,
    @Body('assigneeId') assigneeId: string,
    @Body('assigneeName') assigneeName: string,
  ) {
    return this.service.assignFault(id, assigneeId, assigneeName)
  }

  @Post('fault/:id/complete')
  completeFault(@Param('id') id: string, @Body() result: any) {
    return this.service.completeFault(id, result)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  getStats() {
    return this.service.getStats()
  }
}
