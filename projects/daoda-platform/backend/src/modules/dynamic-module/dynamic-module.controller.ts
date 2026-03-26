import { Controller, Get, Put, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ModuleLoaderService } from '../../common/services/module-loader.service'
import { ModuleRegistryService } from '../../common/services/module-registry.service'

@ApiTags('动态模块')
@Controller('dynamic-modules')
export class DynamicModuleController {
  constructor(
    private loader: ModuleLoaderService,
    private registry: ModuleRegistryService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取所有模块状态' })
  getAllModules() {
    return this.registry.getAllModules().map(m => ({
      id: m.id,
      name: m.name,
      version: m.version,
      enabled: m.enabled,
      loaded: this.registry.isLoaded(m.id),
      dependencies: m.dependencies,
      loadedAt: m.loadedAt,
    }))
  }

  @Get(':id/status')
  @ApiOperation({ summary: '获取模块状态' })
  getModuleStatus(@Param('id') id: string) {
    return this.loader.getModuleStatus(id)
  }

  @Put(':id/enable')
  @ApiOperation({ summary: '启用模块' })
  async enableModule(@Param('id') id: string) {
    await this.loader.enableModule(id)
    return { success: true, message: `Module ${id} enabled` }
  }

  @Put(':id/disable')
  @ApiOperation({ summary: '禁用模块' })
  async disableModule(@Param('id') id: string) {
    await this.loader.disableModule(id)
    return { success: true, message: `Module ${id} disabled` }
  }
}
