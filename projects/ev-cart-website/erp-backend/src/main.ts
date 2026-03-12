import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局配置
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // 全局异常过滤
  app.useGlobalFilters(new AllExceptionsFilter())

  // 全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalInterceptors(new LoggingInterceptor())

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('EV Cart ERP API')
    .setDescription('电动观光车 ERP 系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const configService = app.get(ConfigService)
  const port = configService.get('PORT', 3002)

  await app.listen(port)
  console.log(`🚀 ERP Backend running on port ${port}`)
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`)
}

bootstrap()
