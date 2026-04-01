/**
 * Attendance 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生考勤服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { AttendanceController } from './attendance.controller'
import { AttendanceService } from './attendance.service'

// 热插拔模块
import { AttendanceHotplugModule, ATTENDANCE_HOTPLUG_MODULE } from './attendance.hotplug.module'

@Global()
@Module({
  imports: [],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    // 热插拔模块实例
    {
      provide: 'ATTENDANCE_HOTPLUG_MODULE',
      useValue: new AttendanceHotplugModule(),
    },
  ],
  exports: [AttendanceService, 'ATTENDANCE_HOTPLUG_MODULE'],
})
export class AttendanceNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = ATTENDANCE_HOTPLUG_MODULE
}
