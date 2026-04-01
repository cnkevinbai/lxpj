/**
 * 预算管理控制器
 * API 接口：预算编制、预算执行、预算控制、预算分析
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import {
  BudgetService,
  BudgetType,
  BudgetCategory,
  BudgetStatus,
  ControlLevel,
} from './budget.service'
import { CreateBudgetDto, ExecuteBudgetDto } from './dto/budget.dto'

@ApiTags('预算管理')
@ApiBearerAuth()
@Controller('api/finance/budget')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  // ========== 预算管理 ==========

  @Get('list')
  @ApiOperation({
    summary: '获取预算列表',
    description: '分页查询预算列表，支持按类型、分类、状态筛选',
  })
  getBudgets(@Query() params?: any) {
    return this.service.getBudgets(params)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取预算详情', description: '根据ID获取预算详细信息' })
  getBudget(@Param('id') id: string) {
    return this.service.getBudget(id)
  }

  @Post('create')
  @ApiOperation({ summary: '创建预算', description: '创建新的预算' })
  createBudget(@Body() budget: CreateBudgetDto) {
    return this.service.createBudget(budget)
  }

  @Post(':id/update')
  @ApiOperation({ summary: '更新预算', description: '更新预算信息（仅草稿状态可修改）' })
  updateBudget(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateBudget(id, updates)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除预算', description: '删除预算（仅草稿状态可删除）' })
  deleteBudget(@Param('id') id: string) {
    return this.service.deleteBudget(id)
  }

  // ========== 预算审批 ==========

  @Post(':id/submit')
  @ApiOperation({ summary: '提交预算', description: '提交预算进入审批流程' })
  submitBudget(@Param('id') id: string, @Body('submittedBy') submittedBy: string) {
    return this.service.submitBudget(id, submittedBy)
  }

  @Post(':id/approve')
  @ApiOperation({ summary: '审批通过', description: '审批通过预算' })
  approveBudget(@Param('id') id: string, @Body('approvedBy') approvedBy: string) {
    return this.service.approveBudget(id, approvedBy)
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '审批拒绝', description: '拒绝预算并说明原因' })
  rejectBudget(
    @Param('id') id: string,
    @Body('rejectedBy') rejectedBy: string,
    @Body('reason') reason: string,
  ) {
    return this.service.rejectBudget(id, rejectedBy, reason)
  }

  // ========== 预算执行 ==========

  @Post('execute')
  @ApiOperation({ summary: '执行预算', description: '记录预算执行，扣减可用余额' })
  executeBudget(@Body() params: ExecuteBudgetDto) {
    return this.service.executeBudget(params as any)
  }

  @Get(':id/executions')
  @ApiOperation({ summary: '获取执行记录', description: '查询预算执行记录列表' })
  getExecutions(@Param('id') id: string, @Query() params?: any) {
    return this.service.getExecutions(id, params)
  }

  // ========== 预算预警 ==========

  @Get('alerts/list')
  @ApiOperation({ summary: '获取预警列表', description: '查询预算预警记录' })
  getAlerts(@Query() params?: any) {
    return this.service.getAlerts(params)
  }

  @Post('alerts/:id/read')
  @ApiOperation({ summary: '标记预警已读', description: '将预警标记为已读' })
  markAlertRead(@Param('id') id: string) {
    return this.service.markAlertRead(id)
  }

  // ========== 预算分析 ==========

  @Get(':id/analysis')
  @ApiOperation({ summary: '预算分析', description: '获取预算执行分析报告' })
  getBudgetAnalysis(@Param('id') id: string) {
    return this.service.getBudgetAnalysis(id)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  @ApiOperation({ summary: '预算统计', description: '获取预算统计数据' })
  getStats() {
    return this.service.getStats()
  }
}
