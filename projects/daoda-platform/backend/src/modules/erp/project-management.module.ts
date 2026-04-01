/**
 * 项目管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { ProjectManagementController } from './project-management.controller'
import { ProjectManagementService } from './project-management.service'

@Module({
  controllers: [ProjectManagementController],
  providers: [ProjectManagementService],
  exports: [ProjectManagementService],
})
export class ProjectManagementModule {}
