/**
 * 绩效评估控制器
 * 员工绩效考核管理 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { PerformanceService, EvaluationStatus } from './performance.service'

@Controller('api/hr/performance')
export class PerformanceController {
  constructor(private readonly service: PerformanceService) {}

  // ========== KPI 管理 ==========

  @Get('kpis')
  async getAllKPIs(@Query('category') category?: string) {
    return this.service.getAllKPIs(category)
  }

  @Get('kpis/:id')
  async getKPIById(@Param('id') id: string) {
    return this.service.getKPIById(id)
  }

  @Post('kpis')
  async createKPI(
    @Body()
    data: Partial<{
      name: string
      code: string
      category: string
      description: string
      targetValue: number
      weight: number
      unit: string
    }>,
  ) {
    return this.service.createKPI(data)
  }

  // ========== 评估模板 ==========

  @Get('templates')
  async getAllTemplates() {
    return this.service.getAllTemplates()
  }

  @Get('templates/:id')
  async getTemplateById(@Param('id') id: string) {
    return this.service.getTemplateById(id)
  }

  @Post('templates')
  async createTemplate(
    @Body()
    data: Partial<{
      name: string
      description: string
      kpis: string[]
      period: string
    }>,
  ) {
    return this.service.createTemplate(data as any)
  }

  // ========== 绩效评估 ==========

  @Get('evaluations')
  async getAllEvaluations(
    @Query('status') status?: EvaluationStatus,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.service.getAllEvaluations(status, employeeId)
  }

  @Get('evaluations/:id')
  async getEvaluationById(@Param('id') id: string) {
    return this.service.getEvaluationById(id)
  }

  @Post('evaluations')
  async createEvaluation(@Body() body: { templateId: string; employeeId: string; period: string }) {
    return this.service.createEvaluation(body.templateId, body.employeeId, body.period)
  }

  @Post('evaluations/:id/self-evaluation')
  async submitSelfEvaluation(
    @Param('id') id: string,
    @Body()
    body: {
      scores: { kpiId: string; score: number; comments?: string }[]
      overallComments?: string
    },
  ) {
    return this.service.submitSelfEvaluation(id, body.scores, body.overallComments)
  }

  @Post('evaluations/:id/manager-evaluation')
  async submitManagerEvaluation(
    @Param('id') id: string,
    @Body()
    body: {
      scores: { kpiId: string; score: number; comments?: string }[]
      evaluatorId: string
      evaluatorName: string
      overallComments?: string
    },
  ) {
    return this.service.submitManagerEvaluation(
      id,
      body.scores,
      body.evaluatorId,
      body.evaluatorName,
      body.overallComments,
    )
  }

  @Post('evaluations/:id/complete')
  async completeEvaluation(
    @Param('id') id: string,
    @Body() body?: { reviewFeedback?: string; improvementPlan?: string },
  ) {
    return this.service.completeEvaluation(id, body?.reviewFeedback, body?.improvementPlan)
  }

  // ========== 查询 ==========

  @Get('employee/:employeeId/evaluations')
  async getEmployeeEvaluations(@Param('employeeId') employeeId: string) {
    return this.service.getEmployeeEvaluations(employeeId)
  }

  @Get('department/:departmentId/evaluations')
  async getDepartmentEvaluations(@Param('departmentId') departmentId: string) {
    return this.service.getDepartmentEvaluations(departmentId)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}
