import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { ServiceOrderItem } from './entities/service-order-item.entity';
import { ServiceFeedback } from './entities/service-feedback.entity';

/**
 * 售后服务服务
 * 完整的售后服务流程管理
 */
@Injectable()
export class AfterSalesService {
  private readonly logger = new Logger(AfterSalesService.name);

  constructor(
    @InjectRepository(ServiceOrder)
    private serviceOrderRepository: Repository<ServiceOrder>,
    @InjectRepository(ServiceOrderItem)
    private serviceItemRepository: Repository<ServiceOrderItem>,
    @InjectRepository(ServiceFeedback)
    private feedbackRepository: Repository<ServiceFeedback>,
    private dataSource: DataSource,
  ) {}

  // ========== 创建服务单 ==========

  /**
   * 创建售后服务单
   */
  async createServiceOrder(data: CreateServiceOrderDto): Promise<ServiceOrder> {
    this.logger.log(`创建服务单：${data.customerName}, ${data.serviceType}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 生成服务单号
      const orderNo = await this.generateServiceOrderNo();

      // 2. 创建服务单
      const serviceOrder = queryRunner.manager.create(ServiceOrder, {
        orderNo,
        ...data,
        status: 'pending',
      });

      await queryRunner.manager.save(serviceOrder);

      // 3. 如果是投诉，自动升级服务级别
      if (data.serviceType === 'complaint') {
        serviceOrder.serviceLevel = 'urgent';
        await queryRunner.manager.save(serviceOrder);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`服务单创建成功：${orderNo}`);

      // 4. 发送通知（异步）
      await this.sendNotification(serviceOrder, 'created');

      return serviceOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`创建服务单失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 派单 ==========

  /**
   * 指派工程师
   */
  async assignEngineer(serviceOrderId: string, engineerId: string, engineerName: string): Promise<ServiceOrder> {
    this.logger.log(`指派服务单：${serviceOrderId}, 工程师：${engineerName}`);

    const serviceOrder = await this.serviceOrderRepository.findOne({ where: { id: serviceOrderId } });
    if (!serviceOrder) {
      throw new Error('服务单不存在');
    }

    serviceOrder.assignedEngineerId = engineerId;
    serviceOrder.assignedEngineerName = engineerName;
    serviceOrder.status = 'assigned';

    await this.serviceOrderRepository.save(serviceOrder);

    // 发送通知给工程师
    await this.sendNotification(serviceOrder, 'assigned', engineerId);

    return serviceOrder;
  }

  // ========== 服务进度更新 ==========

  /**
   * 更新服务状态
   */
  async updateServiceStatus(serviceOrderId: string, status: ServiceOrder['status'], note?: string): Promise<ServiceOrder> {
    this.logger.log(`更新服务状态：${serviceOrderId}, ${status}`);

    const serviceOrder = await this.serviceOrderRepository.findOne({ where: { id: serviceOrderId } });
    if (!serviceOrder) {
      throw new Error('服务单不存在');
    }

    const oldStatus = serviceOrder.status;
    serviceOrder.status = status;

    // 根据状态设置时间
    if (status === 'accepted' && !serviceOrder.acceptedAt) {
      serviceOrder.acceptedAt = new Date();
    } else if (status === 'processing' && !serviceOrder.arrivedAt) {
      serviceOrder.arrivedAt = new Date();
    } else if (status === 'completed' && !serviceOrder.completedAt) {
      serviceOrder.completedAt = new Date();
    } else if (status === 'confirmed' && !serviceOrder.confirmedAt) {
      serviceOrder.confirmedAt = new Date();
    } else if (status === 'closed' && !serviceOrder.closedAt) {
      serviceOrder.closedAt = new Date();
    }

    if (note) {
      serviceOrder.internalNote = note;
    }

    await this.serviceOrderRepository.save(serviceOrder);

    // 发送状态变更通知
    await this.sendNotification(serviceOrder, 'status_changed', null, { oldStatus, newStatus: status });

    return serviceOrder;
  }

  // ========== 服务完成 ==========

  /**
   * 完成服务
   */
  async completeService(serviceOrderId: string, data: CompleteServiceDto): Promise<ServiceOrder> {
    this.logger.log(`完成服务：${serviceOrderId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const serviceOrder = await this.serviceOrderRepository.findOne({ where: { id: serviceOrderId } });
      if (!serviceOrder) {
        throw new Error('服务单不存在');
      }

      // 更新服务单
      serviceOrder.status = 'completed';
      serviceOrder.completedAt = new Date();
      serviceOrder.faultCause = data.faultCause;
      serviceOrder.solution = data.solution;
      serviceOrder.replacedParts = data.replacedParts;
      serviceOrder.laborCost = data.laborCost;
      serviceOrder.partsCost = data.partsCost;
      serviceOrder.travelCost = data.travelCost;
      serviceOrder.totalCost = data.laborCost + data.partsCost + data.travelCost;

      await this.serviceOrderRepository.save(serviceOrder);

      // 创建服务项
      if (data.items && data.items.length > 0) {
        const items = data.items.map(itemData => 
          this.serviceItemRepository.create({
            serviceOrderId: serviceOrder.id,
            ...itemData,
            status: 'completed',
            completedAt: new Date(),
          })
        );
        await this.serviceItemRepository.save(items);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`服务完成：${serviceOrder.orderNo}`);

      // 发送完成通知
      await this.sendNotification(serviceOrder, 'completed');

      return serviceOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`完成服务失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 客户评价 ==========

  /**
   * 提交服务评价
   */
  async submitFeedback(data: SubmitFeedbackDto): Promise<ServiceFeedback> {
    this.logger.log(`提交服务评价：${data.serviceOrderId}`);

    const feedback = this.feedbackRepository.create({
      ...data,
      status: 'pending',
    });

    await this.feedbackRepository.save(feedback);

    // 更新服务单满意度
    const serviceOrder = await this.serviceOrderRepository.findOne({ where: { id: data.serviceOrderId } });
    if (serviceOrder) {
      serviceOrder.satisfactionScore = data.satisfactionScore;
      serviceOrder.satisfactionComment = data.comment;
      serviceOrder.feedbackAt = new Date();
      await this.serviceOrderRepository.save(serviceOrder);
    }

    this.logger.log(`服务评价提交成功：${feedback.id}`);

    return feedback;
  }

  // ========== 数据统计 ==========

  /**
   * 获取服务统计
   */
  async getStatistics(engineerId?: string): Promise<ServiceStatistics> {
    const queryBuilder = this.serviceOrderRepository.createQueryBuilder('order');
    
    if (engineerId) {
      queryBuilder.andWhere('order.assignedEngineerId = :engineerId', { engineerId });
    }

    const total = await queryBuilder.getCount();
    
    const statusCount = await queryBuilder
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const todayCount = await queryBuilder
      .andWhere('DATE(order.createdAt) = :today', { today: new Date().toISOString().split('T')[0] })
      .getCount();

    const avgSatisfaction = await queryBuilder
      .select('AVG(order.satisfactionScore)', 'avg')
      .where('order.satisfactionScore IS NOT NULL')
      .getRawOne();

    return {
      total,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      todayCount,
      avgSatisfaction: parseFloat(avgSatisfaction.avg) || 0,
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 生成服务单号
   */
  private async generateServiceOrderNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // 获取今日序号
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await this.serviceOrderRepository.count({
      where: {
        createdAt: today,
      },
    });
    
    const sequence = String(todayCount + 1).padStart(4, '0');
    
    return `SV${year}${month}${day}${sequence}`;
  }

  /**
   * 发送通知
   */
  private async sendNotification(
    serviceOrder: ServiceOrder, 
    event: string, 
    targetUserId?: string,
    extra?: any
  ): Promise<void> {
    this.logger.log(`发送服务通知：${serviceOrder.orderNo}, ${event}`);
    
    // TODO: 实现通知发送（APP 推送/短信/微信）
  }
}

// ========== 类型定义 ==========

interface CreateServiceOrderDto {
  source: 'website' | 'app' | 'phone' | 'wechat' | 'email';
  customerId: string;
  customerName: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  salesOrderId?: string;
  salesOrderNo?: string;
  productId?: string;
  productName?: string;
  productModel?: string;
  productSerialNo?: string;
  purchaseDate?: Date;
  warrantyEndDate?: Date;
  serviceType: 'repair' | 'maintenance' | 'installation' | 'training' | 'consultation' | 'complaint';
  serviceLevel?: 'normal' | 'urgent' | 'critical';
  serviceRequest: string;
  faultDescription?: string;
  faultImages?: string[];
  appointmentTime?: Date;
}

interface CompleteServiceDto {
  faultCause: string;
  solution: string;
  replacedParts?: string[];
  laborCost: number;
  partsCost: number;
  travelCost: number;
  items?: Array<{
    itemName: string;
    itemType: string;
    description?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
}

interface SubmitFeedbackDto {
  serviceOrderId: string;
  customerId: string;
  customerName: string;
  feedbackType: 'satisfaction' | 'complaint' | 'suggestion' | 'praise';
  satisfactionScore?: number;
  serviceAttitude?: number;
  serviceQuality?: number;
  responseSpeed?: number;
  technicalLevel?: number;
  comment?: string;
  images?: string[];
}

interface ServiceStatistics {
  total: number;
  statusCount: Record<string, number>;
  todayCount: number;
  avgSatisfaction: number;
}
