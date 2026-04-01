/**
 * Salary 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生薪资服务集成
 *
 * 功能范围:
 * - 薪资记录 CRUD
 * - 工资计算和发放
 * - 薪资状态管理
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { SalaryController } from './salary.controller'
import { SalaryService } from './salary.service'

// 热插拔模块
import { SalaryHotplugModule, SALARY_HOTPLUG_MODULE } from './salary.hotplug.module'

@Global()
@Module({
  imports: [],
  controllers: [SalaryController],
  providers: [
    SalaryService,
    // 热插拔模块实例
    {
      provide: 'SALARY_HOTPLUG_MODULE',
      useValue: new SalaryHotplugModule(),
    },
  ],
  exports: [SalaryService, 'SALARY_HOTPLUG_MODULE'],
})
export class SalaryNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = SALARY_HOTPLUG_MODULE
}
