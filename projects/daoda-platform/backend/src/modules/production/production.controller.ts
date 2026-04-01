/**
 * 生产模块 Controller
 * 提供生产管理的 RESTful API 接口
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
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard'
import { ProductionService } from './production.service'
import {
  CreateProductionDto,
  UpdateProductionDto,
  ProductionQueryDto,
  StartProductionDto,
  CompleteProductionDto,
} from './production.dto'

@ApiTags('生产管理')
@Controller('production')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  /**
   * 创建生产单
   */
  @Post()
  @ApiOperation({ summary: '创建生产单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreateProductionDto) {
    return this.productionService.create(dto)
  }

  /**
   * 获取生产单列表
   */
  @Get()
  @ApiOperation({ summary: '获取生产单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: ProductionQueryDto) {
    return this.productionService.findAll(query)
  }

  /**
   * 根据 ID 获取生产单详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取生产单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '生产单不存在' })
  findOne(@Param('id') id: string) {
    return this.productionService.findOne(id)
  }

  /**
   * 更新生产单
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新生产单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '生产单不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateProductionDto) {
    return this.productionService.update(id, dto)
  }

  /**
   * 开始生产
   */
  @Post(':id/start')
  @ApiOperation({ summary: '开始生产' })
  @ApiResponse({ status: 200, description: '开始成功' })
  @ApiResponse({ status: 404, description: '生产单不存在' })
  start(@Param('id') id: string, @Body() dto?: StartProductionDto) {
    return this.productionService.start(id, dto)
  }

  /**
   * 完成生产（更新库存）
   */
  @Post(':id/complete')
  @ApiOperation({ summary: '完成生产（更新库存）' })
  @ApiResponse({ status: 200, description: '完成成功' })
  @ApiResponse({ status: 404, description: '生产单不存在' })
  complete(@Param('id') id: string, @Body() dto?: CompleteProductionDto) {
    return this.productionService.complete(id, dto)
  }

  /**
   * 取消生产单
   */
  @Post(':id/cancel')
  @ApiOperation({ summary: '取消生产单' })
  @ApiResponse({ status: 200, description: '取消成功' })
  @ApiResponse({ status: 404, description: '生产单不存在' })
  cancel(@Param('id') id: string) {
    return this.productionService.cancel(id)
  }

  /**
   * 删除生产单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除生产单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '生产单不存在' })
  delete(@Param('id') id: string) {
    return this.productionService.delete(id)
  }
}
