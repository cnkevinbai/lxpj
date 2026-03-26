/**
 * Prisma 模块
 * 提供数据库访问能力
 */
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global() // 全局模块，其他模块无需重复导入
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}