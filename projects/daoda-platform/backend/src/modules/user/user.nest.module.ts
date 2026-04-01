/**
 * User 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生用户服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserHotplugModule, USER_HOTPLUG_MODULE } from './user.hotplug.module'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_HOTPLUG_MODULE',
      useValue: new UserHotplugModule(),
    },
  ],
  exports: [UserService, 'USER_HOTPLUG_MODULE'],
})
export class UserNestModule {
  static readonly hotplugModule = USER_HOTPLUG_MODULE
}
