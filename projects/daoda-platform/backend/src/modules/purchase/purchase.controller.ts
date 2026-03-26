/**
 * 采购模块 Controller
 * 提供采购管理的 RESTful API 接口
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
import { PurchaseService } from './purchase.service'
import { CreatePurchaseDto, UpdatePurchaseDto, PurchaseQueryDto } from './purchase.dto'

@ApiTags('采购管理')
@Controller('purchase-orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  /**
   * 创建采购单
   */
  @Post()
  @ApiOperation({ summary: '创建采购单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreatePurchaseDto, @Request() req: any) {
    const userId = req.user?.sub
    return this.purchaseService.create(dto, userId)
  }

  /**
   * 获取采购单列表
   */
  @Get()
  @ApiOperation({ summary: '获取采购单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: PurchaseQueryDto) {
    return this.purchaseService.findAll(query)
  }

  /**
   * 根据 ID 获取采购单详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取采购单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '采购单不存在' })
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id)
  }

  /**
   * 更新采购单
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新采购单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '采购单不存在' })
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto) {
    return this.purchaseService.update(id, dto)
  }

  /**
   * 确认采购单
   */
  @Post(':id/approve')
  @ApiOperation({ summary: '确认采购单' })
  @ApiResponse({ status: 200, description: '确认成功' })
  @ApiResponse({ status: 404, description: '采购单不存在' })
  approve(@Param('id') id: string) {
    return this.purchaseService.approve(id)
  }

  /**
   * 完成采购单（收货并更新库存）
   */
  @Post(':id/complete')
  @ApiOperation({ summary: '完成采购单（收货并更新库存）' })
  @ApiResponse({ status: 200, description: '完成成功' })
  @ApiResponse({ status: 404, description: '采购单不存在' })
  complete(@Param('id') id: string) {
    return this.purchaseService.complete(id)
  }

  /**
   * 取消采购单
   */
  @Post(':id/cancel')
  @ApiOperation({ summary: '取消采购单' })
  @ApiResponse({ status: 200, description: '取消成功' })
  @ApiResponse({ status: 404, description: '采购单不存在' })
  cancel(@Param('id') id: string) {
    return this.purchaseService.cancel(id)
  }

  /**
   * 删除采购单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除采购单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '采购单不存在' })
  delete(@Param('id') id: string) {
    return this.purchaseService.delete(id)
  }
}
