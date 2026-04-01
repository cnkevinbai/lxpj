/**
 * CoreModule 核心模块
 * 提供热插拔系统的核心服务
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit } from '@nestjs/common'
import { LoggerService } from './logger/logger.service'
import { EventBusService } from './event/event-bus.service'
import { ConfigCenterService } from './config/config-center.service'
import { ModuleLoaderService } from './module/module-loader.service'
import { ModuleRegistryService } from './module/module-registry.service'

@Global()
@Module({
  providers: [
    // 日志服务
    LoggerService,

    // 事件总线
    EventBusService,

    // 配置中心
    ConfigCenterService,

    // 模块系统
    ModuleLoaderService,
    ModuleRegistryService,
  ],
  exports: [
    LoggerService,
    EventBusService,
    ConfigCenterService,
    ModuleLoaderService,
    ModuleRegistryService,
  ],
})
export class CoreModule implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {}

  async onModuleInit(): Promise<void> {
    this.logger.setModuleId('core')
    this.logger.info('=================================')
    this.logger.info('  道达智能数字化平台 - Core v1.0.0  ')
    this.logger.info('  热插拔模块系统已启动             ')
    this.logger.info('=================================')

    // 打印核心服务状态
    this.logger.info('核心服务已初始化:')
    this.logger.info('  - LoggerService (日志服务)')
    this.logger.info('  - EventBusService (事件总线)')
    this.logger.info('  - ConfigCenterService (配置中心)')
    this.logger.info('  - ModuleLoaderService (模块加载器)')
    this.logger.info('  - ModuleRegistryService (模块注册表)')
  }
}
