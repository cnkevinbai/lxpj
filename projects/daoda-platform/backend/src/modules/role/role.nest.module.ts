/**
 * Role 热插拔模块 - NestJS 包装器
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { RoleHotplugModule, ROLE_HOTPLUG_MODULE } from './role.hotplug.module'

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: 'ROLE_HOTPLUG_MODULE',
      useValue: new RoleHotplugModule(),
    },
  ],
  exports: [RoleService, 'ROLE_HOTPLUG_MODULE'],
})
export class RoleNestModule {
  static readonly hotplugModule = ROLE_HOTPLUG_MODULE
}
