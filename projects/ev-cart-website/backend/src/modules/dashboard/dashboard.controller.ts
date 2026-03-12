import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'

@ApiTags('仪表盘')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: '获取仪表盘数据' })
  getDashboard() {
    return this.dashboardService.getDashboardData()
  }

  @Get('sales-trend')
  @ApiOperation({ summary: '获取销售趋势' })
  getSalesTrend(@Query('days') days: number = 7) {
    return this.dashboardService.getSalesTrend(days)
  }

  @Get('customer-dist')
  @ApiOperation({ summary: '获取客户分布' })
  getCustomerDistribution() {
    return this.dashboardService.getCustomerDistribution()
  }

  @Get('pending-orders')
  @ApiOperation({ summary: '获取待处理订单' })
  getPendingOrders() {
    return this.dashboardService.getPendingOrders()
  }
}
