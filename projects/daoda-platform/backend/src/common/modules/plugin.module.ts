/**
 * 插件管理模块
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Module } from '@nestjs/common'
import { PluginService } from '../services/plugin.service'
import { PluginController } from '../controllers/plugin.controller'

@Module({
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginNestModule {}
