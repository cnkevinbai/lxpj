// Salary 模块导出
export * from './salary.module'
export * from './salary.service'
export * from './salary.controller'
export * from './salary.dto'

// 热插拔模块导出
export * from './salary.hotplug.module'
export * from './salary.nest.module'

// 导出模块清单
export { SALARY_MODULE_MANIFEST, SALARY_HOTPLUG_MODULE } from './salary.hotplug.module'
