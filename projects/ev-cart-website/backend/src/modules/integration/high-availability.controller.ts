import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HighAvailabilityService } from './services/high-availability.service';

/**
 * 高可用控制器
 * 提供健康检查、系统状态、手动同步等 API
 */
@Controller('api/v1/ha')
@UseGuards(AuthGuard('jwt'))
export class HighAvailabilityController {
  constructor(
    private readonly haService: HighAvailabilityService,
  ) {}

  /**
   * 健康检查
   * GET /api/v1/ha/health
   */
  @Get('health')
  async healthCheck() {
    return this.haService.healthCheck();
  }

  /**
   * 系统状态
   * GET /api/v1/ha/status
   */
  @Get('status')
  async getSystemStatus() {
    return this.haService.getSystemStatus();
  }

  /**
   * 手动同步库存
   * POST /api/v1/ha/sync/inventory
   */
  @Post('sync/inventory')
  async syncInventory(@Query('productIds') productIds?: string) {
    const ids = productIds ? productIds.split(',') : undefined;
    return this.haService.addToRetryQueue('inventory_sync', { productIds: ids });
  }

  /**
   * 手动同步价格
   * POST /api/v1/ha/sync/price
   */
  @Post('sync/price')
  async syncPrice(@Query('productIds') productIds?: string) {
    const ids = productIds ? productIds.split(',') : undefined;
    return this.haService.addToRetryQueue('price_sync', { productIds: ids });
  }

  /**
   * 手动同步客户
   * POST /api/v1/ha/sync/customer
   */
  @Post('sync/customer')
  async syncCustomer(@Body('customerId') customerId: string) {
    return this.haService.addToRetryQueue('customer_sync', { customerId });
  }

  /**
   * 获取重试队列状态
   * GET /api/v1/ha/queue
   */
  @Get('queue')
  async getQueueStatus() {
    // TODO: 从数据库获取队列状态
    return {
      length: 0,
      pending: 0,
      failed: 0,
    };
  }

  /**
   * 清空重试队列
   * POST /api/v1/ha/queue/clear
   */
  @Post('queue/clear')
  async clearQueue() {
    // TODO: 清空队列
    return { success: true, message: '队列已清空' };
  }
}
