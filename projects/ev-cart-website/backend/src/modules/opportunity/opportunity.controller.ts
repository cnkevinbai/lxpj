import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { OpportunityService } from './services/opportunity.service'
import { CreateOpportunityDto, UpdateOpportunityDto } from './dto/opportunity.dto'

@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @ApiOperation({ summary: '创建商机' })
  create(@Body() createOpportunityDto: CreateOpportunityDto) {
    return this.opportunityService.create(createOpportunityDto)
  }

  @Get()
  @ApiOperation({ summary: '获取商机列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Query('stage') stage?: string) {
    return this.opportunityService.findAll(page, limit, stage)
  }

  @Get('funnel')
  @ApiOperation({ summary: '获取销售漏斗数据' })
  getFunnel() {
    return this.opportunityService.getFunnelData()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商机详情' })
  findOne(@Param('id') id: string) {
    return this.opportunityService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商机' })
  update(@Param('id') id: string, @Body() updateOpportunityDto: UpdateOpportunityDto) {
    return this.opportunityService.update(id, updateOpportunityDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商机' })
  remove(@Param('id') id: string) {
    return this.opportunityService.remove(id)
  }
}
