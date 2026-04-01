/**
 * 客户公海池控制器
 * API 接口：公海池列表、客户认领、客户释放、客户分配、自动回收
 */
import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common'
import { CustomerPoolService } from './customer-pool.service'

@Controller('api/customer/customer-pool')
export class CustomerPoolController {
  constructor(private readonly service: CustomerPoolService) {}

  // ========== 公海池列表 ==========

  @Get('list')
  getPoolList(@Query() params: any) {
    return this.service.getPoolList(params)
  }

  // ========== 客户认领 ==========

  @Post('claim')
  claimFromPool(@Body('customerId') customerId: string, @Body('userId') userId: string) {
    return this.service.claimFromPool(customerId, userId)
  }

  // ========== 客户释放 ==========

  @Post('release')
  releaseToPool(
    @Body('customerId') customerId: string,
    @Body('userId') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.service.releaseToPool(customerId, userId, reason)
  }

  // ========== 客户分配 ==========

  @Post('assign')
  assignCustomer(
    @Body('customerId') customerId: string,
    @Body('toUserId') toUserId: string,
    @Body('adminId') adminId: string,
  ) {
    return this.service.assignCustomer(customerId, toUserId, adminId)
  }

  // ========== 自动回收 ==========

  @Post('auto-reclaim')
  autoReclaim() {
    return this.service.autoReclaim()
  }

  // ========== 统计 ==========

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }
}
