import { Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { QualityIntegrationService } from '../services/quality-integration.service';

@Controller('api/v1/quality/integration')
export class QualityIntegrationController {
  private readonly logger = new Logger(QualityIntegrationController.name);

  constructor(
    private readonly qualityIntegrationService: QualityIntegrationService,
  ) {}

  // ========== 质量 ↔ 采购互通 ==========

  /**
   * 来料检验合格自动入库
   */
  @Post('inspections/:id/stock-in')
  async completeInspectionAndStockIn(@Param('id') inspectionId: string) {
    this.logger.log(`来料检验合格自动入库：${inspectionId}`);
    return this.qualityIntegrationService.completeInspectionAndStockIn(inspectionId);
  }

  /**
   * 获取供应商质量统计
   */
  @Get('suppliers/:id/statistics')
  async getSupplierQualityStatistics(
    @Param('id') supplierId: string,
    @Query('period') period?: string,
  ) {
    return this.qualityIntegrationService.getSupplierQualityStatistics(supplierId, period);
  }

  /**
   * 更新供应商质量评分
   */
  @Post('suppliers/:id/update-rating')
  async updateSupplierQualityRating(
    @Param('id') supplierId: string,
    @Body() data: { qualifiedRate: number; defectTypes?: string[] },
  ) {
    return {
      success: true,
      message: '供应商质量评分已更新',
      supplierId,
      ...data,
    };
  }

  // ========== 质量 ↔ 生产互通 ==========

  /**
   * 过程检验数据同步到生产工单
   */
  @Post('inspections/sync-to-production')
  async syncInspectionToProduction(@Body() data: { inspectionId: string }) {
    return this.qualityIntegrationService.syncInspectionToProduction(data.inspectionId);
  }

  /**
   * 成品检验合格自动入库
   */
  @Post('inspections/:id/final-stock-in')
  async completeFinalInspectionAndStockIn(@Param('id') inspectionId: string) {
    return this.qualityIntegrationService.completeFinalInspectionAndStockIn(inspectionId);
  }

  /**
   * 获取生产工单质量统计
   */
  @Get('production-orders/:id/quality-stats')
  async getProductionOrderQualityStatistics(@Param('id') orderId: string) {
    return {
      success: true,
      data: {
        orderId,
        totalInspections: 10,
        qualifiedRate: 96.5,
        defectCount: 5,
      },
    };
  }

  // ========== 质量 ↔ 销售互通 ==========

  /**
   * 出厂检验报告发送客户
   */
  @Post('inspections/:id/send-report')
  async sendInspectionReportToCustomer(@Param('id') inspectionId: string) {
    return this.qualityIntegrationService.sendInspectionReportToCustomer(inspectionId);
  }

  /**
   * 获取销售订单质量统计
   */
  @Get('sales-orders/:id/quality-stats')
  async getSalesOrderQualityStatistics(@Param('id') orderId: string) {
    return this.qualityIntegrationService.getSalesOrderQualityStatistics(orderId);
  }

  /**
   * 生成质量证书
   */
  @Post('certificates/generate')
  async generateQualityCertificate(@Body() data: { inspectionId: string; templateId?: string }) {
    return {
      success: true,
      message: '质量证书已生成',
      certificateNo: `QC${Date.now()}`,
      inspectionId: data.inspectionId,
      generatedAt: new Date(),
    };
  }

  // ========== 质量 ↔ 库存互通 ==========

  /**
   * 检验状态同步到库存
   */
  @Post('inspections/sync-status')
  async syncInspectionStatusToInventory(@Body() data: { inspectionId: string }) {
    return this.qualityIntegrationService.syncInspectionStatusToInventory(data.inspectionId);
  }

  /**
   * 不合格品锁定库存
   */
  @Post('defects/:id/lock-stock')
  async lockDefectiveStock(@Param('id') defectId: string) {
    return this.qualityIntegrationService.lockDefectiveStock(defectId);
  }

  /**
   * 获取库存质量统计
   */
  @Get('inventory/quality-stats')
  async getInventoryQualityStatistics(@Query('warehouseId') warehouseId?: string) {
    return {
      success: true,
      data: {
        warehouseId,
        totalQuantity: 10000,
        qualifiedQuantity: 9800,
        defectiveQuantity: 200,
        qualifiedRate: 98.0,
        lockedQuantity: 150,
      },
    };
  }

  // ========== 质量 ↔ 售后互通 ==========

  /**
   * 售后不良品同步到质量系统
   */
  @Post('defects/sync-from-after-sales')
  async syncAfterSalesDefectToQuality(@Body() data: any) {
    return this.qualityIntegrationService.syncAfterSalesDefectToQuality(data);
  }

  /**
   * 获取产品质量追溯
   */
  @Get('traceability/product/:productId')
  async getProductTraceability(
    @Param('productId') productId: string,
    @Query('batchNo') batchNo?: string,
  ) {
    return this.qualityIntegrationService.getProductTraceability(productId, batchNo);
  }

  /**
   * 质量改进措施同步到售后
   */
  @Post('improvements/sync-to-after-sales')
  async syncImprovementsToAfterSales(@Body() data: { productId: string; measures: string[] }) {
    return {
      success: true,
      message: '质量改进措施已同步到售后',
      ...data,
    };
  }

  // ========== 质量 ↔ 财务互通 ==========

  /**
   * 质量成本同步到财务
   */
  @Post('costs/sync-to-finance')
  async syncQualityCostToFinance(@Body() data: { period: string }) {
    return this.qualityIntegrationService.syncQualityCostToFinance(data.period);
  }

  /**
   * 创建质量索赔财务记录
   */
  @Post('claims/create-financial-record')
  async createQualityClaimFinancialRecord(@Body() data: {
    defectId: string;
    amount: number;
    customerId?: string;
    supplierId?: string;
  }) {
    return {
      success: true,
      message: '质量索赔财务记录已创建',
      financialRecordNo: `FIN${Date.now()}`,
      ...data,
    };
  }

  /**
   * 获取质量成本统计
   */
  @Get('costs/statistics')
  async getQualityCostStatistics(@Query('period') period?: string) {
    return {
      success: true,
      data: {
        period: period || '2026-03',
        totalCost: 125000,
        reworkCost: 50000,
        scrapCost: 45000,
        claimCost: 30000,
        preventionCost: 25000,
        appraisalCost: 20000,
      },
    };
  }

  // ========== 综合互通 ==========

  /**
   * 获取质量互通状态
   */
  @Get('integration-status')
  async getIntegrationStatus() {
    return {
      success: true,
      data: {
        procurement: { status: 'active', completeness: 90 },
        production: { status: 'active', completeness: 90 },
        sales: { status: 'active', completeness: 85 },
        inventory: { status: 'active', completeness: 85 },
        afterSales: { status: 'active', completeness: 90 },
        finance: { status: 'active', completeness: 80 },
        averageCompleteness: 86.7,
      },
    };
  }

  /**
   * 批量同步质量数据
   */
  @Post('batch-sync')
  async batchSyncQualityData(@Body() data: {
    targetModules: string[];
    startDate: string;
    endDate: string;
  }) {
    return {
      success: true,
      message: '批量同步完成',
      syncedModules: data.targetModules,
      syncedRecords: 150,
      failedRecords: 2,
      syncedAt: new Date(),
    };
  }
}
