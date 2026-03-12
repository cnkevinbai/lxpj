import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { QualityInspection } from '../entities/quality-inspection.entity';
import { QualityDefect } from '../entities/quality-defect.entity';
import { QualityReport } from '../entities/quality-report.entity';
import { HttpService } from '@nestjs/axios';

/**
 * 质量管理数据互通服务（增强版）
 */
@Injectable()
export class QualityIntegrationService {
  private readonly logger = new Logger(QualityIntegrationService.name);

  // 内部服务 API 地址
  private readonly internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000';

  constructor(
    @InjectRepository(QualityInspection)
    private inspectionRepository: Repository<QualityInspection>,
    @InjectRepository(QualityDefect)
    private defectRepository: Repository<QualityDefect>,
    @InjectRepository(QualityReport)
    private reportRepository: Repository<QualityReport>,
    private dataSource: DataSource,
    private httpService: HttpService,
  ) {}

  // ========== 质量 ↔ 采购互通 ==========

  /**
   * 来料检验合格自动入库
   */
  async completeInspectionAndStockIn(inspectionId: string): Promise<any> {
    this.logger.log(`来料检验合格自动入库：${inspectionId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 获取质检单
      const inspection = await queryRunner.manager.findOne(QualityInspection, {
        where: { id: inspectionId },
        relations: ['items'],
      });

      if (!inspection) {
        throw new Error('质检单不存在');
      }

      // 检查检验结果
      if (inspection.status !== 'completed') {
        throw new Error('质检单未完成');
      }

      if (inspection.defectiveQuantity > 0) {
        throw new Error('存在不良品，不能入库');
      }

      // 调用库存 API 入库
      const stockInResult = await this.callInventoryApi('POST', '/api/v1/inventory/stock-in', {
        type: 'quality_inspection',
        sourceId: inspectionId,
        sourceNo: inspection.inspectionNo,
        productId: inspection.productId,
        productName: inspection.productName,
        productModel: inspection.productModel,
        quantity: inspection.quantity,
        warehouseId: 'warehouse-incoming',
        remark: `来料检验合格入库 - ${inspection.inspectionNo}`,
      });

      // 更新供应商质量评分
      if (inspection.supplierId) {
        await this.updateSupplierQualityRating(
          queryRunner.manager,
          inspection.supplierId,
          inspection.qualifiedRate,
        );
      }

      await queryRunner.commitTransaction();

      this.logger.log(`来料检验入库完成：${inspectionId}`);

      return {
        success: true,
        inspection: {
          id: inspection.id,
          inspectionNo: inspection.inspectionNo,
          quantity: inspection.quantity,
        },
        stockInResult,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`来料检验入库失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新供应商质量评分
   */
  private async updateSupplierQualityRating(
    manager: any,
    supplierId: string,
    qualifiedRate: number,
  ): Promise<void> {
    this.logger.log(`更新供应商质量评分：${supplierId}, 合格率：${qualifiedRate}%`);

    try {
      // 调用采购服务更新供应商评分
      await this.callProcurementApi('POST', `/api/v1/suppliers/${supplierId}/update-quality-rating`, {
        qualifiedRate,
        inspectionDate: new Date(),
      });

      this.logger.log(`供应商质量评分更新成功：${supplierId}`);
    } catch (error) {
      this.logger.error(`更新供应商质量评分失败：${error.message}`);
      // 不抛出错误，避免影响主流程
    }
  }

  /**
   * 获取供应商质量统计
   */
  async getSupplierQualityStatistics(supplierId: string, period?: string): Promise<SupplierQualityStats> {
    const queryBuilder = this.inspectionRepository.createQueryBuilder('inspection');
    queryBuilder.where('inspection.supplierId = :supplierId', { supplierId });
    queryBuilder.andWhere('inspection.inspectionType = :inspectionType', { inspectionType: 'incoming' });

    if (period) {
      queryBuilder.andWhere('inspection.createdAt >= :startDate', { startDate: new Date(period) });
    }

    const inspections = await queryBuilder.getMany();

    const totalInspections = inspections.length;
    const totalQuantity = inspections.reduce((sum, i) => sum + Number(i.quantity), 0);
    const qualifiedQuantity = inspections.reduce((sum, i) => sum + Number(i.qualifiedQuantity), 0);
    const defectiveQuantity = inspections.reduce((sum, i) => sum + Number(i.defectiveQuantity), 0);
    const qualifiedRate = totalQuantity > 0 ? (qualifiedQuantity / totalQuantity) * 100 : 0;

    // 统计不良类型
    const defectTypes = {};
    inspections.forEach(i => {
      if (i.defectTypes) {
        i.defectTypes.forEach(type => {
          defectTypes[type] = (defectTypes[type] || 0) + 1;
        });
      }
    });

    return {
      supplierId,
      period,
      totalInspections,
      totalQuantity,
      qualifiedQuantity,
      defectiveQuantity,
      qualifiedRate,
      defectTypes,
    };
  }

  // ========== 质量 ↔ 生产互通 ==========

  /**
   * 过程检验数据同步到生产工单
   */
  async syncInspectionToProduction(inspectionId: string): Promise<any> {
    this.logger.log(`过程检验数据同步到生产工单：${inspectionId}`);

    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
    if (!inspection) {
      throw new Error('质检单不存在');
    }

    if (inspection.inspectionType !== 'process') {
      throw new Error('不是过程检验单');
    }

    // 调用生产服务同步数据
    const syncResult = await this.callProductionApi('POST', `/api/v1/production/orders/${inspection.relatedOrderId}/sync-quality`, {
      inspectionId: inspection.id,
      inspectionNo: inspection.inspectionNo,
      qualifiedRate: inspection.qualifiedRate,
      defectiveQuantity: inspection.defectiveQuantity,
      defectTypes: inspection.defectTypes,
      inspectionDate: inspection.completedDate,
    });

    this.logger.log(`过程检验数据同步完成：${inspectionId}`);

    return {
      success: true,
      inspectionId: inspection.id,
      productionOrderId: inspection.relatedOrderId,
      ...syncResult,
    };
  }

  /**
   * 成品检验合格自动入库
   */
  async completeFinalInspectionAndStockIn(inspectionId: string): Promise<any> {
    this.logger.log(`成品检验合格自动入库：${inspectionId}`);

    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
    if (!inspection) {
      throw new Error('质检单不存在');
    }

    if (inspection.inspectionType !== 'final') {
      throw new Error('不是成品检验单');
    }

    if (inspection.status !== 'completed') {
      throw new Error('质检单未完成');
    }

    if (inspection.defectiveQuantity > 0) {
      throw new Error('存在不良品，不能入库');
    }

    // 调用库存服务入库
    const stockInResult = await this.callInventoryApi('POST', '/api/v1/inventory/stock-in', {
      type: 'production_complete',
      sourceId: inspectionId,
      sourceNo: inspection.inspectionNo,
      productId: inspection.productId,
      productName: inspection.productName,
      productModel: inspection.productModel,
      quantity: inspection.qualifiedQuantity,
      warehouseId: 'warehouse-finished',
      remark: `成品检验合格入库 - ${inspection.inspectionNo}`,
    });

    // 更新生产工单状态
    const productionOrderUpdate = await this.callProductionApi('POST', `/api/v1/production/orders/${inspection.relatedOrderId}/complete`, {
      inspectionId: inspection.id,
      qualifiedQuantity: inspection.qualifiedQuantity,
      completedDate: inspection.completedDate,
    });

    this.logger.log(`成品检验入库完成：${inspectionId}`);

    return {
      success: true,
      inspection: {
        id: inspection.id,
        inspectionNo: inspection.inspectionNo,
        quantity: inspection.qualifiedQuantity,
      },
      stockInResult,
      productionOrderUpdate,
    };
  }

  // ========== 质量 ↔ 销售互通 ==========

  /**
   * 出厂检验报告发送客户
   */
  async sendInspectionReportToCustomer(inspectionId: string): Promise<any> {
    this.logger.log(`出厂检验报告发送客户：${inspectionId}`);

    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
    if (!inspection) {
      throw new Error('质检单不存在');
    }

    if (inspection.inspectionType !== 'outgoing') {
      throw new Error('不是出厂检验单');
    }

    // 生成检验报告
    const report = await this.generateInspectionReport(inspection);

    // 获取客户信息
    const customerInfo = await this.getCustomerInfo(inspection.relatedOrderId);

    // 发送邮件/短信给客户
    const sendResult = await this.sendReportToCustomer(customerInfo, report);

    this.logger.log(`出厂检验报告发送完成：${inspectionId}`);

    return {
      success: true,
      inspectionId: inspection.id,
      customerId: customerInfo.id,
      customerName: customerInfo.name,
      sentAt: new Date(),
      sendMethod: sendResult.method,
    };
  }

  /**
   * 获取销售订单质量统计
   */
  async getSalesOrderQualityStatistics(orderId: string): Promise<SalesOrderQualityStats> {
    const inspections = await this.inspectionRepository.find({
      where: {
        relatedOrderId: orderId,
        relatedType: 'sales',
      },
    });

    const totalInspections = inspections.length;
    const totalQuantity = inspections.reduce((sum, i) => sum + Number(i.quantity), 0);
    const qualifiedQuantity = inspections.reduce((sum, i) => sum + Number(i.qualifiedQuantity), 0);
    const qualifiedRate = totalQuantity > 0 ? (qualifiedQuantity / totalQuantity) * 100 : 0;

    return {
      orderId,
      totalInspections,
      totalQuantity,
      qualifiedQuantity,
      qualifiedRate,
      inspections,
    };
  }

  /**
   * 生成质量证书
   */
  async generateQualityCertificate(inspectionId: string, templateId?: string): Promise<any> {
    this.logger.log(`生成质量证书：${inspectionId}`);

    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
    if (!inspection) {
      throw new Error('质检单不存在');
    }

    // 生成证书编号
    const certificateNo = `QC${Date.now()}`;

    // TODO: 生成 PDF 证书
    const certificate = {
      certificateNo,
      inspectionId: inspection.id,
      inspectionNo: inspection.inspectionNo,
      productName: inspection.productName,
      productModel: inspection.productModel,
      quantity: inspection.quantity,
      qualifiedRate: inspection.qualifiedRate,
      inspectionDate: inspection.completedDate,
      generatedAt: new Date(),
    };

    this.logger.log(`质量证书生成完成：${certificateNo}`);

    return {
      success: true,
      certificate,
    };
  }

  // ========== 质量 ↔ 库存互通 ==========

  /**
   * 检验状态同步到库存
   */
  async syncInspectionStatusToInventory(inspectionId: string): Promise<any> {
    this.logger.log(`检验状态同步到库存：${inspectionId}`);

    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
    if (!inspection) {
      throw new Error('质检单不存在');
    }

    // 调用库存服务更新状态
    const syncResult = await this.callInventoryApi('POST', '/api/v1/inventory/sync-quality-status', {
      inspectionId: inspection.id,
      inspectionNo: inspection.inspectionNo,
      productId: inspection.productId,
      productName: inspection.productName,
      quantity: inspection.quantity,
      status: inspection.status,
      qualifiedQuantity: inspection.qualifiedQuantity,
      defectiveQuantity: inspection.defectiveQuantity,
    });

    this.logger.log(`检验状态同步完成：${inspectionId}`);

    return {
      success: true,
      inspectionId: inspection.id,
      ...syncResult,
    };
  }

  /**
   * 不合格品锁定库存
   */
  async lockDefectiveStock(defectId: string): Promise<any> {
    this.logger.log(`不合格品锁定库存：${defectId}`);

    const defect = await this.defectRepository.findOne({ where: { id: defectId } });
    if (!defect) {
      throw new Error('不良品记录不存在');
    }

    // 调用库存服务锁定库存
    const lockResult = await this.callInventoryApi('POST', '/api/v1/inventory/lock', {
      type: 'quality_defect',
      sourceId: defectId,
      sourceNo: defect.defectNo,
      productId: defect.productId,
      productName: defect.productName,
      quantity: defect.quantity,
      reason: `质量不良 - ${defect.defectType}`,
      defectSeverity: defect.severity,
    });

    this.logger.log(`不合格品库存锁定完成：${defectId}`);

    return {
      success: true,
      defectId: defect.id,
      defectNo: defect.defectNo,
      ...lockResult,
    };
  }

  /**
   * 获取库存质量统计
   */
  async getInventoryQualityStatistics(warehouseId?: string): Promise<any> {
    // 调用库存服务获取统计
    const stats = await this.callInventoryApi('GET', '/api/v1/inventory/quality-stats', { warehouseId });

    return {
      success: true,
      data: stats,
    };
  }

  // ========== 质量 ↔ 售后互通 ==========

  /**
   * 售后不良品同步到质量系统
   */
  async syncAfterSalesDefectToQuality(defectData: AfterSalesDefectData): Promise<QualityDefect> {
    this.logger.log(`售后不良品同步到质量系统：${defectData.productId}`);

    const defect = this.defectRepository.create({
      defectNo: await this.generateDefectNo(),
      productId: defectData.productId,
      productName: defectData.productName,
      productModel: defectData.productModel,
      quantity: defectData.quantity,
      defectType: defectData.defectType,
      defectDescription: defectData.defectDescription,
      severity: defectData.severity,
      status: 'pending',
      foundById: defectData.customerId,
      foundByName: defectData.customerName,
      foundDate: defectData.foundDate,
      departmentId: defectData.departmentId,
      departmentName: '售后服务部',
    });

    await this.defectRepository.save(defect);

    // 同步到售后系统
    await this.callAfterSalesApi('POST', '/api/v1/after-sales/defects/sync-to-quality', {
      qualityDefectId: defect.id,
      qualityDefectNo: defect.defectNo,
    });

    this.logger.log(`售后不良品同步完成：${defect.defectNo}`);

    return defect;
  }

  /**
   * 获取产品质量追溯
   */
  async getProductTraceability(productId: string, batchNo?: string): Promise<TraceabilityResult> {
    this.logger.log(`获取产品质量追溯：${productId}, ${batchNo || '全部批次'}`);

    // 获取质检记录
    const inspections = await this.inspectionRepository.find({
      where: productId ? { productId } : {},
      order: { createdAt: 'DESC' },
    });

    // 获取不良品记录
    const defects = await this.defectRepository.find({
      where: productId ? { productId } : {},
      order: { createdAt: 'DESC' },
    });

    const result: TraceabilityResult = {
      productId,
      batchNo,
      inspections,
      defects,
      summary: {
        totalInspections: inspections.length,
        totalDefects: defects.length,
        qualifiedRate: this.calculateQualifiedRate(inspections),
      },
    };

    return result;
  }

  /**
   * 质量改进措施同步到售后
   */
  async syncImprovementsToAfterSales(productId: string, measures: string[]): Promise<any> {
    this.logger.log(`质量改进措施同步到售后：${productId}`);

    // 调用售后服务同步
    const syncResult = await this.callAfterSalesApi('POST', '/api/v1/after-sales/improvements/sync', {
      productId,
      measures,
      syncedAt: new Date(),
    });

    return {
      success: true,
      productId,
      measuresCount: measures.length,
      ...syncResult,
    };
  }

  // ========== 质量 ↔ 财务互通 ==========

  /**
   * 质量成本同步到财务
   */
  async syncQualityCostToFinance(period: string): Promise<any> {
    this.logger.log(`质量成本同步到财务：${period}`);

    // 统计质量成本
    const defects = await this.defectRepository.find({
      where: {
        createdAt: () => `>= '${period}-01'`,
      },
    });

    const totalCost = defects.reduce((sum, d) => sum + (d.handlingCost || 0), 0);
    const reworkCost = defects.filter(d => d.handlingMethod === '返工').reduce((sum, d) => sum + (d.handlingCost || 0), 0);
    const scrapCost = defects.filter(d => d.handlingMethod === '报废').reduce((sum, d) => sum + (d.handlingCost || 0), 0);

    // 调用财务服务同步成本
    const syncResult = await this.callFinanceApi('POST', '/api/v1/finance/quality-costs/sync', {
      period,
      totalCost,
      reworkCost,
      scrapCost,
      defectCount: defects.length,
      syncedAt: new Date(),
    });

    this.logger.log(`质量成本同步完成：${period}, 总成本：${totalCost}`);

    return {
      success: true,
      period,
      totalCost,
      defectCount: defects.length,
      ...syncResult,
    };
  }

  /**
   * 创建质量索赔财务记录
   */
  async createQualityClaimFinancialRecord(data: {
    defectId: string;
    amount: number;
    customerId?: string;
    supplierId?: string;
  }): Promise<any> {
    this.logger.log(`创建质量索赔财务记录：${data.defectId}`);

    // 调用财务服务创建记录
    const financialRecord = await this.callFinanceApi('POST', '/api/v1/finance/claims/create', {
      type: 'quality_claim',
      ...data,
      createdAt: new Date(),
    });

    return {
      success: true,
      financialRecordNo: financialRecord.recordNo,
      ...data,
    };
  }

  /**
   * 获取质量成本统计
   */
  async getQualityCostStatistics(period?: string): Promise<any> {
    // 调用财务服务获取统计
    const stats = await this.callFinanceApi('GET', '/api/v1/finance/quality-costs/statistics', { period });

    return {
      success: true,
      data: stats,
    };
  }

  // ========== 辅助方法 ==========

  private async generateDefectNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.defectRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `DF${year}${month}${sequence}`;
  }

  private calculateQualifiedRate(inspections: QualityInspection[]): number {
    if (inspections.length === 0) return 0;

    const totalQuantity = inspections.reduce((sum, i) => sum + Number(i.quantity), 0);
    const qualifiedQuantity = inspections.reduce((sum, i) => sum + Number(i.qualifiedQuantity), 0);

    return totalQuantity > 0 ? (qualifiedQuantity / totalQuantity) * 100 : 0;
  }

  private async generateInspectionReport(inspection: QualityInspection): Promise<any> {
    // 生成检验报告
    return {
      reportNo: `RPT${inspection.inspectionNo}`,
      inspection,
      generatedAt: new Date(),
    };
  }

  private async getCustomerInfo(orderId: string): Promise<any> {
    // 获取客户信息
    return {
      id: 'customer-xxx',
      name: '客户名称',
      email: 'customer@example.com',
      phone: '138****1234',
    };
  }

  private async sendReportToCustomer(customer: any, report: any): Promise<any> {
    // 发送报告给客户
    return {
      method: 'email',
      sentAt: new Date(),
      success: true,
    };
  }

  // API 调用封装
  private async callInventoryApi(method: string, url: string, data?: any): Promise<any> {
    // TODO: 实现内部 API 调用
    return { success: true, message: '调用成功' };
  }

  private async callProductionApi(method: string, url: string, data?: any): Promise<any> {
    // TODO: 实现内部 API 调用
    return { success: true, message: '调用成功' };
  }

  private async callProcurementApi(method: string, url: string, data?: any): Promise<any> {
    // TODO: 实现内部 API 调用
    return { success: true, message: '调用成功' };
  }

  private async callAfterSalesApi(method: string, url: string, data?: any): Promise<any> {
    // TODO: 实现内部 API 调用
    return { success: true, message: '调用成功' };
  }

  private async callFinanceApi(method: string, url: string, data?: any): Promise<any> {
    // TODO: 实现内部 API 调用
    return { success: true, message: '调用成功' };
  }
}

// ========== 类型定义 ==========

interface SupplierQualityStats {
  supplierId: string;
  period?: string;
  totalInspections: number;
  totalQuantity: number;
  qualifiedQuantity: number;
  defectiveQuantity: number;
  qualifiedRate: number;
  defectTypes: Record<string, number>;
}

interface SalesOrderQualityStats {
  orderId: string;
  totalInspections: number;
  totalQuantity: number;
  qualifiedQuantity: number;
  qualifiedRate: number;
  inspections: QualityInspection[];
}

interface AfterSalesDefectData {
  productId: string;
  productName: string;
  productModel?: string;
  quantity: number;
  defectType: string;
  defectDescription: string;
  severity: 'critical' | 'major' | 'minor';
  customerId: string;
  customerName: string;
  foundDate: Date;
  departmentId?: string;
  departmentName?: string;
}

interface TraceabilityResult {
  productId: string;
  batchNo?: string;
  inspections: QualityInspection[];
  defects: QualityDefect[];
  summary: {
    totalInspections: number;
    totalDefects: number;
    qualifiedRate: number;
  };
}
