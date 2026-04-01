// Product 模块导出
export * from './product.module'
export * from './product.service'
export * from './product.controller'
export * from './product.dto'

// 热插拔模块导出
export * from './product.hotplug.module'
export * from './product.nest.module'

// 导出模块清单
export { PRODUCT_MODULE_MANIFEST, PRODUCT_HOTPLUG_MODULE } from './product.hotplug.module'
