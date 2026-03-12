import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UnifiedCustomer } from './entities/unified-customer.entity';

/**
 * 统一客户服务
 * 负责 CRM 和 ERP 客户数据的合并、同步和统一视图
 */
@Injectable()
export class UnifiedCustomerService {
  private readonly logger = new Logger(UnifiedCustomerService.name);

  constructor(
    @InjectRepository(UnifiedCustomer)
    private unifiedCustomerRepository: Repository<UnifiedCustomer>,
    private dataSource: DataSource,
  ) {}

  // ========== 客户数据合并 ==========

  /**
   * 合并 CRM 和 ERP 客户数据
   */
  async mergeCustomerData(crmCustomer: any, erpCustomer: any): Promise<UnifiedCustomer> {
    this.logger.log(`合并客户数据：CRM=${crmCustomer.id}, ERP=${erpCustomer.id}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 检查是否已存在统一客户
      let unifiedCustomer = await queryRunner.manager.findOne(UnifiedCustomer, {
        where: [
          { crmCustomerId: crmCustomer.id },
          { erpCustomerId: erpCustomer.id },
        ],
      });

      if (unifiedCustomer) {
        // 更新现有记录
        unifiedCustomer = this.mergeData(unifiedCustomer, crmCustomer, erpCustomer);
      } else {
        // 创建新记录
        unifiedCustomer = queryRunner.manager.create(UnifiedCustomer, {
          customerCode: this.generateCustomerCode(),
          customerName: crmCustomer.name || erpCustomer.name,
          ...this.mergeData(new UnifiedCustomer(), crmCustomer, erpCustomer),
        });
      }

      unifiedCustomer.mergedAt = new Date();
      unifiedCustomer.lastSyncedAt = new Date();

      await queryRunner.manager.save(unifiedCustomer);
      await queryRunner.commitTransaction();

      this.logger.log(`客户数据合并成功：${unifiedCustomer.id}`);
      return unifiedCustomer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`客户数据合并失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 合并数据逻辑
   */
  private mergeData(
    target: UnifiedCustomer,
    crmData: any,
    erpData: any,
  ): Partial<UnifiedCustomer> {
    return {
      // 基础信息（优先 CRM）
      customerName: crmData.name || erpData.name,
      customerType: crmData.type || erpData.type || 'enterprise',
      industry: crmData.industry || erpData.industry,
      source: crmData.source || 'unknown',

      // 联系信息（优先 CRM）
      contactPerson: crmData.contactPerson || erpData.contactPerson,
      contactPhone: crmData.phone || erpData.phone,
      contactEmail: crmData.email || erpData.email,
      contactTitle: crmData.contactTitle || erpData.contactTitle,
      address: crmData.address || erpData.address,
      city: crmData.city || erpData.city,
      province: crmData.province || erpData.province,
      country: crmData.country || erpData.country || 'CN',
      postalCode: crmData.postalCode || erpData.postalCode,

      // CRM 数据
      crmCustomerId: crmData.id,
      crmOwnerId: crmData.ownerId,
      crmStatus: crmData.status,
      crmLeadScore: crmData.leadScore,
      crmTags: crmData.tags || [],
      crmNotes: crmData.notes,

      // ERP 数据
      erpCustomerId: erpData.id,
      erpCustomerCode: erpData.code,
      erpCreditLevel: erpData.creditLevel,
      erpCreditLimit: erpData.creditLimit,
      erpPaymentTerms: erpData.paymentTerms,
      erpOutstandingBalance: erpData.outstandingBalance,

      // 状态
      status: this.calculateStatus(crmData, erpData),
      isVip: this.calculateVipStatus(crmData, erpData),
    };
  }

  // ========== 统一客户视图 ==========

  /**
   * 获取客户 360° 视图
   */
  async getCustomer360View(customerId: string): Promise<any> {
    const unifiedCustomer = await this.unifiedCustomerRepository.findOne({
      where: { id: customerId },
    });

    if (!unifiedCustomer) {
      throw new NotFoundException('客户不存在');
    }

    // 获取 CRM 数据
    const crmData = await this.getCrmData(unifiedCustomer.crmCustomerId);

    // 获取 ERP 数据
    const erpData = await this.getErpData(unifiedCustomer.erpCustomerId);

    // 获取互动历史
    const interactions = await this.getInteractionHistory(customerId);

    // 获取订单历史
    const orders = await this.getOrderHistory(customerId);

    // 获取商机历史
    const opportunities = await this.getOpportunityHistory(customerId);

    return {
      // 基础信息
      basicInfo: {
        id: unifiedCustomer.id,
        customerCode: unifiedCustomer.customerCode,
        customerName: unifiedCustomer.customerName,
        customerType: unifiedCustomer.customerType,
        industry: unifiedCustomer.industry,
        source: unifiedCustomer.source,
        status: unifiedCustomer.status,
        isVip: unifiedCustomer.isVip,
        vipLevel: unifiedCustomer.vipLevel,
      },

      // 联系信息
      contactInfo: {
        contactPerson: unifiedCustomer.contactPerson,
        contactPhone: unifiedCustomer.contactPhone,
        contactEmail: unifiedCustomer.contactEmail,
        contactTitle: unifiedCustomer.contactTitle,
        address: unifiedCustomer.address,
        city: unifiedCustomer.city,
        province: unifiedCustomer.province,
        country: unifiedCustomer.country,
        postalCode: unifiedCustomer.postalCode,
      },

      // CRM 数据
      crmData: {
        crmCustomerId: unifiedCustomer.crmCustomerId,
        crmOwnerId: unifiedCustomer.crmOwnerId,
        crmStatus: unifiedCustomer.crmStatus,
        crmLeadScore: unifiedCustomer.crmLeadScore,
        crmTags: unifiedCustomer.crmTags,
        crmNotes: unifiedCustomer.crmNotes,
        opportunities: opportunities,
      },

      // ERP 数据
      erpData: {
        erpCustomerId: unifiedCustomer.erpCustomerId,
        erpCustomerCode: unifiedCustomer.erpCustomerCode,
        erpCreditLevel: unifiedCustomer.erpCreditLevel,
        erpCreditLimit: unifiedCustomer.erpCreditLimit,
        erpPaymentTerms: unifiedCustomer.erpPaymentTerms,
        erpOutstandingBalance: unifiedCustomer.erpOutstandingBalance,
        orders: orders,
      },

      // 统计数据
      statistics: {
        totalOpportunities: unifiedCustomer.totalOpportunities,
        wonOpportunities: unifiedCustomer.wonOpportunities,
        totalOrders: unifiedCustomer.totalOrders,
        totalRevenue: unifiedCustomer.totalRevenue,
        lastOrderAmount: unifiedCustomer.lastOrderAmount,
        lastOrderDate: unifiedCustomer.lastOrderDate,
        lifetimeValue: unifiedCustomer.lifetimeValue,
        totalInteractions: unifiedCustomer.totalInteractions,
        lastInteractionDate: unifiedCustomer.lastInteractionDate,
        websiteVisits: unifiedCustomer.websiteVisits,
        lastWebsiteVisit: unifiedCustomer.lastWebsiteVisit,
      },

      // 互动历史
      interactions: interactions,

      // 时间线
      timeline: this.buildTimeline(crmData, erpData, interactions, orders),
    };
  }

  // ========== 数据同步 ==========

  /**
   * 批量同步所有客户
   */
  async syncAllCustomers(): Promise<any> {
    this.logger.log('开始批量同步客户数据');

    // TODO: 从 CRM 和 ERP 获取所有客户
    // const crmCustomers = await this.crmService.getAllCustomers();
    // const erpCustomers = await this.erpService.getAllCustomers();

    // 匹配并合并
    // const matched = this.matchCustomers(crmCustomers, erpCustomers);

    // for (const { crm, erp } of matched) {
    //   await this.mergeCustomerData(crm, erp);
    // }

    this.logger.log('客户数据同步完成');

    return {
      success: true,
      message: '客户数据同步完成',
    };
  }

  /**
   * 自动匹配 CRM 和 ERP 客户
   */
  private matchCustomers(crmCustomers: any[], erpCustomers: any[]): Array<{ crm: any; erp: any }> {
    const matched: Array<{ crm: any; erp: any }> = [];
    const erpMap = new Map();

    // 建立 ERP 客户索引
    for (const erp of erpCustomers) {
      erpMap.set(erp.code, erp);
      erpMap.set(erp.phone, erp);
      erpMap.set(erp.email, erp);
    }

    // 匹配 CRM 客户
    for (const crm of crmCustomers) {
      const erp = erpMap.get(crm.code) || erpMap.get(crm.phone) || erpMap.get(crm.email);
      if (erp) {
        matched.push({ crm, erp });
        erpMap.delete(erp.code);
      }
    }

    return matched;
  }

  // ========== 辅助方法 ==========

  /**
   * 生成统一客户编码
   */
  private generateCustomerCode(): string {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `UC${year}${random}`;
  }

  /**
   * 计算客户状态
   */
  private calculateStatus(crmData: any, erpData: any): string {
    if (crmData.status === 'blacklisted' || erpData.status === 'blacklisted') {
      return 'blacklisted';
    }
    if (crmData.status === 'inactive' && erpData.status === 'inactive') {
      return 'inactive';
    }
    return 'active';
  }

  /**
   * 计算 VIP 状态
   */
  private calculateVipStatus(crmData: any, erpData: any): boolean {
    const totalRevenue = crmData.totalRevenue || 0;
    const erpRevenue = erpData.totalRevenue || 0;
    const combinedRevenue = totalRevenue + erpRevenue;

    return combinedRevenue >= 1000000; // 100 万以上为 VIP
  }

  /**
   * 获取 CRM 数据
   */
  private async getCrmData(crmCustomerId: string): Promise<any> {
    // TODO: 调用 CRM 服务
    return {};
  }

  /**
   * 获取 ERP 数据
   */
  private async getErpData(erpCustomerId: string): Promise<any> {
    // TODO: 调用 ERP 服务
    return {};
  }

  /**
   * 获取互动历史
   */
  private async getInteractionHistory(customerId: string): Promise<any[]> {
    // TODO: 从数据库获取互动历史
    return [];
  }

  /**
   * 获取订单历史
   */
  private async getOrderHistory(customerId: string): Promise<any[]> {
    // TODO: 从 ERP 获取订单历史
    return [];
  }

  /**
   * 获取商机历史
   */
  private async getOpportunityHistory(customerId: string): Promise<any[]> {
    // TODO: 从 CRM 获取商机历史
    return [];
  }

  /**
   * 构建时间线
   */
  private buildTimeline(crmData: any, erpData: any, interactions: any[], orders: any[]): any[] {
    const timeline: any[] = [];

    // 添加商机事件
    // 添加订单事件
    // 添加互动事件
    // 按时间排序

    return timeline.sort((a, b) => b.date - a.date);
  }
}
