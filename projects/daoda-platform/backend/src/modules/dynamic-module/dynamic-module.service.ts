import { Injectable } from '@nestjs/common'
import { ModuleRegistryService } from '../../common/services/module-registry.service'
import { ModuleLoaderService } from '../../common/services/module-loader.service'

@Injectable()
export class DynamicModuleService {
  constructor(
    private registry: ModuleRegistryService,
    private loader: ModuleLoaderService,
  ) {}
}
