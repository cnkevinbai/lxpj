/**
 * 多站点管理控制器
 * 站点配置、站点切换、站点资源隔离 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { MultiSiteService, SiteStatus, SiteType } from './multi-site.service'

@Controller('api/cms/multi-site')
export class MultiSiteController {
  constructor(private readonly service: MultiSiteService) {}

  // ========== 站点配置 ==========

  @Get('configs')
  async getSiteConfigs(
    @Query('type') type?: SiteType,
    @Query('status') status?: SiteStatus,
    @Query('parentId') parentId?: string,
  ) {
    return this.service.getSiteConfigs({ type, status })
  }

  @Get('configs/:id')
  async getSiteConfig(@Param('id') id: string) {
    return this.service.getSiteConfig(id)
  }

  // ========== 站点资源 ==========

  @Get('sites/:siteId/resources')
  async getSiteResources(@Param('siteId') siteId: string) {
    return this.service.getSiteResources(siteId)
  }

  @Get('sites/:siteId/visit-stats')
  async getSiteVisitStats(@Param('siteId') siteId: string, @Query('days') days?: number) {
    return this.service.getSiteVisitStats(siteId, days)
  }

  // ========== 站点层级 ==========

  @Get('main-site')
  async getMainSite() {
    return this.service.getMainSite()
  }

  @Get('sites/:parentId/sub-sites')
  async getSubSites(@Param('parentId') parentId: string) {
    return this.service.getSubSites(parentId)
  }

  // ========== 站点切换 ==========

  @Post('switch')
  async switchSite(
    @Body()
    body: {
      fromSiteId: string
      toSiteId: string
      userId?: string
      userName?: string
      reason?: string
    },
  ) {
    return this.service.switchSite(
      body.fromSiteId,
      body.toSiteId,
      body.userId,
      body.userName,
      body.reason,
    )
  }

  @Get('switch-logs')
  async getSwitchLogs(@Query('userId') userId?: string) {
    return this.service.getSwitchLogs(userId)
  }

  // ========== 站点状态 ==========

  @Post('sites/:id/status')
  async updateSiteStatus(@Param('id') id: string, @Body() body: { status: SiteStatus }) {
    return this.service.updateSiteStatus(id, body.status)
  }

  // ========== 语言支持 ==========

  @Get('supported-languages')
  async getSupportedLanguages() {
    return this.service.getSupportedLanguages()
  }

  // ========== 统计 ==========

  @Get('stats/summary')
  async getSiteStatsSummary() {
    return this.service.getSiteStatsSummary()
  }
}
