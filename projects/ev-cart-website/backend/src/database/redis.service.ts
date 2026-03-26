import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'
import logger from '../lib/logger'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get('REDIS_HOST', 'localhost')
    const port = this.configService.get('REDIS_PORT', 6379)

    this.client = createClient({
      url: `redis://${host}:${port}`,
    })

    this.client.on('error', (err) => logger.error('Redis Client Error', err))

    await this.client.connect()
    logger.info('✅ Redis connected')
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  getClient(): RedisClientType {
    return this.client
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
}
