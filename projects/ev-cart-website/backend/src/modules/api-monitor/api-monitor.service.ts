/**
 * API 稳定性监控服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApiMetric } from './entities/api-metric.entity'

export interface ApiHealth {
  endpoint: string
  successRate: number
  avgResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  totalRequests: number
  status: 'healthy' | 'degraded' | 'unhealthy'
}

@Injectable()
export class ApiMonitorService {
  private readonly logger = new Logger(ApiMonitorService.name)
  private metrics: Map<string, ApiMetric[]> = new Map()

  constructor(
    @InjectRepository(ApiMetric)
    private repository: Repository<ApiMetric>,
  ) {}

  /**
   * 记录 API 请求
   */
  async recordRequest(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    success: boolean,
  ) {
    const metric = this.repository.create({
      endpoint,
      method,
      responseTime,
      statusCode,
      success,
      timestamp: new Date(),
    })

    await this.repository.save(metric)

    // 内存缓存 (最近 1000 条)
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, [])
    }
    const endpointMetrics = this.metrics.get(endpoint)!
    endpointMetrics.push(metric)
    if (endpointMetrics.length > 1000) {
      endpointMetrics.shift()
    }

    // 检查异常
    if (!success || responseTime > 5000) {
      this.logger.warn(`API 异常：${method} ${endpoint} (${responseTime}ms, ${statusCode})`)
    }
  }

  /**
   * 获取 API 健康状态
   */
  async getApiHealth(endpoint?: string): Promise<ApiHealth[]> {
    const query = this.repository.createQueryBuilder('metric')
      .select([
        'metric.endpoint',
        'metric.method',
        'AVG(metric.responseTime) as avg_time',
        'COUNT(*) as total',
        'SUM(CASE WHEN metric.success THEN 1 ELSE 0 END) as success_count',
      ])
      .where('metric.timestamp > NOW() - INTERVAL \'1 hour\'')
      .groupBy('metric.endpoint')
      .addGroupBy('metric.method')

    if (endpoint) {
      query.andWhere('metric.endpoint = :endpoint', { endpoint })
    }

    const results = await query.getRawMany()

    return results.map((r: any) => {
      const successRate = (r.success_count / r.total) * 100
      let status: ApiHealth['status'] = 'healthy'
      if (successRate < 95) status = 'degraded'
      if (successRate < 90) status = 'unhealthy'

      return {
        endpoint: r.endpoint,
        successRate: parseFloat(successRate.toFixed(2)),
        avgResponseTime: parseFloat(r.avg_time.toFixed(2)),
        p95ResponseTime: 0, // 需要更复杂计算
        p99ResponseTime: 0,
        totalRequests: parseInt(r.total),
        status,
      }
    })
  }

  /**
   * 获取统计信息
   */
  async getStats(hours: number = 24) {
    const query = this.repository.createQueryBuilder('metric')
      .where('metric.timestamp > NOW() - INTERVAL :hours HOUR', { hours })

    const total = await query.getCount()
    const success = await query.clone().andWhere('metric.success = true').getCount()
    const avgTime = await query
      .clone()
      .select('AVG(metric.responseTime)', 'avg')
      .getRawOne()

    return {
      totalRequests: total,
      successRate: total > 0 ? ((success / total) * 100).toFixed(2) : '0',
      avgResponseTime: parseFloat(avgTime?.avg || 0).toFixed(2),
      timeRange: `${hours}h`,
    }
  }

  /**
   * 清理旧数据
   */
  async cleanup(days: number = 7) {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .where('timestamp < NOW() - INTERVAL :days DAY', { days })
      .execute()

    this.logger.log(`清理 ${result.affected} 条旧监控数据`)
    return result.affected
  }
}
