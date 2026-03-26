/**
 * 审批流控制器
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApprovalFlowService } from './services/approval-flow.service'

@Controller('approval-flows')
@UseGuards(JwtAuthGuard)
export class ApprovalFlowController {
  constructor(private readonly approvalFlowService: ApprovalFlowService) {}

  @Post()
  async createFlow(@Body() data: any) {
    return this.approvalFlowService.createFlow(data)
  }

  @Get()
  async getFlows(
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.approvalFlowService.getFlows(type, status)
  }

  @Get(':id')
  async getFlow(@Param('id') id: string) {
    return this.approvalFlowService.getFlow(id)
  }

  @Post(':id/submit')
  async submitApproval(
    @Param('id') id: string,
    @Body() data: any,
    @Query('platform') platform: 'internal' | 'dingtalk' | 'wechat' = 'internal',
  ) {
    return this.approvalFlowService.submitApproval(
      id,
      data.applicantId,
      data.applicantName,
      data.entityType,
      data.entityId,
      data.formData,
      platform,
    )
  }

  @Post(':recordId/approve')
  async approve(
    @Param('recordId') recordId: string,
    @Body() data: any,
  ) {
    return this.approvalFlowService.approve(
      recordId,
      data.approverId,
      data.approverName,
      data.approved,
      data.comments,
    )
  }

  @Post(':recordId/cancel')
  async cancel(@Param('recordId') recordId: string, @Body() data: any) {
    return this.approvalFlowService.cancel(recordId, data.applicantId)
  }

  @Get('records/pending')
  async getPendingApprovals(@Query('userId') userId: string) {
    return this.approvalFlowService.getPendingApprovals(userId)
  }

  @Get('records/my')
  async getMyApprovals(@Query('userId') userId: string) {
    return this.approvalFlowService.getMyApprovals(userId)
  }

  @Get('records/:id')
  async getRecord(@Param('id') id: string) {
    return this.approvalFlowService.getRecord(id)
  }

  @Get('records')
  async getRecords(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('applicantId') applicantId?: string,
    @Query('currentApproverId') currentApproverId?: string,
    @Query('status') status?: string,
    @Query('flowId') flowId?: string,
  ) {
    return this.approvalFlowService.getRecords(page, limit, {
      applicantId,
      currentApproverId,
      status,
      flowId,
    })
  }
}
