import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateModuleConfigDto, UpdateModuleConfigDto, ModuleConfigQueryDto } from './module-config.dto'
import { Prisma } from '@prisma/client'

const DEFAULT_MODULES = [
  { moduleCode: 'auth', moduleName: '认证管理', enabled: true, sortOrder: 0 },
  { moduleCode: 'crm', moduleName: 'CRM管理', enabled: true, sortOrder: 1 },
  { moduleCode: 'erp', moduleName: 'ERP管理', enabled: true, sortOrder: 2 },
  { moduleCode: 'finance', moduleName: '财务管理', enabled: true, sortOrder: 3 },
  { moduleCode: 'hr', moduleName: '人事管理', enabled: true, sortOrder: 4 },
  { moduleCode: 'service', moduleName: '售后服务', enabled: true, sortOrder: 5 },
  { moduleCode: 'cms', moduleName: '内容管理', enabled: true, sortOrder: 6 },
  { moduleCode: 'settings', moduleName: '系统设置', enabled: true, sortOrder: 99 },
]

@Injectable()
export class ModuleConfigService {
  private readonly logger = new Logger(ModuleConfigService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 初始化默认模块配置
   */
  async initializeDefaults(): Promise<void> {
    for (const module of DEFAULT_MODULES) {
      const existing = await this.prisma.moduleConfig.findUnique({
        where: { moduleCode: module.moduleCode },
      })
      if (!existing) {
        await this.prisma.moduleConfig.create({
          data: {
            moduleCode: module.moduleCode,
            moduleName: module.moduleName,
            enabled: module.enabled,
            sortOrder: module.sortOrder,
          },
        })
        this.logger.log(`初始化模块配置: ${module.moduleName}`)
      }
    }
  }

  /**
   * 创建模块配置
   */
  async create(dto: CreateModuleConfigDto) {
    const existing = await this.prisma.moduleConfig.findUnique({
      where: { moduleCode: dto.moduleCode },
    })

    if (existing) {
      throw new ConflictException(`模块 ${dto.moduleName} 已存在`)
    }

    return this.prisma.moduleConfig.create({
      data: {
        moduleCode: dto.moduleCode,
        moduleName: dto.moduleName,
        enabled: dto.enabled ?? true,
        description: dto.description,
        config: dto.config,
        sortOrder: dto.sortOrder ?? 0,
      },
    })
  }

  /**
   * 获取所有模块配置
   */
  async findAll(query?: ModuleConfigQueryDto) {
    const enabled = query?.enabled
    const where: Prisma.ModuleConfigWhereInput = {}
    if (enabled !== undefined) {
      where.enabled = enabled
    }

    const list = await this.prisma.moduleConfig.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return { list, total: list.length }
  }

  /**
   * 根据模块代码获取配置
   */
  async findByCode(moduleCode: string) {
    const config = await this.prisma.moduleConfig.findUnique({
      where: { moduleCode },
    })

    if (!config) {
      throw new NotFoundException(`模块 ${moduleCode} 配置不存在`)
    }

    return config
  }

  /**
   * 获取所有启用的模块
   */
  async getEnabledModules() {
    return this.prisma.moduleConfig.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: 'asc' },
    })
  }

  /**
   * 更新模块配置
   */
  async update(moduleCode: string, dto: UpdateModuleConfigDto) {
    const existing = await this.prisma.moduleConfig.findUnique({
      where: { moduleCode },
    })

    if (!existing) {
      throw new NotFoundException(`模块 ${moduleCode} 配置不存在`)
    }

    return this.prisma.moduleConfig.update({
      where: { moduleCode },
      data: {
        moduleName: dto.moduleName,
        enabled: dto.enabled,
        description: dto.description,
        config: dto.config,
        sortOrder: dto.sortOrder,
      },
    })
  }

  /**
   * 切换模块启用状态
   */
  async toggle(moduleCode: string, enabled: boolean) {
    const existing = await this.prisma.moduleConfig.findUnique({
      where: { moduleCode },
    })

    if (!existing) {
      throw new NotFoundException(`模块 ${moduleCode} 配置不存在`)
    }

    return this.prisma.moduleConfig.update({
      where: { moduleCode },
      data: { enabled },
    })
  }

  /**
   * 删除模块配置
   */
  async delete(moduleCode: string) {
    const existing = await this.prisma.moduleConfig.findUnique({
      where: { moduleCode },
    })

    if (!existing) {
      throw new NotFoundException(`模块 ${moduleCode} 配置不存在`)
    }

    await this.prisma.moduleConfig.delete({
      where: { moduleCode },
    })

    return { message: `模块 ${existing.moduleName} 配置已删除` }
  }
}
