/**
 * 产品控制器
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ProductService } from './product.service'
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('产品管理')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '创建产品' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取产品列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'series', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取产品详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '更新产品' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除产品' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.productService.delete(id)
    return { message: '删除成功' }
  }

  @Put(':id/price')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '更新价格' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updatePrice(@Param('id') id: string, @Body() body: { price: number }) {
    return this.productService.updatePrice(id, body.price)
  }

  @Post('batch/price')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '批量更新价格' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async batchUpdatePrice(@Body() body: { ids: string[]; price: number }) {
    const count = await this.productService.batchUpdatePrice(body.ids, body.price)
    return { message: `成功更新 ${count} 条记录` }
  }

  @Post('batch/adjust-price')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '批量调整价格' })
  @ApiResponse({ status: 200, description: '调整成功' })
  async batchAdjustPrice(@Body() body: { ids: string[]; percentage: number }) {
    const count = await this.productService.batchAdjustPrice(body.ids, body.percentage)
    return { message: `成功调整 ${count} 条记录` }
  }

  @Get('stats/categories')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '分类统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getCategoryStats() {
    return this.productService.getCategoryStats()
  }

  @Get('stats/series')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '系列统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getSeriesStats() {
    return this.productService.getSeriesStats()
  }

  @Get('categories')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取分类列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getCategories() {
    return this.productService.getCategories()
  }

  @Get('series')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取系列列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getSeries() {
    return this.productService.getSeries()
  }
}
