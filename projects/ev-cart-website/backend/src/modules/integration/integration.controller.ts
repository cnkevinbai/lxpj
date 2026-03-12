import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationService } from './integration.service';

/**
 * 集成控制器
 * 提供 CRM/ERP/官网 之间的数据同步 API
 */
@Controller('api/v1/integration')
@UseGuards(AuthGuard('jwt'))
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  // ========== CRM → ERP ==========

  /**
   * CRM 商机转 ERP 订单
   * POST /api/v1/integration/crm/opportunity/:id/convert
   */
  @Post('crm/opportunity/:id/convert')
  async convertOpportunityToOrder(@Param('id') opportunityId: string) {
    return this.integrationService.convertOpportunityToOrder(opportunityId);
  }

  // ========== ERP → CRM ==========

  /**
   * 同步 ERP 库存到 CRM
   * POST /api/v1/integration/erp/inventory/sync
   */
  @Post('erp/inventory/sync')
  async syncInventoryToCrm(@Query('productIds') productIds?: string) {
    const ids = productIds ? productIds.split(',') : undefined;
    return this.integrationService.syncInventoryToCrm(ids);
  }

  /**
   * 同步 ERP 价格到 CRM
   * POST /api/v1/integration/erp/price/sync
   */
  @Post('erp/price/sync')
  async syncPriceToCrm(@Query('productIds') productIds?: string) {
    const ids = productIds ? productIds.split(',') : undefined;
    return this.integrationService.syncPriceToCrm(ids);
  }

  /**
   * ERP 库存实时同步（Webhook）
   * POST /api/v1/integration/erp/inventory/webhook
   */
  @Post('erp/inventory/webhook')
  async realTimeInventorySync(@Body() data: any) {
    return this.integrationService.realTimeInventorySync(data);
  }

  /**
   * ERP 付款同步到 CRM
   * POST /api/v1/integration/erp/payment/sync
   */
  @Post('erp/payment/sync')
  async syncPaymentToCrm(@Body() data: any) {
    return this.integrationService.syncPaymentToCrm(data);
  }

  // ========== 客户数据同步 ==========

  /**
   * CRM 客户同步到 ERP
   * POST /api/v1/integration/crm/customer/:id/sync
   */
  @Post('crm/customer/:id/sync')
  async syncCustomerToErp(@Param('id') customerId: string) {
    return this.integrationService.syncCustomerToErp(customerId);
  }

  // ========== 批量同步 ==========

  /**
   * 批量同步所有数据
   * POST /api/v1/integration/sync/all
   */
  @Post('sync/all')
  async syncAll() {
    const results = await Promise.allSettled([
      this.integrationService.syncInventoryToCrm(),
      this.integrationService.syncPriceToCrm(),
    ]);

    return {
      success: true,
      results: results.map((r, i) => ({
        type: i === 0 ? 'inventory' : 'price',
        status: r.status,
        value: r.status === 'fulfilled' ? r.value : r.reason,
      })),
    };
  }

  /**
   * 获取同步状态
   * GET /api/v1/integration/status
   */
  @Get('status')
  async getSyncStatus() {
    // TODO: 从数据库获取同步状态
    return {
      lastInventorySync: new Date('2026-03-12T13:30:00Z'),
      lastPriceSync: new Date('2026-03-12T13:30:00Z'),
      lastCustomerSync: new Date('2026-03-12T13:30:00Z'),
      pendingOpportunities: 0,
      failedSyncs: 0,
    };
  }
}
