/**
 * Core Module Interfaces 索导出文件
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

// 主接口
export {
  IModule,
  ModuleStatus,
  ModuleHealth,
  HotUpdateStrategy,
  ModuleMenuItem,
  ModuleConfigDefinition,
} from './imodule.interface'
export {
  ModuleManifest,
  ModuleDependency,
  ModuleManifest as ModuleManifestDecorator,
} from './module-manifest.interface'
export {
  ModuleContext,
  DatabaseService,
  RouteRegistry,
  PermissionRegistry,
  MenuRegistry,
  ServiceRegistry,
  CreateModuleContextOptions,
} from './module-context.interface'
export { ModuleRoute, HttpMethod, RouteMiddleware, RouteGroup } from './module-route.interface'
export {
  ModulePermission,
  PermissionType,
  DataScope,
  PermissionGroup,
  generateCrudPermissions,
} from './module-permission.interface'
export {
  ModuleEvent,
  EventType,
  EventPriority,
  EventPayload,
  EventListener,
  ModuleLifecycleEvents,
  BusinessDataEventTemplates,
} from './module-event.interface'
