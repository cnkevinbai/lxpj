/**
 * 线索评分控制器
 * API 接口：线索评分、批量评分、评分分布、高分线索、低分线索
 */
import { Controller, Get, Post, Query, Param } from '@nestjs/common'
import { LeadScoringService } from './lead-scoring.service'

@Controller('api/lead/lead-scoring')
export class LeadScoringController {
  constructor(private readonly service: LeadScoringService) {}

  // ========== 线索评分 ==========

  @Post('score/:leadId')
  calculateScore(@Param('leadId') leadId: string) {
    return this.service.calculateScore(leadId)
  }

  // ========== 批量评分 ==========

  @Post('batch-score')
  batchScore() {
    return this.service.batchScore()
  }

  // ========== 评分分布 ==========

  @Get('distribution')
  getScoreDistribution() {
    return this.service.getScoreDistribution()
  }

  // ========== 高分线索 ==========

  @Get('high-score')
  getHighScoreLeads(@Query('limit') limit?: number) {
    return this.service.getHighScoreLeads(limit || 10)
  }

  // ========== 低分线索 ==========

  @Get('low-score')
  getLowScoreLeads(@Query('limit') limit?: number) {
    return this.service.getLowScoreLeads(limit || 10)
  }
}
