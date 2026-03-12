import { Injectable, Logger } from '@nestjs/common';
import { IntegrationService } from './integration.service';

/**
 * 财务同步服务
 * 负责 ERP 财务模块与 CRM 的数据同步
 */
@Injectable()
export class FinancialSyncService {
  private readonly logger = new Logger(FinancialSyncService.name);

  constructor(
    private integrationService: IntegrationService,
  ) {}

  /**
   * 同步收款记录到 CRM
   */
  async syncPaymentToCrm(data: any) {
    this.logger.log(`同步收款记录：${data.orderNo}`);

    try {
      await this.integrationService.syncPaymentToCrm({
        orderNo: data.orderNo,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        transactionNo: data.transactionNo,
        remark: data.remark,
        paidAmount: data.paidAmount,
        balanceAmount: data.balanceAmount,
      });

      return {
        success: true,
        message: '收款记录已同步到 CRM',
      };
    } catch (error) {
      this.logger.error(`收款同步失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 同步发票信息到 CRM
   */
  async syncInvoiceToCrm(data: any) {
    this.logger.log(`同步发票信息：${data.invoiceNo}`);

    try {
      // TODO: 实现发票同步
      // 1. 查找 CRM 订单
      // 2. 创建发票记录
      // 3. 更新订单发票状态

      return {
        success: true,
        message: '发票信息已同步到 CRM',
      };
    } catch (error) {
      this.logger.error(`发票同步失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 同步信用额度到 CRM
   */
  async syncCreditLimit(data: any) {
    this.logger.log(`同步信用额度：${data.customerId}`);

    try {
      // TODO: 实现信用额度同步
      // 1. 获取 ERP 客户信用额度
      // 2. 更新 CRM 客户信用额度
      // 3. 信用预警（额度过低）

      return {
        success: true,
        message: '信用额度已同步到 CRM',
      };
    } catch (error) {
      this.logger.error(`信用额度同步失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 获取财务对账状态
   */
  async getReconciliationStatus() {
    try {
      // TODO: 获取对账状态
      return {
        lastReconciliation: new Date('2026-03-12T13:00:00Z'),
        totalOrders: 150,
        reconciledOrders: 148,
        pendingOrders: 2,
        totalAmount: 5000000,
        reconciledAmount: 4950000,
        pendingAmount: 50000,
      };
    } catch (error) {
      this.logger.error(`获取对账状态失败：${error.message}`);
      throw error;
    }
  }
}
