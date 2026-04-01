/**
 * Settings NestJS 模块包装器
 * 将热插拔Settings模块集成到 NestJS 系统
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { SettingsModule } from './settings.module'
import { UserModule } from '../user/user.module'
import { RoleModule } from '../role/role.module'
import { MenuModule } from '../menu/menu.module'
import { SystemConfigModule } from '../system-config/system-config.module'
import { TenantModule } from '../tenant/tenant.module'
import { LogModule } from '../log/log.module'
import { WebhookModule } from '../webhook/webhook.module'
import { ModuleConfigModule } from '../module-config/module-config.module'

// ============================================
// Settings NestJS 模块
// ============================================

@Global()
@Module({
  // 导入子模块
  imports: [
    UserModule,
    RoleModule,
    MenuModule,
    SystemConfigModule,
    TenantModule,
    LogModule,
    WebhookModule,
    ModuleConfigModule,
  ],

  // 导出子模块
  exports: [
    UserModule,
    RoleModule,
    MenuModule,
    SystemConfigModule,
    TenantModule,
    LogModule,
    WebhookModule,
    ModuleConfigModule,
  ],
})
export class SettingsNestModule implements OnModuleInit, OnModuleDestroy {
  private settingsModule: SettingsModule

  constructor() {
    this.settingsModule = new SettingsModule()
  }

  async onModuleInit() {
    console.log('[SettingsNestModule] Settings NestJS 包装器初始化')
  }

  async onModuleDestroy() {
    console.log('[SettingsNestModule] Settings NestJS 包装器销毁')
  }

  /**
   * 获取热插拔模块实例
   */
  getHotplugModule(): SettingsModule {
    return this.settingsModule
  }
}
