/**
 * Tenant 热插拔模块 - NestJS 包装器
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module } from '@nestjs/common'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { TenantHotplugModule, TENANT_HOTPLUG_MODULE } from './tenant.hotplug.module'

@Module({
  controllers: [TenantController],
  providers: [
    TenantService,
    {
      provide: 'TENANT_HOTPLUG_MODULE',
      useValue: new TenantHotplugModule(),
    },
  ],
  exports: [TenantService, 'TENANT_HOTPLUG_MODULE'],
})
export class TenantNestModule {
  static readonly hotplugModule = TENANT_HOTPLUG_MODULE
}
