/**
 * 生产计划模块控制器
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ProductionPlanService } from './production-plan.service'
import {
  CreateProductionPlanDto,
  UpdateProductionPlanDto,
  CreateProductionPlanItemDto,
  UpdateProductionPlanItemDto,
  ProductionPlanQueryDto,
} from './production-plan.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('生产计划')
@Controller('production-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductionPlanController {
  constructor(private readonly productionPlanService: ProductionPlanService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '创建生产计划' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateProductionPlanDto) {
    return this.productionPlanService.create(dto)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION', 'SALES', 'TECHNICIAN')
  @ApiOperation({ summary: '获取生产计划列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'planNo', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'startDateStart', required: false })
  @ApiQuery({ name: 'startDateEnd', required: false })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: ProductionPlanQueryDto) {
    return this.productionPlanService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION', 'SALES', 'TECHNICIAN')
  @ApiOperation({ summary: '获取生产计划详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.productionPlanService.findOne(id, true)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '更新生产计划' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductionPlanDto) {
    return this.productionPlanService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '删除生产计划' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.productionPlanService.delete(id)
    return { message: '删除成功' }
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '审批生产计划' })
  @ApiResponse({ status: 200, description: '审批成功' })
  async approve(@Param('id') id: string) {
    return this.productionPlanService.approve(id)
  }

  @Post(':id/cancel')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '取消生产计划' })
  @ApiResponse({ status: 200, description: '取消成功' })
  async cancel(@Param('id') id: string) {
    return this.productionPlanService.cancel(id)
  }

  @Post(':id/generate-orders')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '生成生产工单' })
  @ApiResponse({ status: 200, description: '生成成功' })
  async generateOrders(@Param('id') id: string) {
    return this.productionPlanService.generateOrders(id)
  }

  @Post(':id/items')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '添加生产计划项' })
  @ApiResponse({ status: 201, description: '添加成功' })
  async addItem(@Param('id') planId: string, @Body() dto: CreateProductionPlanItemDto) {
    return this.productionPlanService.addItem(planId, dto)
  }

  @Put(':planId/items/:itemId')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '更新生产计划项' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateItem(
    @Param('planId') planId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateProductionPlanItemDto,
  ) {
    return this.productionPlanService.updateItem(itemId, dto)
  }

  @Delete(':planId/items/:itemId')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '删除生产计划项' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeItem(@Param('planId') planId: string, @Param('itemId') itemId: string) {
    await this.productionPlanService.removeItem(itemId)
    return { message: '删除成功' }
  }

  @Get('stats/status')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION')
  @ApiOperation({ summary: '生产计划状态统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getCountByStatus() {
    return this.productionPlanService.getCountByStatus()
  }

  @Get('product/:productId')
  @Roles('ADMIN', 'MANAGER', 'PRODUCTION', 'SALES', 'TECHNICIAN')
  @ApiOperation({ summary: '根据产品 ID 获取生产计划列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getPlanByProduct(@Param('productId') productId: string) {
    return this.productionPlanService.getPlanByProduct(productId)
  }
}
