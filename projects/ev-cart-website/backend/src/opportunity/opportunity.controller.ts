import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunityService, CreateOpportunityDto } from './opportunity.service';

@ApiTags('商机管理')
@ApiBearerAuth()
@Controller('crm/opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Get()
  @ApiOperation({ summary: '获取商机列表' })
  @ApiResponse({ status: 200, description: '商机列表获取成功' })
  findAll(@Query() params: any) {
    return this.opportunityService.findAll(params);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取商机统计' })
  @ApiResponse({ status: 200, description: '统计获取成功' })
  getStatistics(@Query() params: any) {
    return this.opportunityService.getStatistics(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商机详情' })
  @ApiResponse({ status: 200, description: '商机详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.opportunityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建商机' })
  @ApiResponse({ status: 201, description: '商机创建成功' })
  create(@Body() data: CreateOpportunityDto) {
    return this.opportunityService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商机' })
  @ApiResponse({ status: 200, description: '商机更新成功' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.opportunityService.update(id, data);
  }

  @Put(':id/stage')
  @ApiOperation({ summary: '更新商机阶段' })
  @ApiResponse({ status: 200, description: '阶段更新成功' })
  updateStage(@Param('id') id: string, @Body() data: { stage: string }) {
    return this.opportunityService.updateStage(id, data.stage);
  }

  @Post(':id/win')
  @ApiOperation({ summary: '商机赢单' })
  @ApiResponse({ status: 200, description: '赢单成功' })
  win(@Param('id') id: string) {
    return this.opportunityService.win(id);
  }

  @Post(':id/lose')
  @ApiOperation({ summary: '商机输单' })
  @ApiResponse({ status: 200, description: '输单成功' })
  lose(@Param('id') id: string, @Body() data: { reason?: string }) {
    return this.opportunityService.lose(id, data.reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商机' })
  @ApiResponse({ status: 200, description: '商机删除成功' })
  remove(@Param('id') id: string) {
    return this.opportunityService.remove(id);
  }
}
