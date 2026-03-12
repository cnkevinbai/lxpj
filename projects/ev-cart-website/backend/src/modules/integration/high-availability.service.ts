import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IntegrationService } from '../integration/integration.service';

/**
 * 高可用服务
 * 负责数据同步监控、故障恢复、健康检查
 */
@Injectable()
export class HighAvailabilityService implements OnModuleInit {
  private readonly logger = new Logger(HighAvailabilityService.name);
  private isHealthy = true;
  private lastHealthCheck = new Date();
  private syncQueue: Array<{ type: string; data: any; retry: number }> = [];

  constructor(
    private dataSource: DataSource,
    private integrationService: IntegrationService,
  ) {}

  async onModuleInit() {
    this.logger.log('高可用服务启动');
    
    // 启动健康检查
    this.startHealthCheck();
    
    // 处理重试队列
    this.processRetryQueue();
  }

  // ========== 健康检查 ==========

  /**
   * 定时健康检查
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async healthCheck(): Promise<HealthStatus> {
    const status: HealthStatus = {
      status: 'healthy',
      timestamp: new Date(),
      services: {},
    };

    try {
      // 检查数据库连接
      status.services.database = await this.checkDatabase();
      
      // 检查 CRM 服务
      status.services.crm = await this.checkCrmService();
      
      // 检查 ERP 服务
      status.services.erp = await this.checkErpService();
      
      // 检查 Redis
      status.services.redis = await this.checkRedis();

      // 总体状态
      const allHealthy = Object.values(status.services).every(s => s.status === 'healthy');
      status.status = allHealthy ? 'healthy' : 'degraded';
      
      this.isHealthy = allHealthy;
      this.lastHealthCheck = new Date();

      if (!allHealthy) {
        this.logger.warn('系统健康状态降级', status);
        await this.sendAlert('系统健康状态降级', status);
      }

      return status;
    } catch (error) {
      this.logger.error('健康检查失败', error);
      status.status = 'unhealthy';
      this.isHealthy = false;
      return status;
    }
  }

  /**
   * 检查数据库
   */
  private async checkDatabase(): Promise<ServiceStatus> {
    const startTime = Date.now();
    try {
      await this.dataSource.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        message: responseTime < 1000 ? '正常' : '响应慢',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: error.message,
      };
    }
  }

  /**
   * 检查 CRM 服务
   */
  private async checkCrmService(): Promise<ServiceStatus> {
    const startTime = Date.now();
    try {
      // TODO: 调用 CRM 健康检查 API
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        responseTime,
        message: '正常',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: error.message,
      };
    }
  }

  /**
   * 检查 ERP 服务
   */
  private async checkErpService(): Promise<ServiceStatus> {
    const startTime = Date.now();
    try {
      // TODO: 调用 ERP 健康检查 API
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        responseTime,
        message: '正常',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: error.message,
      };
    }
  }

  /**
   * 检查 Redis
   */
  private async checkRedis(): Promise<ServiceStatus> {
    const startTime = Date.now();
    try {
      // TODO: 检查 Redis 连接
      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        message: '正常',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: error.message,
      };
    }
  }

  // ========== 故障恢复 ==========

  /**
   * 处理重试队列
   */
  private async processRetryQueue() {
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      
      try {
        await this.executeSync(item.type, item.data);
        this.logger.log(`重试成功：${item.type}`);
      } catch (error) {
        this.logger.error(`重试失败：${item.type}`, error);
        
        if (item.retry < 3) {
          // 重新加入队列
          this.syncQueue.push({
            ...item,
            retry: item.retry + 1,
          });
        } else {
          // 超过最大重试次数，发送告警
          await this.sendAlert('同步失败，已达最大重试次数', {
            type: item.type,
            data: item.data,
          });
        }
      }
    }

    // 1 分钟后再次检查
    setTimeout(() => this.processRetryQueue(), 60000);
  }

  /**
   * 执行同步
   */
  private async executeSync(type: string, data: any) {
    switch (type) {
      case 'inventory_sync':
        await this.integrationService.syncInventoryToCrm(data.productIds);
        break;
      case 'price_sync':
        await this.integrationService.syncPriceToCrm(data.productIds);
        break;
      case 'customer_sync':
        await this.integrationService.syncCustomerToErp(data.customerId);
        break;
      default:
        this.logger.warn(`未知同步类型：${type}`);
    }
  }

  /**
   * 添加到重试队列
   */
  async addToRetryQueue(type: string, data: any) {
    this.syncQueue.push({
      type,
      data,
      retry: 0,
    });
    this.logger.log(`已加入重试队列：${type}`);
  }

  // ========== 定时同步 ==========

  /**
   * 每小时同步库存
   */
  @Cron(CronExpression.EVERY_HOUR)
  async scheduledInventorySync() {
    this.logger.log('定时同步库存');
    try {
      await this.integrationService.syncInventoryToCrm();
    } catch (error) {
      this.logger.error('库存同步失败', error);
      await this.addToRetryQueue('inventory_sync', {});
    }
  }

  /**
   * 每天凌晨 2 点同步价格
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduledPriceSync() {
    this.logger.log('定时同步价格');
    try {
      await this.integrationService.syncPriceToCrm();
    } catch (error) {
      this.logger.error('价格同步失败', error);
      await this.addToRetryQueue('price_sync', {});
    }
  }

  /**
   * 每 6 小时同步客户
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async scheduledCustomerSync() {
    this.logger.log('定时同步客户');
    try {
      // TODO: 实现客户同步
    } catch (error) {
      this.logger.error('客户同步失败', error);
    }
  }

  // ========== 告警通知 ==========

  /**
   * 发送告警
   */
  private async sendAlert(title: string, data: any) {
    this.logger.error(`告警：${title}`, data);
    
    // TODO: 发送邮件/短信/钉钉通知
    // await this.notificationService.send({
    //   to: ['admin@evcart.com'],
    //   subject: title,
    //   body: JSON.stringify(data, null, 2),
    // });
  }

  /**
   * 启动健康检查
   */
  private startHealthCheck() {
    setInterval(() => {
      this.healthCheck();
    }, 30000); // 每 30 秒检查一次
  }

  /**
   * 获取系统状态
   */
  async getSystemStatus(): Promise<SystemStatus> {
    return {
      isHealthy: this.isHealthy,
      lastHealthCheck: this.lastHealthCheck,
      queueLength: this.syncQueue.length,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}

// ========== 类型定义 ==========

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: ServiceStatus;
    crm: ServiceStatus;
    erp: ServiceStatus;
    redis: ServiceStatus;
  };
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  message: string;
}

interface SystemStatus {
  isHealthy: boolean;
  lastHealthCheck: Date;
  queueLength: number;
  uptime: number;
  memory: NodeJS.MemoryUsage;
}
