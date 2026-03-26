/**
 * 线索模块 Controller
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { LeadService } from './lead.service'
import { CreateLeadDto, UpdateLeadDto, LeadQueryDto } from './lead.dto'

@ApiTags('线索管理')
@Controller('leads')
@UseGuards(/* AuthGuards */)
@ApiBearerAuth()
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: '创建线索' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateLeadDto) {
    return this.leadService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '获取线索列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: LeadQueryDto) {
    return this.leadService.findAll(query)
  }

  @Get('stats')
  @ApiOperation({ summary: '获取线索统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getStats() {
    return this.leadService.getStats()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取线索详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.leadService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新线索' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除线索' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.leadService.delete(id)
    return { message: '删除成功' }
  }

  @Post(':id/convert')
  @ApiOperation({ summary: '转化为客户' })
  @ApiResponse({ status: 200, description: '转换成功' })
  async convertToCustomer(@Param('id') id: string) {
    return this.leadService.convertToCustomer(id)
  }

  @Post('batch/assign')
  @ApiOperation({ summary: '批量分配' })
  @ApiResponse({ status: 200, description: '分配成功' })
  async assignBatch(@Body() body: { ids: string[]; assignedTo: string }) {
    await this.leadService.assignBatch(body.ids, body.assignedTo)
    return { message: '分配成功' }
  }
}