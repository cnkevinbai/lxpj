/**
 * Redis 服务
 * 提供 Redis 缓存和分布式锁功能
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'

export interface LogEntry {
  level: string
  message: string
  timestamp: Date
  context?: string
  data?: any
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null
  private isConnected = false

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    
    try {
      this.client = createClient({ url: redisUrl })
      
      this.client.on('connect', () => {
        this.isConnected = true
        console.log('Redis connected')
      })
      
      this.client.on('disconnect', () => {
        this.isConnected = false
        console.log('Redis disconnected')
      })
      
      this.client.on('error', (err) => {
        console.error('Redis error:', err)
      })
      
      await this.client.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      // 开发环境下允许降级运行
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Running without Redis cache')
      }
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit()
    }
  }

  /**
   * 获取缓存值
   */
  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null
    }
    return this.client.get(key)
  }

  /**
   * 设置缓存值
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value)
    } else {
      await this.client.set(key, value)
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    await this.client.del(key)
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false
    }
    const result = await this.client.exists(key)
    return result === 1
  }

  /**
   * 获取 TTL
   */
  async ttl(key: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      return -1
    }
    return this.client.ttl(key)
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    await this.client.expire(key, seconds)
  }

  /**
   * 获取哈希字段
   */
  async hGet(key: string, field: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null
    }
    return this.client.hGet(key, field)
  }

  /**
   * 设置哈希字段
   */
  async hSet(key: string, field: string, value: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    await this.client.hSet(key, field, value)
  }

  /**
   * 获取整个哈希
   */
  async hGetAll(key: string): Promise<Record<string, string>> {
    if (!this.client || !this.isConnected) {
      return {}
    }
    return this.client.hGetAll(key)
  }

  /**
   * 删除哈希字段
   */
  async hDel(key: string, field: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    await this.client.hDel(key, field)
  }

  /**
   * 发布消息
   */
  async publish(channel: string, message: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    await this.client.publish(channel, message)
  }

  /**
   * 订阅频道
   */
  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    await this.client.subscribe(channel, callback)
  }

  /**
   * 获取或创建缓存（带回调）
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    // 如果 Redis 不可用，直接获取数据
    if (!this.client || !this.isConnected) {
      return fetcher()
    }

    const cached = await this.get(key)
    if (cached) {
      try {
        return JSON.parse(cached) as T
      } catch {
        return cached as unknown as T
      }
    }

    const data = await fetcher()
    await this.set(key, JSON.stringify(data), ttlSeconds)
    return data
  }

  /**
   * 分布式锁
   */
  async acquireLock(lockKey: string, ttlSeconds: number = 10): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return true // Redis 不可用时降级处理
    }
    
    const result = await this.client.set(lockKey, '1', {
      NX: true,
      EX: ttlSeconds
    })
    
    return result === 'OK'
  }

  /**
   * 释放锁
   */
  async releaseLock(lockKey: string): Promise<void> {
    await this.del(lockKey)
  }

  /**
   * 记录日志（用于 LogEntry 类型）
   */
  async logDataProcessing(entry: LogEntry | string): Promise<void> {
    if (!this.client || !this.isConnected) {
      return
    }
    
    const logKey = `logs:data-processing:${new Date().toISOString().split('T')[0]}`
    const logEntry = typeof entry === 'string' 
      ? { level: 'info', message: entry, timestamp: new Date() }
      : entry
    
    await this.client.rPush(logKey, JSON.stringify(logEntry))
    await this.client.expire(logKey, 7 * 24 * 60 * 60) // 保留7天
  }

  /**
   * 检查连接状态
   */
  isReady(): boolean {
    return this.isConnected
  }

  /**
   * Ping Redis 服务器
   */
  async ping(): Promise<string> {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis not connected')
    }
    return this.client.ping()
  }
}