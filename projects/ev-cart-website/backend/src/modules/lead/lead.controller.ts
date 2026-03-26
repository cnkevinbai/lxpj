import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { LeadService } from './services/lead.service'
import { CreateLeadDto, UpdateLeadDto, ConvertLeadDto } from './dto/lead.dto'

@ApiTags('leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: '创建线索 (官网询价)' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.create(createLeadDto)
  }

  @Get()
  @ApiOperation({ summary: '获取线索列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Query('status') status?: string) {
    return this.leadService.findAll(page, limit, status)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取线索详情' })
  findOne(@Param('id') id: string) {
    return this.leadService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新线索' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadService.update(id, updateLeadDto)
  }

  @Post(':id/assign')
  @ApiOperation({ summary: '分配线索给销售' })
  assign(@Param('id') id: string, @Body('ownerId') ownerId: string) {
    return this.leadService.assign(id, ownerId)
  }

  @Post(':id/convert')
  @ApiOperation({ summary: '线索转化为客户' })
  convert(@Param('id') id: string, @Body() convertLeadDto: ConvertLeadDto) {
    return this.leadService.convert(id, convertLeadDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除线索' })
  remove(@Param('id') id: string) {
    return this.leadService.remove(id)
  }
}
