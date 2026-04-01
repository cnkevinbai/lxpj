/**
 * Core 核心系统索引文件
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

// 主模块
export { CoreModule } from './core.module'

// 日志服务
export { LoggerService, LogLevel, LogEntry } from './logger/logger.service'

// 事件总线
export { EventBusService } from './event/event-bus.service'

// 配置中心
export { ConfigCenterService } from './config/config-center.service'

// 模块系统
export { ModuleLoaderService } from './module/module-loader.service'
export { ModuleRegistryService, ModuleRegistration } from './module/module-registry.service'
export { BaseModule } from './module/base-module'

// 模块接口
export * from './module/interfaces'

// 示例模块
export { CrmModuleExample, CRM_MANIFEST } from './examples'
