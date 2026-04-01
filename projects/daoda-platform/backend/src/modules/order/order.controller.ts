/**
 * 订单控制器
 * 处理订单管理的 HTTP 请求
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './order.dto'
import { OrderService } from './order.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('订单管理')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 创建订单
   * POST /orders
   */
  @Post()
  @Roles('ADMIN', 'SALES')
  @ApiOperation({ summary: '创建订单', description: '创建新订单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 404, description: '客户或产品不存在' })
  async create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.orderService.create(dto, req.user?.sub)
  }

  /**
   * 获取订单列表
   * GET /orders
   */
  @Get()
  @Roles('ADMIN', 'SALES', 'PURCHASE')
  @ApiOperation({ summary: '获取订单列表', description: '获取订单列表，支持分页和筛选' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(query)
  }

  /**
   * 获取订单统计
   * GET /orders/statistics
   */
  @Get('statistics')
  @Roles('ADMIN', 'SALES')
  @ApiOperation({ summary: '获取订单统计', description: '获取订单统计数据' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getStatistics() {
    return this.orderService.getStats()
  }

  /**
   * 获取订单详情
   * GET /orders/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'SALES', 'PURCHASE')
  @ApiOperation({ summary: '获取订单详情', description: '获取指定订单的详细信息' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id)
  }

  /**
   * 更新订单
   * PUT /orders/:id
   */
  @Put(':id')
  @Roles('ADMIN', 'SALES')
  @ApiOperation({ summary: '更新订单', description: '更新订单信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto)
  }
}
