import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for both HTTP and WebSocket
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Use Socket.IO adapter for WebSocket support
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // Set global prefix for API routes
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/files/',
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🔌 WebSocket is available on: ws://localhost:${port}`);
  Logger.log(`📁 Static files are served at: http://localhost:${port}/files/`);
}
bootstrap();
