// Employee 模块导出
export * from './employee.module'
export * from './employee.service'
export * from './employee.controller'
export * from './employee.dto'
export * from './employee.hotplug.module'
export * from './employee.nest.module'

// 热插拔模块Manifest导出
export { EMPLOYEE_MODULE_MANIFEST } from './employee.hotplug.module'
