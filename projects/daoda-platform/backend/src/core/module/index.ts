/**
 * Core Module 索导出文件
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

// 接口
export * from './interfaces'

// 基类
export { BaseModule } from './base-module'

// 服务
export { ModuleLoaderService } from './module-loader.service'
export { ModuleRegistryService, ModuleRegistration } from './module-registry.service'
