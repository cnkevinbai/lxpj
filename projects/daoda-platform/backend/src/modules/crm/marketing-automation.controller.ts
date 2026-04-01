/**
 * 营销自动化控制器
 * API 接口：营销活动、邮件营销、客户分群、营销模板、营销分析
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import {
  MarketingAutomationService,
  CampaignType,
  CampaignStatus,
  AudienceType,
  EmailStatus,
} from './marketing-automation.service'
import { CreateCampaignDto, CreateSegmentDto, CreateTemplateDto } from './dto/marketing.dto'

@ApiTags('营销自动化')
@ApiBearerAuth()
@Controller('api/crm/marketing')
export class MarketingAutomationController {
  constructor(private readonly service: MarketingAutomationService) {}

  // ========== 营销活动管理 ==========

  @Get('campaigns')
  @ApiOperation({ summary: '获取活动列表', description: '分页查询营销活动列表' })
  getCampaigns(@Query() params?: any) {
    return this.service.getCampaigns(params)
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: '获取活动详情', description: '根据ID获取营销活动详细信息' })
  getCampaign(@Param('id') id: string) {
    return this.service.getCampaign(id)
  }

  @Post('campaigns')
  @ApiOperation({ summary: '创建活动', description: '创建新的营销活动' })
  createCampaign(@Body() campaign: CreateCampaignDto) {
    return this.service.createCampaign(campaign as any)
  }

  @Post('campaigns/:id/update')
  @ApiOperation({ summary: '更新活动', description: '更新营销活动信息' })
  updateCampaign(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateCampaign(id, updates)
  }

  @Post('campaigns/:id/launch')
  @ApiOperation({ summary: '发布活动', description: '发布营销活动，开始执行' })
  launchCampaign(@Param('id') id: string) {
    return this.service.launchCampaign(id)
  }

  @Post('campaigns/:id/pause')
  @ApiOperation({ summary: '暂停活动', description: '暂停正在执行的营销活动' })
  pauseCampaign(@Param('id') id: string) {
    return this.service.pauseCampaign(id)
  }

  @Post('campaigns/:id/complete')
  @ApiOperation({ summary: '完成活动', description: '标记营销活动为已完成' })
  completeCampaign(@Param('id') id: string) {
    return this.service.completeCampaign(id)
  }

  @Get('campaigns/:id/analytics')
  @ApiOperation({ summary: '活动分析', description: '获取营销活动效果分析报告' })
  getCampaignAnalytics(@Param('id') id: string) {
    return this.service.getCampaignAnalytics(id)
  }

  // ========== 模板管理 ==========

  @Get('templates')
  @ApiOperation({ summary: '获取模板列表', description: '查询营销模板列表' })
  getTemplates(@Query() params?: any) {
    return this.service.getTemplates(params)
  }

  @Get('templates/:id')
  @ApiOperation({ summary: '获取模板详情', description: '根据ID获取营销模板详细信息' })
  getTemplate(@Param('id') id: string) {
    return this.service.getTemplate(id)
  }

  @Post('templates')
  @ApiOperation({ summary: '创建模板', description: '创建新的营销模板' })
  createTemplate(@Body() template: CreateTemplateDto) {
    return this.service.createTemplate(template as any)
  }

  // ========== 客户分群管理 ==========

  @Get('segments')
  @ApiOperation({ summary: '获取分群列表', description: '查询客户分群列表' })
  getSegments() {
    return this.service.getSegments()
  }

  @Get('segments/:id')
  @ApiOperation({ summary: '获取分群详情', description: '根据ID获取客户分群详细信息' })
  getSegment(@Param('id') id: string) {
    return this.service.getSegment(id)
  }

  @Post('segments')
  @ApiOperation({ summary: '创建分群', description: '创建新的客户分群' })
  createSegment(@Body() segment: CreateSegmentDto) {
    return this.service.createSegment(segment as any)
  }

  @Post('segments/:id/refresh')
  @ApiOperation({ summary: '刷新分群', description: '刷新客户分群数据' })
  refreshSegment(@Param('id') id: string) {
    return this.service.refreshSegment(id)
  }

  // ========== 邮件记录 ==========

  @Get('campaigns/:campaignId/emails')
  @ApiOperation({ summary: '获取邮件记录', description: '查询营销活动的邮件发送记录' })
  getEmailRecords(@Param('campaignId') campaignId: string, @Query() params?: any) {
    return this.service.getEmailRecords(campaignId, params)
  }

  // ========== 统计 ==========

  @Get('stats')
  @ApiOperation({ summary: '营销统计', description: '获取营销自动化统计数据' })
  getStats() {
    return this.service.getStats()
  }
}
