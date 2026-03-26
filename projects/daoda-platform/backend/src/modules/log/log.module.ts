/**
 * 操作日志管理模块
 */
import { Module } from '@nestjs/common'
import { LogController } from './log.controller'
import { LogService } from './log.service'

@Module({
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
