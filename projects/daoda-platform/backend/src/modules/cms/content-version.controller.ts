/**
 * 内容版本管理控制器
 * 版本控制、历史记录、版本对比、回退 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ContentVersionService, ContentVersionStatus, ContentType } from './content-version.service'

@Controller('api/cms/content-version')
export class ContentVersionController {
  constructor(private readonly service: ContentVersionService) {}

  // ========== 内容实体 ==========

  @Get('entities')
  async getContentEntities(
    @Query('type') type?: ContentType,
    @Query('status') status?: ContentVersionStatus,
    @Query('siteId') siteId?: string,
  ) {
    return this.service.getContentEntities({ contentType: type, status, siteId })
  }

  @Get('entities/:id')
  async getContentEntity(@Param('id') id: string) {
    return this.service.getContentEntity(id)
  }

  // ========== 版本管理 ==========

  @Get('versions')
  async getContentVersions(@Query('contentId') contentId?: string) {
    return this.service.getContentVersions(contentId)
  }

  @Get('versions/:id')
  async getContentVersion(@Param('id') id: string) {
    return this.service.getContentVersion(id)
  }

  @Get('content/:contentId/current')
  async getCurrentVersion(@Param('contentId') contentId: string) {
    return this.service.getCurrentVersion(contentId)
  }

  @Get('content/:contentId/published')
  async getPublishedVersion(@Param('contentId') contentId: string) {
    return this.service.getPublishedVersion(contentId)
  }

  // ========== 版本操作 ==========

  @Post('versions/:id/publish')
  async publishVersion(
    @Param('id') id: string,
    @Body() body?: { publisher?: string; publisherName?: string; scheduledAt?: string },
  ) {
    return this.service.publishVersion(
      id,
      body?.publisher,
      body?.publisherName,
      body?.scheduledAt ? new Date(body.scheduledAt) : undefined,
    )
  }

  @Post('content/:contentId/rollback')
  async rollbackVersion(
    @Param('contentId') contentId: string,
    @Body() body: { targetVersionId: string },
  ) {
    return this.service.rollbackVersion(contentId, body.targetVersionId)
  }

  @Post('versions/:id/submit')
  async submitForReview(@Param('id') id: string) {
    return this.service.submitForReview(id)
  }

  @Post('versions/:id/approve')
  async approveVersion(
    @Param('id') id: string,
    @Body() body?: { reviewer?: string; reviewerName?: string },
  ) {
    return this.service.approveVersion(id, body?.reviewer, body?.reviewerName)
  }

  @Post('versions/:id/archive')
  async archiveVersion(@Param('id') id: string) {
    return this.service.archiveVersion(id)
  }

  // ========== 版本对比 ==========

  @Get('compare')
  async compareVersions(
    @Query('versionId1') versionId1: string,
    @Query('versionId2') versionId2: string,
  ) {
    return this.service.compareVersions(versionId1, versionId2)
  }

  @Get('versions/:versionId/changes')
  async getVersionChanges(@Param('versionId') versionId: string) {
    return this.service.getVersionChanges(versionId)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getContentStats() {
    return this.service.getContentStats()
  }
}
