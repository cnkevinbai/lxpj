/**
 * 服务 NestJS 模块包装器
 * 将热插拔服务模块集成到 NestJS 系统
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ServiceModule } from './service.module'
import { ServiceModule as ServiceTicketModule } from '../service/service.module'
import { ContractModule } from '../contract/contract.module'
import { PartModule } from '../part/part.module'

// ============================================
// 服务 NestJS 模块
// ============================================

@Global()
@Module({
  // 导入子模块
  imports: [ServiceTicketModule, ContractModule, PartModule],

  // 导出子模块
  exports: [ServiceTicketModule, ContractModule, PartModule],
})
export class ServiceNestModule implements OnModuleInit, OnModuleDestroy {
  private serviceModule: ServiceModule

  constructor() {
    this.serviceModule = new ServiceModule()
  }

  async onModuleInit() {
    console.log('[ServiceNestModule] 服务 NestJS 包装器初始化')
  }

  async onModuleDestroy() {
    console.log('[ServiceNestModule] 服务 NestJS 包装器销毁')
  }

  /**
   * 获取热插拔模块实例
   */
  getHotplugModule(): ServiceModule {
    return this.serviceModule
  }
}
