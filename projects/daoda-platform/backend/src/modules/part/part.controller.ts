/**
 * 配件管理控制器
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { PartService } from './part.service'
import { CreatePartDto, UpdatePartDto, PartQueryDto, PartInventoryDto } from './part.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('配件管理')
@Controller('service/parts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'PURCHASE')
  @ApiOperation({ summary: '创建配件' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreatePartDto) {
    return this.partService.create(dto)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES', 'STOCK')
  @ApiOperation({ summary: '获取配件列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] })
  @ApiQuery({ name: 'supplier', required: false })
  @ApiQuery({ name: 'minStock', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: PartQueryDto) {
    return this.partService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES', 'STOCK')
  @ApiOperation({ summary: '获取配件详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.partService.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE')
  @ApiOperation({ summary: '更新配件' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdatePartDto) {
    return this.partService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除配件' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.partService.delete(id)
    return { message: '删除成功' }
  }

  @Put(':id/stock')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'STOCK')
  @ApiOperation({ summary: '更新库存' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateStock(@Param('id') id: string, @Body() body: { qty: number }) {
    return this.partService.updateStock(id, body.qty)
  }

  @Patch(':id/adjust-stock')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'STOCK')
  @ApiOperation({ summary: '调整库存' })
  @ApiResponse({ status: 200, description: '调整成功' })
  async adjustStock(@Param('id') id: string, @Body() body: { qty: number }) {
    return this.partService.adjustStock(id, body.qty)
  }

  @Post(':id/inventory-log')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'STOCK')
  @ApiOperation({ summary: '库存操作记录' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async inventoryLog(@Param('id') id: string, @Body() dto: PartInventoryDto) {
    return this.partService.inventoryLog(id, dto)
  }

  @Get('stats/categories')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES')
  @ApiOperation({ summary: '分类统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getCategoryStats() {
    return this.partService.getCategoryStats()
  }

  @Get('stats/status')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES', 'STOCK')
  @ApiOperation({ summary: '状态统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getStatusStats() {
    return this.partService.getStatusStats()
  }

  @Get('stats/suppliers')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES')
  @ApiOperation({ summary: '供应商统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getSupplierStats() {
    return this.partService.getSupplierStats()
  }

  @Get('stats/summary')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES', 'STOCK')
  @ApiOperation({ summary: '配件统计汇总' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getSummary() {
    return this.partService.getSummary()
  }

  @Get('categories')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES', 'STOCK')
  @ApiOperation({ summary: '获取分类列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getCategories() {
    return this.partService.getCategories()
  }

  @Get('suppliers')
  @Roles('ADMIN', 'MANAGER', 'PURCHASE', 'SALES', 'STOCK')
  @ApiOperation({ summary: '获取供应商列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getSuppliers() {
    return this.partService.getSuppliers()
  }
}
