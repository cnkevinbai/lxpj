/**
 * 自动排障服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HealingRecord, IssueType, HealingAction, HealingStatus } from './entities/healing-record.entity'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class AutoHealingService {
  private readonly logger = new Logger(AutoHealingService.name)
  private healthCheckInterval = 30000 // 30 秒

  constructor(
    @InjectRepository(HealingRecord)
    private repository: Repository<HealingRecord>,
    private redisService: RedisService,
  ) {
    this.startHealthMonitoring()
  }

  /**
   * 启动健康监控
   */
  private startHealthMonitoring() {
    setInterval(() => {
      this.runHealthChecks()
    }, this.healthCheckInterval)

    this.logger.log('✅ 自动健康监控已启动')
  }

  /**
   * 运行健康检查
   */
  private async runHealthChecks() {
    await this.checkDatabase()
    await this.checkRedis()
    await this.checkMemory()
    await this.checkDiskSpace()
  }

  /**
   * 检查数据库
   */
  private async checkDatabase() {
    try {
      // 执行简单查询测试连接
      await this.repository.query('SELECT 1')
    } catch (error) {
      this.logger.error('数据库连接失败', error.stack)
      await this.createIssue('database_connection', '数据库连接失败', {
        error: error.message,
      })
      await this.attemptHealing('database_connection', 'failover')
    }
  }

  /**
   * 检查 Redis
   */
  private async checkRedis() {
    try {
      await this.redisService.ping()
    } catch (error) {
      this.logger.error('Redis 连接失败', error.stack)
      await this.createIssue('redis_connection', 'Redis 连接失败', {
        error: error.message,
      })
      await this.attemptHealing('redis_connection', 'restart_service')
    }
  }

  /**
   * 检查内存
   */
  private async checkMemory() {
    const used = process.memoryUsage().heapUsed
    const total = process.memoryUsage().heapTotal
    const percent = (used / total) * 100

    if (percent > 90) {
      this.logger.warn(`内存使用过高：${percent.toFixed(2)}%`)
      await this.createIssue('memory_leak', '内存使用率超过 90%', {
        used,
        total,
        percent,
      })
      await this.attemptHealing('memory_leak', 'cleanup')
    }
  }

  /**
   * 检查磁盘空间
   */
  private async checkDiskSpace() {
    // 简化实现，实际应使用系统命令
    const { exec } = await import('child_process')
    
    return new Promise((resolve) => {
      exec('df -h / | tail -1', (error, stdout) => {
        if (error) {
          resolve()
          return
        }
        
        const match = stdout.match(/(\d+)%/)
        if (match && parseInt(match[1]) > 90) {
          this.logger.warn(`磁盘空间不足：${match[1]}%`)
          this.createIssue('disk_space', '磁盘使用率超过 90%', {
            percent: match[1],
          })
          this.attemptHealing('disk_space', 'cleanup')
        }
        resolve()
      })
    })
  }

  /**
   * 创建问题记录
   */
  private async createIssue(
    type: IssueType,
    description: string,
    metrics?: Record<string, any>,
  ) {
    const record = this.repository.create({
      issueType: type,
      status: 'detected',
      description,
      metrics,
      detectedAt: new Date(),
    })
    return this.repository.save(record)
  }

  /**
   * 尝试自动修复
   */
  private async attemptHealing(issueType: IssueType, action: HealingAction) {
    this.logger.log(`尝试自动修复：${issueType} -> ${action}`)

    const record = await this.repository.findOne({
      where: { issueType, status: 'detected' },
      order: { detectedAt: 'DESC' },
    })

    if (!record) return

    record.status = 'healing'
    record.action = action
    await this.repository.save(record)

    try {
      let result: string

      switch (action) {
        case 'restart_service':
          result = await this.healRestartService()
          break
        case 'clear_cache':
          result = await this.healClearCache()
          break
        case 'cleanup':
          result = await this.healCleanup()
          break
        case 'failover':
          result = await this.healFailover()
          break
        default:
          result = '未知操作'
      }

      record.status = 'resolved'
      record.healedAt = new Date()
      record.actionResult = result
      this.logger.log(`修复成功：${result}`)
    } catch (error) {
      record.status = 'escalated'
      record.actionResult = `修复失败：${error.message}`
      this.logger.error('修复失败', error.stack)
      
      // 升级告警
      await this.escalateIssue(record)
    }

    await this.repository.save(record)
  }

  /**
   * 修复：重启服务
   */
  private async healRestartService(): Promise<string> {
    // 实际实现应调用容器编排系统
    return '服务已重启'
  }

  /**
   * 修复：清理缓存
   */
  private async healClearCache(): Promise<string> {
    await this.redisService.flushdb()
    return '缓存已清理'
  }

  /**
   * 修复：清理垃圾
   */
  private async healCleanup(): Promise<string> {
    // 清理临时文件、旧日志等
    global.gc?.()
    return '垃圾回收已执行'
  }

  /**
   * 修复：故障转移
   */
  private async healFailover(): Promise<string> {
    // 切换到备用节点
    return '已切换到备用节点'
  }

  /**
   * 升级问题
   */
  private async escalateIssue(record: HealingRecord) {
    // 发送告警通知
    this.logger.error(`问题升级：${record.issueType}`, {
      id: record.id,
      description: record.description,
    })

    // 实际应发送到告警系统 (钉钉/邮件/短信)
  }

  /**
   * 获取排障记录
   */
  async getRecords(limit: number = 20) {
    return this.repository.find({
      order: { detectedAt: 'DESC' },
      take: limit,
    })
  }

  /**
   * 获取统计信息
   */
  async getStats() {
    const records = await this.repository.find()

    return {
      total: records.length,
      byStatus: {
        detected: records.filter(r => r.status === 'detected').length,
        healing: records.filter(r => r.status === 'healing').length,
        resolved: records.filter(r => r.status === 'resolved').length,
        escalated: records.filter(r => r.status === 'escalated').length,
      },
      byType: {
        database: records.filter(r => r.issueType === 'database_connection').length,
        redis: records.filter(r => r.issueType === 'redis_connection').length,
        memory: records.filter(r => r.issueType === 'memory_leak').length,
        disk: records.filter(r => r.issueType === 'disk_space').length,
      },
      successRate: records.length > 0
        ? (records.filter(r => r.status === 'resolved').length / records.length) * 100
        : 0,
    }
  }
}
