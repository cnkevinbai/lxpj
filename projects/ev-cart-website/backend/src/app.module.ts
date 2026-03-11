import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from './database/redis.module'

// 模块
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CustomerModule } from './modules/customer/customer.module'
import { ProductModule } from './modules/product/product.module'
import { LeadModule } from './modules/lead/lead.module'
import { OpportunityModule } from './modules/opportunity/opportunity.module'
import { OrderModule } from './modules/order/order.module'
import { DealerModule } from './modules/dealer/dealer.module'
import { JobModule } from './modules/job/job.module'
import { CmsModule } from './modules/cms/cms.module'
import { HealthModule } from './modules/health/health.module'
import { SettingModule } from './modules/setting/setting.module'
import { UploadModule } from './modules/upload/upload.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // 数据库
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'evcart',
      password: process.env.DB_PASSWORD || 'evcart123',
      database: process.env.DB_NAME || 'evcart',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

    // Redis
    RedisModule,

    // 限流
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // 业务模块
    AuthModule,
    UserModule,
    CustomerModule,
    ProductModule,
    LeadModule,
    OpportunityModule,
    OrderModule,
    DealerModule,
    JobModule,
    CmsModule,
    HealthModule,
    SettingModule,
    UploadModule,
  ],
})
export class AppModule {}
