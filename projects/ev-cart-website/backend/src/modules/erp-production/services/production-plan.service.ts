import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionOrder } from '../entities/production-order.entity';

/**
 * 生产计划服务
 */
@Injectable()
export class ProductionPlanService {
  private readonly logger = new Logger(ProductionPlanService.name);

  constructor(
    @InjectRepository(ProductionOrder)
    private productionOrderRepository: Repository<ProductionOrder>,
  ) {}

  // ========== 生产计划 ==========

  /**
   * 创建生产计划
   */
  async createProductionPlan(data: CreateProductionPlanDto): Promise<ProductionOrder> {
    this.logger.log(`创建生产计划：${data.orderNo}`);

    const productionOrder = this.productionOrderRepository.create({
      ...data,
      status: 'planned',
    });

    await this.productionOrderRepository.save(productionOrder);

    this.logger.log(`生产计划创建成功：${productionOrder.orderNo}`);

    return productionOrder;
  }

  /**
   * 下达生产工单
   */
  async releaseProductionOrder(orderId: string): Promise<ProductionOrder> {
    this.logger.log(`下达生产工单：${orderId}`);

    const order = await this.productionOrderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('生产工单不存在');
    }

    order.status = 'released';
    order.actualStartDate = new Date();

    await this.productionOrderRepository.save(order);

    this.logger.log(`生产工单已下达：${order.orderNo}`);

    return order;
  }

  /**
   * 更新生产进度
   */
  async updateProductionProgress(orderId: string, data: UpdateProgressDto): Promise<ProductionOrder> {
    this.logger.log(`更新生产进度：${orderId}`);

    const order = await this.productionOrderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('生产工单不存在');
    }

    if (data.completedQuantity !== undefined) {
      order.completedQuantity = data.completedQuantity;
    }

    if (data.defectiveQuantity !== undefined) {
      order.defectiveQuantity = data.defectiveQuantity;
    }

    if (data.status !== undefined) {
      order.status = data.status;
      
      if (data.status === 'completed') {
        order.actualEndDate = new Date();
      }
    }

    await this.productionOrderRepository.save(order);

    this.logger.log(`生产进度更新成功：${order.orderNo}`);

    return order;
  }

  // ========== 生产统计 ==========

  /**
   * 获取生产统计
   */
  async getStatistics(period: string): Promise<ProductionStatistics> {
    const queryBuilder = this.productionOrderRepository.createQueryBuilder('order');

    if (period) {
      // 按期间过滤
      const [startDate, endDate] = this.getPeriodRange(period);
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const total = await queryBuilder.getCount();

    const statusCount = await queryBuilder
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const quantityStats = await queryBuilder
      .select('SUM(order.quantity)', 'totalQuantity')
      .addSelect('SUM(order.completedQuantity)', 'completedQuantity')
      .addSelect('SUM(order.defectiveQuantity)', 'defectiveQuantity')
      .getRawOne();

    return {
      total,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      totalQuantity: parseInt(quantityStats.totalQuantity) || 0,
      completedQuantity: parseInt(quantityStats.completedQuantity) || 0,
      defectiveQuantity: parseInt(quantityStats.defectiveQuantity) || 0,
      qualityRate: 0,
    };
  }

  // ========== 辅助方法 ==========

  private getPeriodRange(period: string): [Date, Date] {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return [startDate, endDate];
  }
}

// ========== 类型定义 ==========

interface CreateProductionPlanDto {
  orderNo: string;
  salesOrderId?: string;
  salesOrderNo?: string;
  productId: string;
  productName: string;
  productModel?: string;
  quantity: number;
  planStartDate?: Date;
  planEndDate?: Date;
  workshopId?: string;
  workshopName?: string;
  lineId?: string;
  lineName?: string;
  supervisorId?: string;
  supervisorName?: string;
  notes?: string;
}

interface UpdateProgressDto {
  completedQuantity?: number;
  defectiveQuantity?: number;
  status?: string;
}

interface ProductionStatistics {
  total: number;
  statusCount: Record<string, number>;
  totalQuantity: number;
  completedQuantity: number;
  defectiveQuantity: number;
  qualityRate: number;
}
