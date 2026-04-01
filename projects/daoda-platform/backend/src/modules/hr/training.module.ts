/**
 * 培训管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { TrainingController } from './training.controller'
import { TrainingService } from './training.service'

@Module({
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
