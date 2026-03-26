/**
 * API Key 服务
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateApiKeyDto, UpdateApiKeyDto, ApiKeyQueryDto } from './api-key.dto'
import * as crypto from 'crypto'

@Injectable()
export class ApiKeyService {
  private readonly apiKeyPrefix = 'dk_' // 道达 API Key 前缀

  constructor(private prisma: PrismaService) {}

  /**
   * 生成 API Key
   * 格式: dk_<随机字符串>
   */
  generateKey(): { key: string; prefix: string } {
    const randomString = crypto.randomBytes(32).toString('hex')
    const key = `${this.apiKeyPrefix}${randomString}`
    const prefix = this.apiKeyPrefix
    return { key, prefix }
  }

  /**
   * 对 API Key 进行哈希加密
   */
  hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex')
  }

  /**
   * 验证 API Key
   * 支持明文 key 或哈希后的 key
   */
  async validateKey(key: string): Promise<any> {
    // 生成 key 的哈希值
    const keyHash = this.hashKey(key)

    // 从数据库中查找匹配的 key
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        key: keyHash,
      },
    })

    if (!apiKey) {
      return null
    }

    // 检查是否已过期
    if (apiKey.expireAt && new Date() > new Date(apiKey.expireAt)) {
      return null
    }

    // 更新最后使用时间
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })

    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      permissions: apiKey.permissions,
      rateLimit: apiKey.rateLimit,
      enabled: apiKey.enabled,
      expireAt: apiKey.expireAt,
      lastUsedAt: apiKey.lastUsedAt,
      tenantId: apiKey.tenantId,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    }
  }

  /**
   * 比较 API Key (防止时序攻击)
   */
  private compareKey(key: string, storedHash: string): boolean {
    const inputHash = this.hashKey(key)
    return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash))
  }

  /**
   * 检查频率限制
   */
  async checkRateLimit(key: string): Promise<boolean> {
    // 生成 key 的哈希值
    const keyHash = this.hashKey(key)

    // 获取 API Key 信息
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { key },
    })

    // 如果找不到 API Key，说明 key 无效
    if (!apiKey) {
      return false
    }

    const limit = apiKey.rateLimit || 1000
    const windowSeconds = 3600 // 1 小时

    // 生成 Redis key (按小时分片)
    const redisKey = `ratelimit:${apiKey.id}:${Math.floor(Date.now() / 1000 / windowSeconds)}`

    try {
      const ioredis = require('ioredis')
      const redis = new ioredis(process.env.REDIS_URL || 'redis://localhost:6379')

      const current = await redis.incr(redisKey)
      if (current === 1) {
        await redis.expire(redisKey, windowSeconds)
      }

      await redis.quit()

      return current <= limit
    } catch (error) {
      // 如果 Redis 不可用,记录日志但继续请求
      console.warn('Rate limiter Redis error:', error)
      return true
    }
  }

  /**
   * 创建 API Key
   */
  async create(dto: CreateApiKeyDto, tenantId: string) {
    // 生成 API Key
    const { key, prefix } = this.generateKey()
    const keyHash = this.hashKey(key)

    return this.prisma.apiKey.create({
      data: {
        name: dto.name,
        key: keyHash,
        keyPrefix: prefix,
        permissions: dto.permissions || [],
        rateLimit: dto.rateLimit || 1000,
        enabled: dto.enabled !== false,
        expireAt: dto.expireAt ? new Date(dto.expireAt) : null,
        tenantId,
      },
    })
  }

  /**
   * 获取 API Key 列表
   */
  async findAll(tenantId: string, query: ApiKeyQueryDto) {
    const { keyword, enabled, page = 1, pageSize = 10 } = query
    const skip = (page - 1) * pageSize

    const where: any = {
      tenantId,
    }

    // 关键词搜索
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { keyPrefix: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    // 状态筛选
    if (enabled !== undefined) {
      where.enabled = enabled
    }

    const [list, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          keyPrefix: true,
          permissions: true,
          rateLimit: true,
          enabled: true,
          expireAt: true,
          lastUsedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.apiKey.count({ where }),
    ])

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 获取 API Key 详情
   */
  async findOne(id: string, tenantId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        rateLimit: true,
        enabled: true,
        expireAt: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!apiKey) {
      throw new NotFoundException('API Key 不存在')
    }

    return apiKey
  }

  /**
   * 更新 API Key
   */
  async update(id: string, dto: UpdateApiKeyDto, tenantId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    })

    if (!apiKey) {
      throw new NotFoundException('API Key 不存在')
    }

    return this.prisma.apiKey.update({
      where: { id },
      data: {
        name: dto.name,
        permissions: dto.permissions,
        rateLimit: dto.rateLimit,
        expireAt: dto.expireAt ? new Date(dto.expireAt) : null,
        enabled: dto.enabled,
      },
    })
  }

  /**
   * 删除 API Key
   */
  async delete(id: string, tenantId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    })

    if (!apiKey) {
      throw new NotFoundException('API Key 不存在')
    }

    await this.prisma.apiKey.delete({
      where: { id },
    })

    return { message: 'API Key 已删除' }
  }

  /**
   * 重新生成 API Key
   */
  async regenerate(id: string, tenantId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    })

    if (!apiKey) {
      throw new NotFoundException('API Key 不存在')
    }

    // 生成新的 API Key
    const { key, prefix } = this.generateKey()
    const keyHash = this.hashKey(key)

    // 更新数据库中的 key
    const updatedKey = await this.prisma.apiKey.update({
      where: { id },
      data: {
        key: keyHash,
        keyPrefix: prefix,
        lastUsedAt: null,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        rateLimit: true,
        enabled: true,
        expireAt: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return {
      ...updatedKey,
      key: key, // 返回新的明文密钥
    }
  }

  /**
   * 禁用 API Key
   */
  async disable(id: string, tenantId: string) {
    return this.update(id, { enabled: false }, tenantId)
  }

  /**
   * 启用 API Key
   */
  async enable(id: string, tenantId: string) {
    return this.update(id, { enabled: true }, tenantId)
  }
}
