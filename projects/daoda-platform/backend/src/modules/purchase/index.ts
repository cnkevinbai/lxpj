// Purchase 模块导出
export * from './purchase.module'
export * from './purchase.service'
export * from './purchase.controller'
export * from './purchase.dto'

// 热插拔模块导出
export * from './purchase.hotplug.module'
export * from './purchase.nest.module'

// 导出模块清单
export { PURCHASE_MODULE_MANIFEST, PURCHASE_HOTPLUG_MODULE } from './purchase.hotplug.module'
