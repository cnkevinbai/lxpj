/**
 * CMS NestJS 模块包装器
 * 将热插拔CMS模块集成到 NestJS 系统
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { CmsModule } from './cms.module'
import { NewsModule } from '../news/news.module'
import { CaseModule } from '../case/case.module'
import { VideoModule } from '../video/video.module'

// ============================================
// CMS NestJS 模块
// ============================================

@Global()
@Module({
  // 导入子模块
  imports: [NewsModule, CaseModule, VideoModule],

  // 导出子模块
  exports: [NewsModule, CaseModule, VideoModule],
})
export class CmsNestModule implements OnModuleInit, OnModuleDestroy {
  private cmsModule: CmsModule

  constructor() {
    this.cmsModule = new CmsModule()
  }

  async onModuleInit() {
    console.log('[CmsNestModule] CMS NestJS 包装器初始化')
  }

  async onModuleDestroy() {
    console.log('[CmsNestModule] CMS NestJS 包装器销毁')
  }

  /**
   * 获取热插拔模块实例
   */
  getHotplugModule(): CmsModule {
    return this.cmsModule
  }
}
