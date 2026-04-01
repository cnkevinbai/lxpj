/**
 * CRM 模块 NestJS 包装器
 * 将热插拔模块适配为 NestJS Module
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, DynamicModule, Global } from '@nestjs/common'
import { CrmModule as CrmHotPlugModule } from './crm.module'
import { CustomerModule } from '../customer/customer.module'
import { LeadModule } from '../lead/lead.module'
import { OpportunityModule } from '../opportunity/opportunity.module'
import { PrismaModule } from '../../common/prisma/prisma.module'
import { CoreModule } from '../../core/core.module'
import { MarketingAutomationModule } from './marketing-automation.module'

/**
 * CRM 聚合模块 NestJS 包装器
 *
 * 支持:
 * - 热插拔生命周期管理
 * - 子模块动态加载
 * - 配置注入
 */
@Global()
@Module({})
export class CrmNestModule {
  /**
   * 动态注册
   */
  static forRoot(options?: {
    enableCustomer?: boolean
    enableLead?: boolean
    enableOpportunity?: boolean
    enableMarketing?: boolean
  }): DynamicModule {
    const {
      enableCustomer = true,
      enableLead = true,
      enableOpportunity = true,
      enableMarketing = true,
    } = options || {}

    // 子模块列表
    const subModules: any[] = []

    if (enableCustomer) {
      subModules.push(CustomerModule)
    }
    if (enableLead) {
      subModules.push(LeadModule)
    }
    if (enableOpportunity) {
      subModules.push(OpportunityModule)
    }
    if (enableMarketing) {
      subModules.push(MarketingAutomationModule)
    }

    return {
      module: CrmNestModule,
      imports: [CoreModule, PrismaModule, ...subModules],
      providers: [
        // 热插拔模块实例
        {
          provide: 'CRM_HOTPLUG_MODULE',
          useClass: CrmHotPlugModule,
        },
      ],
      exports: [
        'CRM_HOTPLUG_MODULE',
        // 导出子模块服务（如果需要跨模块使用）
        ...subModules.flatMap((m) => m.exports || []),
      ],
    }
  }

  /**
   * 异步注册
   */
  static forRootAsync(options: {
    useFactory: (...args: any[]) =>
      | Promise<{
          enableCustomer?: boolean
          enableLead?: boolean
          enableOpportunity?: boolean
          enableMarketing?: boolean
        }>
      | {
          enableCustomer?: boolean
          enableLead?: boolean
          enableOpportunity?: boolean
          enableMarketing?: boolean
        }
    inject?: any[]
  }): DynamicModule {
    return {
      module: CrmNestModule,
      imports: [CoreModule, PrismaModule, MarketingAutomationModule],
      providers: [
        {
          provide: 'CRM_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: 'CRM_HOTPLUG_MODULE',
          useClass: CrmHotPlugModule,
        },
      ],
      exports: ['CRM_HOTPLUG_MODULE'],
    }
  }
}
