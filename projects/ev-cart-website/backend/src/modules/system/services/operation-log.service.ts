import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationLog } from '../entities/operation-log.entity';

/**
 * 操作日志服务
 */
@Injectable()
export class OperationLogService {
  private readonly logger = new Logger(OperationLogService.name);

  constructor(
    @InjectRepository(OperationLog)
    private logRepository: Repository<OperationLog>,
  ) {}

  /**
   * 记录操作日志
   */
  async log(data: CreateOperationLogDto): Promise<OperationLog> {
    const log = this.logRepository.create(data);
    await this.logRepository.save(log);
    return log;
  }

  /**
   * 获取操作日志列表
   */
  async getLogs(query: OperationLogQuery): Promise<OperationLogResult> {
    const {
      page = 1,
      limit = 20,
      userId,
      module,
      action,
      status,
      startDate,
      endDate,
      keyword,
    } = query;

    const queryBuilder = this.logRepository.createQueryBuilder('log');

    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (module) {
      queryBuilder.andWhere('log.module = :module', { module });
    }

    if (action) {
      queryBuilder.andWhere('log.action = :action', { action });
    }

    if (status) {
      queryBuilder.andWhere('log.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(log.userName LIKE :keyword OR log.actionName LIKE :keyword OR log.targetName LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [items, total] = await queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取用户操作统计
   */
  async getUserStatistics(userId?: string, days: number = 30): Promise<UserOperationStatistics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const queryBuilder = this.logRepository.createQueryBuilder('log');
    queryBuilder.where('log.createdAt >= :startDate', { startDate });

    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    const total = await queryBuilder.getCount();

    const actionCount = await queryBuilder
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.action')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const moduleCount = await queryBuilder
      .select('log.module', 'module')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.module')
      .orderBy('count', 'DESC')
      .getRawMany();

    const statusCount = await queryBuilder
      .select('log.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.status')
      .getRawMany();

    const avgDuration = await queryBuilder
      .select('AVG(log.duration)', 'avg')
      .getRawOne();

    return {
      total,
      actionCount: actionCount.reduce((acc, item) => {
        acc[item.action] = parseInt(item.count);
        return acc;
      }, {}),
      moduleCount: moduleCount.reduce((acc, item) => {
        acc[item.module] = parseInt(item.count);
        return acc;
      }, {}),
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      avgDuration: parseFloat(avgDuration.avg) || 0,
    };
  }

  /**
   * 获取热门操作
   */
  async getPopularActions(limit: number = 10): Promise<PopularAction[]> {
    return this.logRepository
      .createQueryBuilder('log')
      .select('log.module', 'module')
      .addSelect('log.action', 'action')
      .addSelect('log.actionName', 'actionName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.module')
      .addGroupBy('log.action')
      .addGroupBy('log.actionName')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /**
   * 清理过期日志
   */
  async cleanupOldLogs(days: number = 180): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.logRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`清理过期日志：${result.affected}条`);
  }
}

// ========== 类型定义 ==========

interface CreateOperationLogDto {
  userId: string;
  userName: string;
  userDepartment?: string;
  module: string;
  action: string;
  actionName: string;
  status?: 'success' | 'failed' | 'error';
  targetId?: string;
  targetName?: string;
  targetType?: string;
  requestUrl?: string;
  requestMethod?: string;
  requestBody?: any;
  responseData?: any;
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
  device?: string;
  duration?: number;
  errorMessage?: string;
  remark?: string;
}

interface OperationLogQuery {
  page?: number;
  limit?: number;
  userId?: string;
  module?: string;
  action?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  keyword?: string;
}

interface OperationLogResult {
  items: OperationLog[];
  total: number;
  page: number;
  limit: number;
}

interface UserOperationStatistics {
  total: number;
  actionCount: Record<string, number>;
  moduleCount: Record<string, number>;
  statusCount: Record<string, number>;
  avgDuration: number;
}

interface PopularAction {
  module: string;
  action: string;
  actionName: string;
  count: number;
}
