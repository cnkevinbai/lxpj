/**
 * 频率限制服务
 * 使用 Redis 实现分布式频率限制
 */
import { Injectable, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name)
  private redis: Redis

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    this.redis = new Redis(redisUrl)

    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error:', err)
    })

    this.redis.on('connect', () => {
      this.logger.log('Redis connected')
    })
  }

  /**
   * 检查频率限制
   * @param key - 请求的唯一标识 (如: apiKey 或 IP)
   * @param limit - 时间窗口内允许的最大请求数
   * @param windowSeconds - 时间窗口大小 (秒)
   */
  async checkLimit(
    key: string,
    limit: number,
    windowSeconds: number = 3600,
  ): Promise<boolean> {
    const redisKey = `ratelimit:${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`

    try {
      const current = await this.redis.incr(redisKey)

      if (current === 1) {
        await this.redis.expire(redisKey, windowSeconds)
      }

      return current <= limit
    } catch (error) {
      this.logger.warn(`Rate limiter error for key ${key}:`, error)
      // 如果 Redis 不可用,允许请求但记录日志
      return true
    }
  }

  /**
   * 获取剩余请求次数
   */
  async getRemaining(key: string, limit: number, windowSeconds: number = 3600): Promise<number> {
    const redisKey = `ratelimit:${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`

    try {
      const current = await this.redis.get(redisKey)
      return Math.max(0, limit - parseInt(current || '0'))
    } catch (error) {
      this.logger.warn(`Rate limiter getRemaining error for key ${key}:`, error)
      return limit
    }
  }

  /**
   * 获取剩余时间 (秒)
   */
  async getRemainingTime(key: string, windowSeconds: number = 3600): Promise<number> {
    const redisKey = `ratelimit:${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`

    try {
      const ttl = await this.redis.ttl(redisKey)
      return Math.max(0, ttl)
    } catch (error) {
      this.logger.warn(`Rate limiter getRemainingTime error for key ${key}:`, error)
      return windowSeconds
    }
  }

  /**
   * 重置频率计数
   */
  async reset(key: string, windowSeconds: number = 3600) {
    const redisKey = `ratelimit:${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`

    try {
      await this.redis.del(redisKey)
    } catch (error) {
      this.logger.warn(`Rate limiter reset error for key ${key}:`, error)
    }
  }
}
