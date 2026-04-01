/**
 * Employee 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生员工服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { EmployeeController } from './employee.controller'
import { EmployeeService } from './employee.service'

// 热插拔模块
import { EmployeeHotplugModule, EMPLOYEE_HOTPLUG_MODULE } from './employee.hotplug.module'

@Global()
@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    // 热插拔模块实例
    {
      provide: 'EMPLOYEE_HOTPLUG_MODULE',
      useValue: new EmployeeHotplugModule(),
    },
  ],
  exports: [EmployeeService, 'EMPLOYEE_HOTPLUG_MODULE'],
})
export class EmployeeNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = EMPLOYEE_HOTPLUG_MODULE
}
