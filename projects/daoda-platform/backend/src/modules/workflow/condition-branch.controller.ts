/**
 * 条件分支审批控制器
 * 条件表达式解析、分支路由、动态审批路径 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ConditionBranchService, ConditionType } from './condition-branch.service'

@Controller('api/workflow/condition-branch')
export class ConditionBranchController {
  constructor(private readonly service: ConditionBranchService) {}

  // ========== 条件规则查询 ==========

  @Get('rules')
  async getConditionRules(@Query('type') type?: ConditionType, @Query('enabled') enabled?: string) {
    return this.service.getConditionRules({ type, enabled: enabled === 'true' })
  }

  @Get('rules/:id')
  async getConditionRule(@Param('id') id: string) {
    return this.service.getConditionRule(id)
  }

  // ========== 分支路由查询 ==========

  @Get('routes')
  async getBranchRoutes(@Query('nodeId') nodeId?: string) {
    return this.service.getBranchRoutes(nodeId)
  }

  // ========== 条件分支节点查询 ==========

  @Get('nodes')
  async getConditionBranchNodes() {
    return this.service.getConditionBranchNodes()
  }

  @Get('nodes/:id')
  async getConditionBranchNode(@Param('id') id: string) {
    return this.service.getConditionBranchNode(id)
  }

  // ========== 条件评估 ==========

  @Post('evaluate')
  async evaluateCondition(@Body() body: { ruleId: string; input: Record<string, any> }) {
    return this.service.evaluateCondition(body.ruleId, body.input)
  }

  @Post('evaluate-multiple')
  async evaluateMultipleConditions(
    @Body() body: { ruleIds: string[]; input: Record<string, any> },
  ) {
    return this.service.evaluateMultipleConditions(body.ruleIds, body.input)
  }

  @Get('evaluation-history')
  async getEvaluationHistory(@Query('ruleId') ruleId?: string) {
    return this.service.getEvaluationHistory(ruleId)
  }

  // ========== 分支路由 ==========

  @Post('route')
  async routeBranch(@Body() body: { nodeId: string; input: Record<string, any> }) {
    return this.service.routeBranch(body.nodeId, body.input)
  }

  // ========== 统计 ==========

  @Get('stats')
  async getConditionStats() {
    return this.service.getConditionStats()
  }
}
