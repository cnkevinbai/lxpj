/**
 * 组织架构 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { OrganizationController } from './organization.controller'
import { OrganizationService } from './organization.service'

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
