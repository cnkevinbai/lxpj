import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { I18nResponseInterceptor } from './common/interceptors/i18n-response.interceptor'
import { RateLimitGuard } from './common/guards/rate-limit.guard'
import logger from './lib/logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    snapshot: true, // 启用调试快照
  })

  const configService = app.get(ConfigService)

  // =====================
  // 安全配置
  // =====================
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  }))

  // =====================
  // 全局配置
  // =====================
  app.setGlobalPrefix('api/v1')
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      process.env.WEBSITE_URL,
      process.env.CRM_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  })

  // =====================
  // 全局管道
  // =====================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 400,
    }),
  )

  // =====================
  // 全局过滤器
  // =====================
  app.useGlobalFilters(new AllExceptionsFilter())

  // =====================
  // 全局拦截器
  // =====================
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new I18nResponseInterceptor(), // 国际化响应
  )

  // =====================
  // 全局守卫
  // =====================
  app.useGlobalGuards(new RateLimitGuard(app.get('Reflector')))

  // =====================
  // API 文档
  // =====================
  const config = new DocumentBuilder()
    .setTitle('四川道达智能 API')
    .setDescription(`
## 四川道达智能车辆制造有限公司 API

### 国际化支持
- 简体中文 (zh-CN)
- 英语 (en)
- 繁体中文 (zh-TW)

### 认证方式
Bearer Token (JWT)

### 高可用特性
- 多实例部署
- 负载均衡
- 限流降级
- 健康检查
`)
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '认证授权')
    .addTag('users', '用户管理')
    .addTag('roles', '角色管理')
    .addTag('customers', '客户管理')
    .addTag('products', '产品管理')
    .addTag('leads', '线索管理')
    .addTag('opportunities', '商机管理')
    .addTag('orders', '订单管理')
    .addTag('dealers', '经销商管理')
    .addTag('jobs', '招聘管理')
    .addTag('cms', '内容管理')
    .addTag('settings', '系统设置')
    .addTag('export', '数据导出')
    .addTag('integration', '第三方集成')
    .addTag('email', '邮件服务')
    .addTag('sms', '短信服务')
    .addTag('health', '健康检查')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '四川道达智能 API',
  })

  // =====================
  // 启动服务
  // =====================
  const port = configService.get('PORT') || 3001
  const host = configService.get('HOST') || '0.0.0.0'
  
  await app.listen(port, host)
  
  logger.log('════════════════════════════════════')
  logger.log('🚀 四川道达智能 API 服务已启动')
  logger.log(`📍 地址：http://${host}:${port}`)
  logger.log(`📚 API 文档：http://${host}:${port}/api/docs`)
  logger.log(`🏥 健康检查：http://${host}:${port}/health`)
  logger.log('════════════════════════════════════')
}

bootstrap()
