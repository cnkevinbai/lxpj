import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrmService } from '../crm/crm.service';
import { ErpService } from '../erp/erp.service';

/**
 * 集成服务
 * 负责 CRM/ERP/官网 之间的数据同步和业务流打通
 */
@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(
    private crmService: CrmService,
    private erpService: ErpService,
  ) {}

  // ========== CRM → ERP 商机转订单 ==========
  
  /**
   * 将 CRM 商机转换为 ERP 销售订单
   * @param opportunityId CRM 商机 ID
   * @returns ERP 订单 ID
   */
  async convertOpportunityToOrder(opportunityId: string) {
    this.logger.log(`开始转换商机 ${opportunityId} 为销售订单`);

    try {
      // 1. 获取 CRM 商机详情
      const opportunity = await this.crmService.getOpportunity(opportunityId);
      if (!opportunity) {
        throw new HttpException('商机不存在', HttpStatus.NOT_FOUND);
      }

      // 2. 验证商机状态（必须是赢单）
      if (opportunity.status !== 'won') {
        throw new HttpException('仅赢单商机可转换为订单', HttpStatus.BAD_REQUEST);
      }

      // 3. 获取客户信息
      const customer = await this.crmService.getCustomer(opportunity.customerId);
      if (!customer) {
        throw new HttpException('客户不存在', HttpStatus.NOT_FOUND);
      }

      // 4. 构建 ERP 订单数据
      const orderData = {
        orderNo: this.generateOrderNo(),
        customerId: customer.id,
        customerName: customer.name,
        contactPerson: customer.contactPerson,
        contactPhone: customer.phone,
        products: opportunity.products.map((p: any) => ({
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          amount: p.quantity * p.unitPrice,
        })),
        totalAmount: opportunity.totalAmount,
        discountAmount: opportunity.discountAmount || 0,
        finalAmount: opportunity.totalAmount - (opportunity.discountAmount || 0),
        deliveryAddress: opportunity.deliveryAddress,
        deliveryDate: opportunity.expectedDeliveryDate,
        paymentTerms: opportunity.paymentTerms,
        remark: opportunity.remark,
        sourceOpportunityId: opportunityId, // 关联 CRM 商机
      };

      // 5. 创建 ERP 销售订单
      const erpOrder = await this.erpNetService.createSalesOrder(orderData);
      this.logger.log(`ERP 订单创建成功：${erpOrder.orderNo}`);

      // 6. 更新 CRM 商机状态
      await this.crmService.updateOpportunity(opportunityId, {
        status: 'converted',
        erpOrderId: erpOrder.id,
        erpOrderNo: erpOrder.orderNo,
        convertedAt: new Date(),
      });

      // 7. 发送通知
      await this.sendNotification('opportunity_converted', {
        opportunityId,
        erpOrderId: erpOrder.id,
        erpOrderNo: erpOrder.orderNo,
        customerId: customer.id,
        amount: orderData.finalAmount,
      });

      return {
        success: true,
        opportunityId,
        erpOrderId: erpOrder.id,
        erpOrderNo: erpOrder.orderNo,
        message: '商机已成功转换为销售订单',
      };
    } catch (error) {
      this.logger.error(`商机转换失败：${error.message}`, error.stack);
      throw error;
    }
  }

  // ========== ERP → CRM 库存同步 ==========

  /**
   * 同步 ERP 库存到 CRM
   * @param productIds 产品 ID 列表（可选，不传则同步全部）
   */
  async syncInventoryToCrm(productIds?: string[]) {
    this.logger.log('开始同步库存到 CRM');

    try {
      // 1. 获取 ERP 库存数据
      const inventoryList = await this.erpNetService.getInventoryList(productIds);
      this.logger.log(`获取到 ${inventoryList.length} 个产品的库存数据`);

      // 2. 批量更新 CRM 产品库存
      const updatePromises = inventoryList.map(async (item: any) => {
        const crmProduct = await this.crmService.getProductBySku(item.sku);
        if (crmProduct) {
          return this.crmService.updateProductInventory(crmProduct.id, {
            stockQuantity: item.stockQuantity,
            availableQuantity: item.availableQuantity,
            reservedQuantity: item.reservedQuantity,
            warehouseLocations: item.warehouseLocations,
            lastUpdateTime: new Date(),
          });
        }
      });

      await Promise.all(updatePromises);
      this.logger.log('库存同步完成');

      return {
        success: true,
        syncedCount: inventoryList.length,
        message: '库存数据已同步到 CRM',
      };
    } catch (error) {
      this.logger.error(`库存同步失败：${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 实时库存同步（Webhook 触发）
   */
  async realTimeInventorySync(data: any) {
    this.logger.log(`实时库存同步：${data.sku}`);

    try {
      const crmProduct = await this.crmService.getProductBySku(data.sku);
      if (crmProduct) {
        await this.crmService.updateProductInventory(crmProduct.id, {
          stockQuantity: data.stockQuantity,
          availableQuantity: data.availableQuantity,
          lastUpdateTime: new Date(),
        });

        // 库存预警
        if (data.availableQuantity < data.safetyStock) {
          await this.sendInventoryAlert(crmProduct.id, data);
        }
      }
    } catch (error) {
      this.logger.error(`实时库存同步失败：${error.message}`);
    }
  }

  // ========== ERP → CRM 价格同步 ==========

  /**
   * 同步 ERP 价格到 CRM
   * @param productIds 产品 ID 列表
   */
  async syncPriceToCrm(productIds?: string[]) {
    this.logger.log('开始同步价格到 CRM');

    try {
      // 1. 获取 ERP 价格数据
      const priceList = await this.erpNetService.getPriceList(productIds);
      this.logger.log(`获取到 ${priceList.length} 个产品的价格数据`);

      // 2. 批量更新 CRM 产品价格
      const updatePromises = priceList.map(async (item: any) => {
        const crmProduct = await this.crmService.getProductBySku(item.sku);
        if (crmProduct) {
          return this.crmService.updateProductPrice(crmProduct.id, {
            basePrice: item.basePrice,
            salePrice: item.salePrice,
            vipPrice: item.vipPrice,
            wholesalePrice: item.wholesalePrice,
            currency: item.currency || 'CNY',
            priceEffectiveDate: item.effectiveDate,
            priceExpiryDate: item.expiryDate,
          });
        }
      });

      await Promise.all(updatePromises);
      this.logger.log('价格同步完成');

      return {
        success: true,
        syncedCount: priceList.length,
        message: '价格数据已同步到 CRM',
      };
    } catch (error) {
      this.logger.error(`价格同步失败：${error.message}`, error.stack);
      throw error;
    }
  }

  // ========== CRM ↔ ERP 客户数据同步 ==========

  /**
   * CRM 客户同步到 ERP
   */
  async syncCustomerToErp(customerId: string) {
    this.logger.log(`同步客户 ${customerId} 到 ERP`);

    try {
      // 1. 获取 CRM 客户详情
      const customer = await this.crmService.getCustomer(customerId);
      if (!customer) {
        throw new HttpException('客户不存在', HttpStatus.NOT_FOUND);
      }

      // 2. 检查 ERP 是否已存在
      const existingErpCustomer = await this.erpNetService.getCustomerByCode(customer.code);
      if (existingErpCustomer) {
        // 更新
        await this.erpNetService.updateCustomer(existingErpCustomer.id, {
          ...customer,
          crmCustomerId: customerId,
        });
      } else {
        // 创建
        await this.erpNetService.createCustomer({
          ...customer,
          crmCustomerId: customerId,
        });
      }

      this.logger.log(`客户 ${customerId} 已同步到 ERP`);

      return {
        success: true,
        customerId,
        message: '客户数据已同步到 ERP',
      };
    } catch (error) {
      this.logger.error(`客户同步失败：${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * ERP 客户付款同步到 CRM
   */
  async syncPaymentToCrm(data: any) {
    this.logger.log(`同步付款记录到 CRM：${data.orderNo}`);

    try {
      // 1. 查找 CRM 订单
      const crmOrder = await this.crmService.getOrderByErpOrderNo(data.orderNo);
      if (!crmOrder) {
        this.logger.warn(`CRM 中未找到订单 ${data.orderNo}`);
        return;
      }

      // 2. 创建 CRM 收款记录
      await this.crmService.createPaymentRecord({
        orderId: crmOrder.id,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        transactionNo: data.transactionNo,
        remark: data.remark,
      });

      // 3. 更新订单状态
      await this.crmService.updateOrderStatus(crmOrder.id, {
        paymentStatus: 'paid',
        paidAmount: data.paidAmount,
        balanceAmount: data.balanceAmount,
      });

      this.logger.log(`付款记录已同步到 CRM`);
    } catch (error) {
      this.logger.error(`付款同步失败：${error.message}`);
    }
  }

  // ========== 辅助方法 ==========

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `SO${year}${month}${day}${random}`;
  }

  /**
   * 发送通知
   */
  private async sendNotification(type: string, data: any) {
    // TODO: 实现通知发送（邮件/短信/站内信）
    this.logger.log(`发送通知：${type}`, data);
  }

  /**
   * 库存预警
   */
  private async sendInventoryAlert(productId: string, inventory: any) {
    this.logger.warn(`库存预警：产品 ${productId} 库存不足`);
    // TODO: 发送预警通知给采购/销售
  }
}
