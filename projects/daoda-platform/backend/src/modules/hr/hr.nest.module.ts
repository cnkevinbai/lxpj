/**
 * HR NestJS 模块包装器
 * 将热插拔HR模块集成到 NestJS 系统
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { HrModule } from './hr.module'
import { EmployeeModule } from '../employee/employee.module'
import { AttendanceModule } from '../attendance/attendance.module'
import { SalaryModule } from '../salary/salary.module'
import { OrganizationModule } from './organization.module'
import { PerformanceModule } from './performance.module'
import { RecruitmentModule } from './recruitment.module'
import { TrainingModule } from './training.module'

// ============================================
// HR NestJS 模块
// ============================================

@Global()
@Module({
  // 导入子模块
  imports: [
    EmployeeModule,
    AttendanceModule,
    SalaryModule,
    OrganizationModule,
    PerformanceModule,
    RecruitmentModule,
    TrainingModule,
  ],

  // 导出子模块
  exports: [
    EmployeeModule,
    AttendanceModule,
    SalaryModule,
    OrganizationModule,
    PerformanceModule,
    RecruitmentModule,
    TrainingModule,
  ],
})
export class HrNestModule implements OnModuleInit, OnModuleDestroy {
  private hrModule: HrModule

  constructor() {
    this.hrModule = new HrModule()
  }

  async onModuleInit() {
    console.log('[HrNestModule] HR NestJS 包装器初始化')
  }

  async onModuleDestroy() {
    console.log('[HrNestModule] HR NestJS 包装器销毁')
  }

  /**
   * 获取热插拔模块实例
   */
  getHotplugModule(): HrModule {
    return this.hrModule
  }
}
