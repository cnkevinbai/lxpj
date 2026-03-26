import { SetMetadata } from '@nestjs/common'

export const MODULE_METADATA = 'module:metadata'

export interface ModuleMetadataConfig {
  id: string
  name: string
  version?: string
  description?: string
  dependencies?: string[]
}

export function DynamicModule(config: ModuleMetadataConfig): ClassDecorator {
  return (target: any) => {
    SetMetadata(MODULE_METADATA, {
      id: config.id,
      name: config.name,
      version: config.version || '1.0.0',
      description: config.description,
      dependencies: config.dependencies || [],
    })(target)
  }
}
