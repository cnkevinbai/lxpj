/**
 * BOM 模块控制器
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { BomService } from './bom.service'
import {
  CreateBomDto,
  UpdateBomDto,
  CreateBomItemDto,
  UpdateBomItemDto,
  BomQueryDto,
} from './bom.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('BOM 管理')
@Controller('bom')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '创建 BOM' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateBomDto) {
    return this.bomService.create(dto)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN', 'SALES')
  @ApiOperation({ summary: '获取 BOM 列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'bomNo', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: BomQueryDto) {
    return this.bomService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN', 'SALES')
  @ApiOperation({ summary: '获取 BOM 详情（含物料清单）' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.bomService.findOne(id, true)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '更新 BOM' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateBomDto) {
    return this.bomService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '删除 BOM' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.bomService.delete(id)
    return { message: '删除成功' }
  }

  @Post(':id/items')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '添加 BOM 物料' })
  @ApiResponse({ status: 201, description: '添加成功' })
  async addItem(@Param('id') bomId: string, @Body() dto: CreateBomItemDto) {
    return this.bomService.addItem(bomId, dto)
  }

  @Put(':bomId/items/:itemId')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '更新 BOM 物料' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateItem(
    @Param('bomId') bomId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateBomItemDto,
  ) {
    return this.bomService.updateItem(itemId, dto)
  }

  @Delete(':bomId/items/:itemId')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: '删除 BOM 物料' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeItem(@Param('bomId') bomId: string, @Param('itemId') itemId: string) {
    await this.bomService.removeItem(itemId)
    return { message: '删除成功' }
  }

  @Get('stats/status')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: 'BOM 状态统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getCountByStatus() {
    return this.bomService.getCountByStatus()
  }

  @Get('product/:productId')
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN', 'SALES')
  @ApiOperation({ summary: '根据产品 ID 获取 BOM 列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getBomByProduct(@Param('productId') productId: string) {
    return this.bomService.getBomByProduct(productId)
  }
}
