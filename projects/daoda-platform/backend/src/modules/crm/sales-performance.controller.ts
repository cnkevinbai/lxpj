/**
 * 销售业绩控制器
 * API 接口：销售人员业绩、团队业绩、业绩趋势、业绩排名、目标设置、业绩对比
 */
import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common'
import { SalesPerformanceService } from './sales-performance.service'

@Controller('api/crm/sales-performance')
export class SalesPerformanceController {
  constructor(private readonly service: SalesPerformanceService) {}

  // ========== 销售人员业绩 ==========

  @Get('salesperson/:userId')
  getSalespersonPerformance(@Param('userId') userId: string, @Query('period') period?: string) {
    return this.service.getSalespersonPerformance(userId, period)
  }

  // ========== 团队业绩 ==========

  @Get('team')
  getTeamPerformance(@Query('period') period?: string) {
    return this.service.getTeamPerformance(period)
  }

  // ========== 业绩趋势 ==========

  @Get('salesperson/:userId/trend')
  getPerformanceTrend(
    @Param('userId') userId: string,
    @Query('metric') metric: string,
    @Query('months') months?: number,
  ) {
    return this.service.getPerformanceTrend(userId, metric as any, months || 6)
  }

  // ========== 业绩排名 ==========

  @Get('ranking')
  getRanking(@Query('period') period?: string, @Query('limit') limit?: number) {
    return this.service.getRanking(period, limit || 10)
  }

  // ========== 目标设置 ==========

  @Post('salesperson/:userId/target')
  setTarget(
    @Param('userId') userId: string,
    @Body('target') target: number,
    @Body('period') period?: string,
  ) {
    return this.service.setTarget(userId, target, period)
  }

  // ========== 统计 ==========

  @Get('stats')
  getPerformanceStats(@Query('period') period?: string) {
    return this.service.getPerformanceStats(period)
  }

  // ========== 业绩对比 ==========

  @Get('compare')
  comparePerformance(
    @Query('userId1') userId1: string,
    @Query('userId2') userId2: string,
    @Query('period') period?: string,
  ) {
    return this.service.comparePerformance(userId1, userId2, period)
  }
}
