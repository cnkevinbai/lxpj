import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

/**
 * 操作审计日志服务
 * 记录所有敏感操作，防止数据泄露
 */
@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  // 敏感操作类型
  private readonly sensitiveActions = [
    'export_data',
    'delete_customer',
    'transfer_customer',
    'bulk_update',
    'bulk_delete',
    'change_owner',
    'view_sensitive',
    'download_report',
    'print_customer',
    'share_customer',
  ];

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * 记录操作日志
   */
  async log(data: AuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      userId: data.userId,
      userName: data.userName,
      action: data.action,
      module: data.module,
      recordId: data.recordId,
      recordType: data.recordType,
      oldValue: data.oldValue,
      newValue: data.newValue,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      duration: data.duration,
      status: data.status,
      errorMessage: data.errorMessage,
    });

    await this.auditLogRepository.save(auditLog);

    // 检查敏感操作
    if (this.sensitiveActions.includes(data.action)) {
      this.logger.warn(`敏感操作：${data.userName} 执行了 ${data.action}`, {
        module: data.module,
        recordId: data.recordId,
      });

      // 发送告警通知
      await this.sendAlert(data);
    }

    return auditLog;
  }

  /**
   * 批量记录日志
   */
  async logBatch(logs: AuditLogDto[]): Promise<void> {
    const entities = logs.map((data) => this.auditLogRepository.create(data));
    await this.auditLogRepository.save(entities);
  }

  /**
   * 查询操作日志
   */
  async getLogs(query: LogQueryDto): Promise<LogResult> {
    const { userId, action, module, startDate, endDate, page = 1, limit = 20 } = query;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('log');

    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (action) {
      queryBuilder.andWhere('log.action = :action', { action });
    }

    if (module) {
      queryBuilder.andWhere('log.module = :module', { module });
    }

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
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
  async getUserStatistics(userId: string, days: number = 30): Promise<UserStatistics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.auditLogRepository.find({
      where: {
        userId,
        createdAt: startDate,
      },
    });

    const totalOperations = logs.length;
    const sensitiveOperations = logs.filter((log) => this.sensitiveActions.includes(log.action))
      .length;
    const failedOperations = logs.filter((log) => log.status === 'failed').length;

    const actionCount = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOperations,
      sensitiveOperations,
      failedOperations,
      actionCount,
      averagePerDay: Math.round(totalOperations / days),
    };
  }

  /**
   * 检测异常行为
   */
  async detectAbnormalBehavior(userId: string): Promise<AbnormalBehavior[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogs = await this.auditLogRepository.find({
      where: { userId, createdAt: today },
    });

    const abnormalities: AbnormalBehavior[] = [];

    // 1. 大量导出数据
    const exportLogs = todayLogs.filter((log) => log.action === 'export_data');
    const totalExported = exportLogs.reduce((sum, log) => sum + (log.recordCount || 0), 0);
    if (totalExported > 500) {
      abnormalities.push({
        type: 'mass_export',
        description: `今日导出数据${totalExported}条，超过阈值`,
        level: 'high',
      });
    }

    // 2. 非工作时间操作
    const afterHoursLogs = todayLogs.filter((log) => {
      const hour = new Date(log.createdAt).getHours();
      return hour < 8 || hour > 20;
    });
    if (afterHoursLogs.length > 5) {
      abnormalities.push({
        type: 'after_hours_operation',
        description: `非工作时间操作${afterHoursLogs.length}次`,
        level: 'medium',
      });
    }

    // 3. 频繁查看敏感数据
    const viewSensitiveLogs = todayLogs.filter((log) => log.action === 'view_sensitive');
    if (viewSensitiveLogs.length > 50) {
      abnormalities.push({
        type: 'frequent_sensitive_view',
        description: `频繁查看敏感数据${viewSensitiveLogs.length}次`,
        level: 'high',
      });
    }

    // 4. 批量删除/转移客户
    const bulkOperations = todayLogs.filter(
      (log) => log.action === 'bulk_delete' || log.action === 'transfer_customer',
    );
    if (bulkOperations.length > 3) {
      abnormalities.push({
        type: 'bulk_operation',
        description: `批量操作${bulkOperations.length}次`,
        level: 'critical',
      });
    }

    return abnormalities;
  }

  /**
   * 发送告警通知
   */
  private async sendAlert(data: AuditLogDto): Promise<void> {
    // TODO: 实现告警通知（邮件/短信/钉钉）
    this.logger.warn(`发送告警：${data.action}`, data);
  }
}

// ========== 类型定义 ==========

interface AuditLogDto {
  userId: string;
  userName: string;
  action: string;
  module: string;
  recordId?: string;
  recordType?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  status: 'success' | 'failed' | 'blocked';
  errorMessage?: string;
}

interface LogQueryDto {
  userId?: string;
  action?: string;
  module?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

interface LogResult {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

interface UserStatistics {
  totalOperations: number;
  sensitiveOperations: number;
  failedOperations: number;
  actionCount: Record<string, number>;
  averagePerDay: number;
}

interface AbnormalBehavior {
  type: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
}
