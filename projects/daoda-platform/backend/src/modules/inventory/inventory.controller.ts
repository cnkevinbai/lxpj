/**
 * 库存模块 Controller
 * 提供库存管理的 RESTful API 接口
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { InventoryService } from './inventory.service'
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  InventoryChangeDto,
  InventoryLogQueryDto,
} from './inventory.dto'

@ApiTags('库存管理')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * 创建库存记录
   */
  @Post()
  @ApiOperation({ summary: '创建库存记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '产品不存在' })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto)
  }

  /**
   * 获取库存列表
   */
  @Get()
  @ApiOperation({ summary: '获取库存列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: InventoryQueryDto) {
    return this.inventoryService.findAll(query)
  }

  /**
   * 获取库存日志列表
   */
  @Get('logs')
  @ApiOperation({ summary: '获取库存日志列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findLogs(@Query() query: InventoryLogQueryDto) {
    return this.inventoryService.findLogs(query)
  }

  /**
   * 检查库存预警
   */
  @Get('warning')
  @ApiOperation({ summary: '检查库存预警' })
  @ApiResponse({ status: 200, description: '查询成功' })
  checkWarning() {
    return this.inventoryService.checkWarning()
  }

  /**
   * 根据产品 ID 获取库存
   */
  @Get('product/:productId')
  @ApiOperation({ summary: '根据产品 ID 获取库存' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findByProductId(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId)
  }

  /**
   * 根据 ID 获取库存详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取库存详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '库存记录不存在' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id)
  }

  /**
   * 更新库存记录
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新库存记录' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '库存记录不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto)
  }

  /**
   * 库存变动（入库/出库/调整）
   */
  @Post(':id/change')
  @ApiOperation({ summary: '库存变动（入库/出库/调整）' })
  @ApiResponse({ status: 200, description: '变动成功' })
  @ApiResponse({ status: 400, description: '库存不足' })
  @ApiResponse({ status: 404, description: '库存记录不存在' })
  changeStock(
    @Param('id') id: string,
    @Body() dto: InventoryChangeDto,
  ) {
    return this.inventoryService.changeStock(id, dto)
  }

  /**
   * 删除库存记录
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除库存记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '库存记录不存在' })
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id)
  }
}