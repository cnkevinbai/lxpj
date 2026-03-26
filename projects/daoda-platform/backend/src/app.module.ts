/**
 * 应用根模块
 * 整合所有业务模块和公共模块
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { PrismaModule } from './common/prisma/prisma.module'
import { PrismaService } from './common/prisma/prisma.service'
import { TenantContextService } from './common/services/tenant-context.service'
import { TenantMiddleware } from './common/middleware/tenant.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CustomerModule } from './modules/customer/customer.module'
import { ProductModule } from './modules/product/product.module'
import { OrderModule } from './modules/order/order.module'
import { ServiceModule } from './modules/service/service.module'
import { UploadModule } from './common/upload/upload.module'
import { LeadModule } from './modules/lead/lead.module'
import { OpportunityModule } from './modules/opportunity/opportunity.module'
import { QuotationModule } from './modules/quotation/quotation.module'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { ContractModule } from './modules/contract/contract.module'

// ERP 相关模块
import { InventoryModule } from './modules/inventory/inventory.module'
import { PurchaseModule } from './modules/purchase/purchase.module'
import { ProductionModule } from './modules/production/production.module'
import { BomModule } from './modules/bom/bom.module'
import { ProductionPlanModule } from './modules/production-plan/production-plan.module'

// Finance 相关模块
import { InvoiceModule } from './modules/invoice/invoice.module'
import { ReceivableModule } from './modules/receivable/receivable.module'
import { PayableModule } from './modules/payable/payable.module'

// HR 相关模块
import { EmployeeModule } from './modules/employee/employee.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { SalaryModule } from './modules/salary/salary.module'

// CMS 相关模块
import { NewsModule } from './modules/news/news.module'
import { CaseModule } from './modules/case/case.module'
import { VideoModule } from './modules/video/video.module'

// Settings 相关模块
import { SystemConfigModule } from './modules/system-config/system-config.module'

// System Management 相关模块
import { RoleModule } from './modules/role/role.module'
import { MenuModule } from './modules/menu/menu.module'
import { LogModule } from './modules/log/log.module'

// Module Config 相关模块
import { ModuleConfigModule } from './modules/module-config/module-config.module'
import { ModuleEnabledGuard } from './common/guards/module-enabled.guard'

// Part 相关模块
import { PartModule } from './modules/part/part.module'

// Tenant 相关模块
import { TenantModule } from './modules/tenant/tenant.module'

// Webhook 相关模块
import { WebhookModule } from './modules/webhook/webhook.module'
import { EventEmitterService } from './common/services/event-emitter.service'

// API Key 相关模块
import { ApiKeyModule } from './modules/api-key/api-key.module'
import { PublicApiModule } from './modules/public-api/public-api.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 限流模块
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Prisma 模块
    PrismaModule,

    // 核心业务模块（10 个已完成）
    AuthModule,
    UserModule,
    CustomerModule,
    ProductModule,
    OrderModule,
    ServiceModule,
    UploadModule,
    LeadModule,
    OpportunityModule,
    QuotationModule,
    ContractModule,

    // ERP 相关模块（5 个）
    InventoryModule,
    PurchaseModule,
    ProductionModule,
    BomModule,
    ProductionPlanModule,

    // Finance 相关模块（3 个）
    InvoiceModule,
    ReceivableModule,
    PayableModule,

    // HR 相关模块（3 个）
    EmployeeModule,
    AttendanceModule,
    SalaryModule,

    // CMS 相关模块（3 个）
    NewsModule,
    CaseModule,
    VideoModule,

    // Settings 相关模块（1 个）
    SystemConfigModule,

    // System Management 相关模块（3 个）
    RoleModule,
    MenuModule,
    LogModule,

    // Module Config 相关模块（1 个）
    ModuleConfigModule,

    // Part 相关模块（1 个）
    PartModule,

    // Tenant 相关模块（1 个）
    TenantModule,

    // Webhook 相关模块（1 个）
    WebhookModule,

    // API Key 相关模块（2 个）
    ApiKeyModule,
    PublicApiModule,
  ],
  providers: [
    // 租户上下文服务
    TenantContextService,
    // 事件发射器服务
    EventEmitterService,
    // 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 全局模块守卫
    {
      provide: APP_GUARD,
      useClass: ModuleEnabledGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private prisma: PrismaService, private tenantContext: TenantContextService) {}

  configure(consumer: MiddlewareConsumer) {
    // 为所有 API 路由添加租户中间件
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*')
  }
}
