/**
 * 道达智能后端 - 入口文件
 */
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 安全中间件
  app.use(helmet())

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

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-tenant-id, X-Tenant-Id, X-TENANT-ID',
  })

  // API 前缀
  app.setGlobalPrefix('api/v1')

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter())

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor())

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('道达智能数字化平台 API')
    .setDescription('道达智能数字化平台后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 4000
  await app.listen(port)
  
  console.log(`🚀 道达智能后端服务已启动: http://localhost:${port}`)
  console.log(`📚 API 文档: http://localhost:${port}/api/docs`)
}

bootstrap()