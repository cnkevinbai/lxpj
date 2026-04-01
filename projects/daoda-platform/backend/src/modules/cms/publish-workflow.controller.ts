/**
 * 发布工作流控制器
 * 发布审批、定时发布、发布队列管理 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { PublishWorkflowService, PublishStatus } from './publish-workflow.service'

@Controller('api/cms/publish-workflow')
export class PublishWorkflowController {
  constructor(private readonly service: PublishWorkflowService) {}

  // ========== 发布任务 ==========

  @Get('tasks')
  async getPublishTasks(
    @Query('siteId') siteId?: string,
    @Query('status') status?: PublishStatus,
    @Query('contentType') contentType?: string,
  ) {
    return this.service.getPublishTasks({ siteId, status, contentType })
  }

  @Get('tasks/:id')
  async getPublishTask(@Param('id') id: string) {
    return this.service.getPublishTask(id)
  }

  @Post('tasks')
  async createPublishTask(
    @Body()
    task: Partial<{
      contentId: string
      contentType: string
      siteId: string
      publishType: string
      scheduledAt: Date
      publisher: string
      publisherName: string
    }>,
  ) {
    return this.service.createPublishTask(task as any)
  }

  // ========== 任务操作 ==========

  @Post('tasks/:id/submit')
  async submitForReview(@Param('id') id: string) {
    return this.service.submitForReview(id)
  }

  @Post('tasks/:id/approve')
  async approveTask(
    @Param('id') id: string,
    @Body() body?: { reviewer?: string; reviewerName?: string; comments?: string },
  ) {
    return this.service.approveTask(id, body?.reviewer, body?.reviewerName, body?.comments)
  }

  @Post('tasks/:id/reject')
  async rejectTask(
    @Param('id') id: string,
    @Body() body?: { reviewer?: string; reviewerName?: string; comments?: string },
  ) {
    return this.service.rejectTask(id, body?.reviewer, body?.reviewerName, body?.comments)
  }

  @Post('tasks/:id/execute')
  async executePublish(@Param('id') id: string) {
    return this.service.executePublish(id)
  }

  @Post('tasks/:id/cancel')
  async cancelPublish(@Param('id') id: string) {
    return this.service.cancelPublish(id)
  }

  @Post('tasks/:id/unpublish')
  async unpublishContent(@Param('id') id: string) {
    return this.service.unpublishContent(id)
  }

  @Post('tasks/:id/retry')
  async retryFailedTask(@Param('id') id: string) {
    return this.service.retryFailedTask(id)
  }

  // ========== 发布队列 ==========

  @Get('queues')
  async getPublishQueues() {
    return this.service.getPublishQueues()
  }

  // ========== 审核规则 ==========

  @Get('review-rules')
  async getReviewRules() {
    return this.service.getReviewRules()
  }

  @Get('review-rules/:id')
  async getReviewRule(@Param('id') id: string) {
    return this.service.getReviewRule(id)
  }

  @Get('review-rules/content-type')
  async getReviewRuleForContent(
    @Query('contentType') contentType?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.service.getReviewRuleForContent(contentType, siteId)
  }

  // ========== 发布历史 ==========

  @Get('history')
  async getPublishHistory(@Query('taskId') taskId?: string) {
    return this.service.getPublishHistory(taskId)
  }
}
