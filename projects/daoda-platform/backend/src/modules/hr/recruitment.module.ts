/**
 * 招聘管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { RecruitmentController } from './recruitment.controller'
import { RecruitmentService } from './recruitment.service'

@Module({
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService],
})
export class RecruitmentModule {}
