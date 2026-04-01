/**
 * 流程版本管理控制器
 * 流程定义版本控制、发布管理、版本回退 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ProcessVersionService, VersionStatus } from './process-version.service'

@Controller('api/workflow/process-version')
export class ProcessVersionController {
  constructor(private readonly service: ProcessVersionService) {}

  // ========== 流程定义查询 ==========

  @Get('definitions')
  async getProcessDefinitions(
    @Query('category') category?: string,
    @Query('status') status?: VersionStatus,
  ) {
    return this.service.getProcessDefinitions({ category, status })
  }

  @Get('definitions/:id')
  async getProcessDefinition(@Param('id') id: string) {
    return this.service.getProcessDefinition(id)
  }

  // ========== 流程版本查询 ==========

  @Get('versions')
  async getProcessVersions(@Query('definitionId') definitionId?: string) {
    return this.service.getProcessVersions(definitionId)
  }

  @Get('versions/:id')
  async getProcessVersion(@Param('id') id: string) {
    return this.service.getProcessVersion(id)
  }

  @Get('versions/:versionId/changes')
  async getVersionChanges(@Param('versionId') versionId: string) {
    return this.service.getVersionChanges(versionId)
  }

  // ========== 版本发布 ==========

  @Get('definitions/:definitionId/published')
  async getPublishedVersion(@Param('definitionId') definitionId: string) {
    return this.service.getPublishedVersion(definitionId)
  }

  @Post('publish')
  async publishVersion(@Body() request: any) {
    return this.service.publishVersion(request)
  }

  // ========== 版本回退 ==========

  @Post('rollback')
  async rollbackVersion(@Body() body: { definitionId: string; targetVersionId: string }) {
    return this.service.rollbackVersion(body.definitionId, body.targetVersionId)
  }

  // ========== 版本对比 ==========

  @Get('compare')
  async compareVersions(
    @Query('versionId1') versionId1: string,
    @Query('versionId2') versionId2: string,
  ) {
    return this.service.compareVersions(versionId1, versionId2)
  }

  // ========== 统计与分类 ==========

  @Get('stats')
  async getVersionStats() {
    return this.service.getVersionStats()
  }

  @Get('categories')
  async getCategories() {
    return this.service.getCategories()
  }
}
