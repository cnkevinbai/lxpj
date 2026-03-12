import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExportLog } from './entities/export-log.entity';

/**
 * 数据导出限制服务
 * 防止数据恶意导出和泄露
 */
@Injectable()
export class DataExportLimitService {
  private readonly logger = new Logger(DataExportLimitService.name);

  // 导出限制配置
  private readonly limits = {
    // 每日导出数量限制
    dailyLimit: 1000,
    // 单次导出数量限制
    singleLimit: 100,
    // 敏感数据导出限制
    sensitiveDataLimit: 50,
    // 导出时间间隔（秒）
    exportInterval: 60,
  };

  constructor(
    @InjectRepository(ExportLog)
    private exportLogRepository: Repository<ExportLog>,
  ) {}

  /**
   * 检查导出权限
   */
  async checkExportPermission(userId: string, exportType: string, count: number): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. 检查今日导出总量
    const todayExports = await this.exportLogRepository.count({
      where: {
        userId,
        createdAt: today,
      },
    });

    if (todayExports + count > this.limits.dailyLimit) {
      this.logger.warn(`用户 ${userId} 今日导出已达上限：${todayExports}/${this.limits.dailyLimit}`);
      throw new ForbiddenException(`今日导出数量已达上限（${this.limits.dailyLimit}条）`);
    }

    // 2. 检查单次导出数量
    if (count > this.limits.singleLimit) {
      throw new ForbiddenException(`单次导出数量不能超过${this.limits.singleLimit}条`);
    }

    // 3. 检查导出时间间隔
    const lastExport = await this.exportLogRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (lastExport) {
      const timeDiff = Date.now() - lastExport.createdAt.getTime();
      if (timeDiff < this.limits.exportInterval * 1000) {
        const waitTime = Math.ceil((this.limits.exportInterval * 1000 - timeDiff) / 1000);
        throw new ForbiddenException(`导出过于频繁，请等待${waitTime}秒`);
      }
    }

    // 4. 检查敏感数据导出
    if (exportType === 'customer' || exportType === 'contact') {
      const todaySensitiveExports = await this.exportLogRepository.count({
        where: {
          userId,
          exportType: ['customer', 'contact'],
          createdAt: today,
        },
      });

      if (todaySensitiveExports + count > this.limits.sensitiveDataLimit) {
        throw new ForbiddenException(`敏感数据今日导出已达上限（${this.limits.sensitiveDataLimit}条）`);
      }
    }

    return true;
  }

  /**
   * 记录导出日志
   */
  async logExport(data: ExportLogDto): Promise<ExportLog> {
    const exportLog = this.exportLogRepository.create({
      userId: data.userId,
      userName: data.userName,
      exportType: data.exportType,
      recordCount: data.recordCount,
      fileName: data.fileName,
      fileSize: data.fileSize,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: 'success',
    });

    await this.exportLogRepository.save(exportLog);

    this.logger.log(`用户 ${data.userName} 导出${data.exportType}数据${data.recordCount}条`);

    // 检查异常导出行为
    await this.checkAbnormalExport(userId, data);

    return exportLog;
  }

  /**
   * 检查异常导出行为
   */
  private async checkAbnormalExport(userId: string, data: ExportLogDto): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取今日导出统计
    const todayExports = await this.exportLogRepository.find({
      where: { userId, createdAt: today },
    });

    const totalRecords = todayExports.reduce((sum, log) => sum + log.recordCount, 0);

    // 异常行为检测
    if (totalRecords > this.limits.dailyLimit * 0.8) {
      this.logger.warn(`用户 ${userId} 今日导出量已达${totalRecords}条，接近上限`);
      // TODO: 发送告警通知
    }

    // 非工作时间导出
    const hour = new Date().getHours();
    if (hour < 8 || hour > 20) {
      this.logger.warn(`用户 ${userId} 在非工作时间导出数据`);
      // TODO: 发送告警通知
    }
  }

  /**
   * 获取导出统计
   */
  async getExportStatistics(userId: string, days: number = 30): Promise<ExportStatistics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const exports = await this.exportLogRepository.find({
      where: {
        userId,
        createdAt: startDate,
      },
    });

    const totalExports = exports.length;
    const totalRecords = exports.reduce((sum, log) => sum + log.recordCount, 0);
    const sensitiveExports = exports.filter(
      (e) => e.exportType === 'customer' || e.exportType === 'contact',
    ).length;

    return {
      totalExports,
      totalRecords,
      sensitiveExports,
      dailyAverage: Math.round(totalRecords / days),
      limit: this.limits.dailyLimit,
      usage: ((totalRecords / this.limits.dailyLimit) * 100).toFixed(2) + '%',
    };
  }
}

// ========== 类型定义 ==========

interface ExportLogDto {
  userId: string;
  userName: string;
  exportType: string;
  recordCount: number;
  fileName: string;
  fileSize?: number;
  ipAddress?: string;
  userAgent?: string;
}

interface ExportStatistics {
  totalExports: number;
  totalRecords: number;
  sensitiveExports: number;
  dailyAverage: number;
  limit: number;
  usage: string;
}
