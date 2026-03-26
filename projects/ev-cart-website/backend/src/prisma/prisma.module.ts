import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const prisma = new PrismaClient({
          log: ['query', 'info', 'warn', 'error'],
        });
        return prisma;
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prisma: PrismaClient) {}

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('✅ Prisma 数据库连接成功');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('❌ Prisma 数据库连接已关闭');
  }
}
