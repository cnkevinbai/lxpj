/**
 * 商机模块 Controller
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { OpportunityService } from './opportunity.service'
import { CreateOpportunityDto, UpdateOpportunityDto, OpportunityQueryDto } from './opportunity.dto'
import { OpportunityStage } from '@prisma/client'

@ApiTags('商机管理')
@Controller('opportunities')
@ApiBearerAuth()
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @ApiOperation({ summary: '创建商机' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateOpportunityDto) {
    return this.opportunityService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '获取商机列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: OpportunityQueryDto) {
    return this.opportunityService.findAll(query)
  }

  @Get('stats')
  @ApiOperation({ summary: '获取商机统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getStats() {
    return this.opportunityService.getStats()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商机详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.opportunityService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商机' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) {
    return this.opportunityService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商机' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.opportunityService.delete(id)
    return { message: '删除成功' }
  }

  @Put(':id/stage')
  @ApiOperation({ summary: '更新商机阶段' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateStage(@Param('id') id: string, @Body() body: { stage: OpportunityStage }) {
    return this.opportunityService.update(id, { stage: body.stage })
  }

  @Post(':id/win')
  @ApiOperation({ summary: '赢单' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async win(@Param('id') id: string) {
    return this.opportunityService.win(id)
  }

  @Post(':id/lose')
  @ApiOperation({ summary: '输单' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async lose(@Param('id') id: string) {
    return this.opportunityService.lose(id)
  }

  @Post(':id/assign')
  @ApiOperation({ summary: '分配商机' })
  @ApiResponse({ status: 200, description: '分配成功' })
  async assign(@Param('id') id: string, @Body() body: { assignedTo: string }) {
    return this.opportunityService.assign(id, body.assignedTo)
  }
}
