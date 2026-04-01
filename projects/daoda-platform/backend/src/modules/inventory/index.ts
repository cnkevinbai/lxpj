// Inventory 模块导出
export * from './inventory.module'
export * from './inventory.service'
export * from './inventory.controller'
export * from './inventory.dto'

// 热插拔模块导出
export * from './inventory.hotplug.module'
export * from './inventory.nest.module'

// 导出模块清单
export { INVENTORY_MODULE_MANIFEST, INVENTORY_HOTPLUG_MODULE } from './inventory.hotplug.module'
