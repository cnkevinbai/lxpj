/**
 * 插件管理控制器
 * 提供插件市场、安装、卸载、启用、禁用 API
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Controller, Get, Post, Delete, Put, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PluginService, PluginInfo, PluginMarketItem } from '../services/plugin.service'
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../modules/auth/guards/roles.guard'
import { Roles } from '../../modules/auth/decorators/roles.decorator'

@ApiTags('插件管理')
@Controller('plugins')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  /**
   * 获取已安装插件列表
   */
  @Get('installed')
  @Roles('ADMIN')
  @ApiOperation({ summary: '获取已安装插件列表' })
  async getInstalled(): Promise<PluginInfo[]> {
    return this.pluginService.getInstalledPlugins()
  }

  /**
   * 获取插件市场列表
   */
  @Get('market')
  @Roles('ADMIN')
  @ApiOperation({ summary: '获取插件市场列表' })
  async getMarket(): Promise<PluginMarketItem[]> {
    return this.pluginService.getMarketPlugins()
  }

  /**
   * 获取插件详情
   */
  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '获取插件详情' })
  async getDetail(@Param('id') id: string): Promise<PluginInfo | PluginMarketItem> {
    return this.pluginService.getPluginDetail(id)
  }

  /**
   * 安装插件
   */
  @Post(':id/install')
  @Roles('ADMIN')
  @ApiOperation({ summary: '安装插件' })
  async install(@Param('id') id: string): Promise<PluginInfo> {
    return this.pluginService.installPlugin(id)
  }

  /**
   * 卸载插件
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '卸载插件' })
  async uninstall(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.pluginService.uninstallPlugin(id)
    return { success: true }
  }

  /**
   * 启用插件
   */
  @Put(':id/enable')
  @Roles('ADMIN')
  @ApiOperation({ summary: '启用插件' })
  async enable(@Param('id') id: string): Promise<PluginInfo> {
    return this.pluginService.enablePlugin(id)
  }

  /**
   * 禁用插件
   */
  @Put(':id/disable')
  @Roles('ADMIN')
  @ApiOperation({ summary: '禁用插件' })
  async disable(@Param('id') id: string): Promise<PluginInfo> {
    return this.pluginService.disablePlugin(id)
  }

  /**
   * 更新插件
   */
  @Put(':id/update')
  @Roles('ADMIN')
  @ApiOperation({ summary: '更新插件' })
  async update(@Param('id') id: string): Promise<PluginInfo> {
    return this.pluginService.updatePlugin(id)
  }
}
