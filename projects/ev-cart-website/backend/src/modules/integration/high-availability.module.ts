import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighAvailabilityService } from './high-availability.service';
import { HighAvailabilityController } from './high-availability.controller';
import { IntegrationModule } from '../integration/integration.module';

/**
 * 高可用模块
 * 提供健康检查、故障恢复、定时同步等功能
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([]),
    IntegrationModule,
  ],
  controllers: [HighAvailabilityController],
  providers: [HighAvailabilityService],
  exports: [HighAvailabilityService],
})
export class HighAvailabilityModule {}
