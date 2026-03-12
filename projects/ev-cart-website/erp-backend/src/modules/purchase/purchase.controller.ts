import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PurchaseService } from './purchase.service'
import { CreatePurchaseRequestDto, CreatePurchaseOrderDto } from './dto/purchase.dto'

@ApiTags('purchase')
@Controller('api/v1/purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  // ==================== 采购申请 ====================

  @Post('requests')
  @ApiOperation({ summary: '创建采购申请' })
  async createRequest(@Body() dto: CreatePurchaseRequestDto) {
    return this.purchaseService.createRequest(dto)
  }

  @Get('requests')
  @ApiOperation({ summary: '采购申请列表' })
  async getRequests(@Query('status') status?: string) {
    return this.purchaseService.getRequests(status)
  }

  @Get('requests/:id')
  @ApiOperation({ summary: '采购申请详情' })
  async getRequest(@Param('id') id: string) {
    return this.purchaseService.getRequest(id)
  }

  @Put('requests/:id/status')
  @ApiOperation({ summary: '更新采购申请状态' })
  async updateRequestStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.purchaseService.updateRequestStatus(id, status)
  }

  // ==================== 采购订单 ====================

  @Post('orders')
  @ApiOperation({ summary: '创建采购订单' })
  async createOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.purchaseService.createOrder(dto)
  }

  @Get('orders')
  @ApiOperation({ summary: '采购订单列表' })
  async getOrders(@Query('status') status?: string) {
    return this.purchaseService.getOrders(status)
  }

  @Get('orders/:id')
  @ApiOperation({ summary: '采购订单详情' })
  async getOrder(@Param('id') id: string) {
    return this.purchaseService.getOrder(id)
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: '更新采购订单状态' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.purchaseService.updateOrderStatus(id, status)
  }

  @Post('orders/:id/receive')
  @ApiOperation({ summary: '采购入库' })
  async receiveOrder(@Param('id') id: string) {
    return this.purchaseService.receiveOrder(id)
  }

  // ==================== 供应商 ====================

  @Post('suppliers')
  @ApiOperation({ summary: '创建供应商' })
  async createSupplier(@Body() dto: any) {
    return this.purchaseService.createSupplier(dto)
  }

  @Get('suppliers')
  @ApiOperation({ summary: '供应商列表' })
  async getSuppliers() {
    return this.purchaseService.getSuppliers()
  }

  @Get('suppliers/:id')
  @ApiOperation({ summary: '供应商详情' })
  async getSupplier(@Param('id') id: string) {
    return this.purchaseService.getSupplier(id)
  }
}
