import { Module } from '@nestjs/common'
import { ModuleLoaderService } from '../../common/services/module-loader.service'
import { ModuleRegistryService } from '../../common/services/module-registry.service'
import { DynamicModuleController } from './dynamic-module.controller'

@Module({
  controllers: [DynamicModuleController],
  providers: [ModuleLoaderService, ModuleRegistryService],
  exports: [ModuleLoaderService, ModuleRegistryService],
})
export class DynamicModuleModule {}
