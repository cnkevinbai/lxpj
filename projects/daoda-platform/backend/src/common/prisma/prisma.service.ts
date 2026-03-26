/**
 * Prisma 服务
 * 封装 Prisma Client，提供数据库访问能力
 */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    })
  }

  /**
   * 模块初始化时连接数据库
   */
  async onModuleInit() {
    await this.$connect()
    this.logger.log('数据库连接成功')

    // 查询日志
    this.$on('query' as never, (e: any) => {
      this.logger.debug(`Query: ${e.query}`)
      this.logger.debug(`Params: ${e.params}`)
      this.logger.debug(`Duration: ${e.duration}ms`)
    })
  }

  /**
   * 模块销毁时断开数据库连接
   */
  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('数据库连接已断开')
  }
}