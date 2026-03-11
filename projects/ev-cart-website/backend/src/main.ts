import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import logger from './lib/logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  const configService = app.get(ConfigService)

  // 安全头
  app.use(helmet({
    contentSecurityPolicy: false, // 开发环境禁用 CSP
  }))

  // 全局前缀
  app.setGlobalPrefix('api/v1')

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter())

  // 全局日志拦截器
  app.useGlobalInterceptors(new LoggingInterceptor())

  // CORS 配置
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      process.env.WEBSITE_URL,
      process.env.CRM_URL,
    ].filter(Boolean),
    credentials: true,
  })

  // Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('EV Cart API')
    .setDescription('电动观光车官网 + CRM 系统后端 API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users', '用户管理')
    .addTag('customers', '客户管理')
    .addTag('products', '产品管理')
    .addTag('leads', '线索管理')
    .addTag('orders', '订单管理')
    .addTag('dealers', '经销商管理')
    .addTag('jobs', '招聘管理')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  })

  const port = configService.get('PORT') || 3001
  await app.listen(port)
  
  logger.log(`🚀 Backend running on port ${port}`)
  logger.log(`📚 API Docs: http://localhost:${port}/api/docs`)
}

bootstrap()
