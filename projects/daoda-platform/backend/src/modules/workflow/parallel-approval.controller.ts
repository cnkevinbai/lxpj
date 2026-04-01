/**
 * 并行审批控制器
 * 并行审批节点管理、投票机制、结果聚合 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import {
  ParallelApprovalService,
  ParallelType,
  ParallelNodeStatus,
  VoteResult,
} from './parallel-approval.service'

@Controller('api/workflow/parallel-approval')
export class ParallelApprovalController {
  constructor(private readonly service: ParallelApprovalService) {}

  // ========== 并行节点配置查询 ==========

  @Get('configs')
  async getParallelConfigs() {
    return this.service.getParallelConfigs()
  }

  @Get('configs/:id')
  async getParallelConfig(@Param('id') id: string) {
    return this.service.getParallelConfig(id)
  }

  // ========== 并行节点实例查询 ==========

  @Get('nodes')
  async getParallelNodes(
    @Query('status') status?: ParallelNodeStatus,
    @Query('parallelType') parallelType?: ParallelType,
  ) {
    return this.service.getParallelNodes({ status, parallelType })
  }

  @Get('nodes/:id')
  async getParallelNode(@Param('id') id: string) {
    return this.service.getParallelNode(id)
  }

  // ========== 参与者查询 ==========

  @Get('nodes/:nodeId/participants')
  async getParticipants(@Param('nodeId') nodeId: string) {
    return this.service.getParticipants(nodeId)
  }

  // ========== 投票 ==========

  @Get('nodes/:nodeId/results')
  async getParallelResults(@Param('nodeId') nodeId: string) {
    return this.service.getParallelResults(nodeId)
  }

  @Post('nodes/:nodeId/vote')
  async vote(
    @Param('nodeId') nodeId: string,
    @Body() body: { participantId: string; result: VoteResult; comments?: string },
  ) {
    return this.service.vote(nodeId, body.participantId, body.result, body.comments)
  }

  // ========== 聚合结果 ==========

  @Get('nodes/:nodeId/aggregation')
  async getAggregation(@Param('nodeId') nodeId: string) {
    return this.service.getAggregation(nodeId)
  }

  // ========== 超时检测 ==========

  @Get('check-timeout')
  async checkTimeout() {
    return this.service.checkTimeout()
  }

  // ========== 统计 ==========

  @Get('stats')
  async getParallelStats() {
    return this.service.getParallelStats()
  }
}
