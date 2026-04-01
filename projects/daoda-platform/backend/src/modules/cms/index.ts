/**
 * CMS 模块导出
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

export { CmsModule, CMS_MODULE_MANIFEST } from './cms.module'
export { CmsNestModule } from './cms.nest.module'

// 导出接口类型
export {
  ContentStatus,
  Language,
  ContentBase,
  ProductContent,
  ProductSpec,
  SolutionContent,
  SolutionFeature,
  VersionComparison,
  CaseContent,
  CaseMetric,
  NewsContent,
  VideoContent,
  VideoChapter,
  BannerContent,
  PageConfig,
  PageSection,
  SectionItem,
  NavConfig,
  FooterConfig,
  SocialLink,
  FooterLink,
  SEOConfig,
  Category,
  Tag,
  MediaResource,
  MediaFolder,
  WebsiteStats,
} from './cms.module'
