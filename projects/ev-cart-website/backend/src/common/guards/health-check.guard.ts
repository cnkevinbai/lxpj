/**
 * 健康检查守卫 - 服务可用性检查
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, CanActivate, ExecutionContext, ServiceUnavailableException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RedisService } from '../../redis/redis.service'

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  database: boolean
  redis: boolean
  memory: number
  uptime: number
  timestamp: number
}

@Injectable()
export class HealthCheckGuard implements CanActivate {
  constructor(
    @InjectRepository('default')
    private dbRepository: Repository<any>,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const health = await this.checkHealth()
    
    if (health.status === 'unhealthy') {
      throw new ServiceUnavailableException('服务暂时不可用')
    }
    
    return true
  }

  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMemory(),
    ])

    const [dbResult, redisResult, memoryResult] = checks

    const database = dbResult.status === 'fulfilled' && dbResult.value
    const redis = redisResult.status === 'fulfilled' && redisResult.value
    const memory = memoryResult.status === 'fulfilled' ? memoryResult.value : 100

    // 判断整体状态
    let status: HealthStatus['status'] = 'healthy'
    if (!database || !redis) {
      status = 'unhealthy'
    } else if (memory > 90) {
      status = 'degraded'
    }

    return {
      status,
      database,
      redis,
      memory,
      uptime: process.uptime(),
      timestamp: Date.now(),
    }
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.dbRepository.query('SELECT 1')
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.redisService.ping()
      return true
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }

  private async checkMemory(): Promise<number> {
    const used = process.memoryUsage().heapUsed
    const total = process.memoryUsage().heapTotal
    return (used / total) * 100
  }
}
