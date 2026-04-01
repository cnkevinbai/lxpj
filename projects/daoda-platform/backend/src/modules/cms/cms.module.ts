/**
 * CMS 模块定义
 * 热插拔模块 - 内容管理系统，全站内容自定义管理
 *
 * 支持前端对外门户所有功能和内容的自定义管理
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { BaseModule } from '../../core/module/base-module'
import {
  ModuleManifest,
  ModuleContext,
  HotUpdateStrategy,
  ModuleMenuItem,
} from '../../core/module/interfaces'
import { HttpMethod, ModuleRoute } from '../../core/module/interfaces/module-route.interface'
import {
  ModulePermission,
  PermissionType,
} from '../../core/module/interfaces/module-permission.interface'
import { ModuleEvent, EventType } from '../../core/module/interfaces/module-event.interface'

// ============================================
// 模块清单定义
// ============================================

export const CMS_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/cms',
  name: '内容管理系统',
  version: '1.0.0',
  description: 'CMS内容管理模块，管理网站所有内容、页面、媒体、SEO等',

  // 分类
  category: 'business',
  tags: ['cms', 'content', 'website', 'news', 'case', 'product', 'solution', 'media', 'seo'],

  // 依赖
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
    { id: '@daoda/settings', version: '>=1.0.0', optional: true },
  ],

  // 权限声明
  permissions: [
    'cms:content:view',
    'cms:content:create',
    'cms:content:update',
    'cms:content:delete',
    'cms:content:publish',
    'cms:product:view',
    'cms:product:create',
    'cms:product:update',
    'cms:product:delete',
    'cms:product:publish',
    'cms:solution:view',
    'cms:solution:create',
    'cms:solution:update',
    'cms:solution:delete',
    'cms:case:view',
    'cms:case:create',
    'cms:case:update',
    'cms:case:delete',
    'cms:news:view',
    'cms:news:create',
    'cms:news:update',
    'cms:news:delete',
    'cms:news:publish',
    'cms:video:view',
    'cms:video:create',
    'cms:video:update',
    'cms:video:delete',
    'cms:media:view',
    'cms:media:upload',
    'cms:media:delete',
    'cms:page:view',
    'cms:page:update',
    'cms:page:design',
    'cms:seo:view',
    'cms:seo:update',
    'cms:category:view',
    'cms:category:create',
    'cms:category:update',
    'cms:category:delete',
    'cms:tag:view',
    'cms:tag:create',
    'cms:tag:update',
    'cms:tag:delete',
    'cms:banner:view',
    'cms:banner:create',
    'cms:banner:update',
    'cms:banner:delete',
    'cms:nav:view',
    'cms:nav:update',
    'cms:footer:view',
    'cms:footer:update',
    'cms:stat:view',
    'cms:admin:all',
  ],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },

  // 技术信息
  routePrefix: '/api/v1/cms',
  tablePrefix: 'cms_',
}

// ============================================
// 内容实体接口定义
// ============================================

/**
 * 内容状态枚举
 */
export enum ContentStatus {
  DRAFT = 'draft', // 草稿
  REVIEW = 'review', // 待审核
  PUBLISHED = 'published', // 已发布
  ARCHIVED = 'archived', // 已归档
}

/**
 * 语言枚举
 */
export enum Language {
  ZH = 'zh',
  EN = 'en',
}

/**
 * 内容基础接口
 */
export interface ContentBase {
  id: string
  title: string
  titleEn?: string
  slug: string
  summary?: string
  summaryEn?: string
  content?: string
  contentEn?: string
  thumbnail?: string
  images?: string[]
  videos?: string[]
  category?: string
  tags?: string[]
  status: ContentStatus
  language: Language
  seoTitle?: string
  seoTitleEn?: string
  seoDescription?: string
  seoDescriptionEn?: string
  seoKeywords?: string[]
  seoKeywordsEn?: string[]
  authorId?: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  viewCount: number
  likeCount: number
  sortOrder?: number
  isFeatured?: boolean
  isTop?: boolean
}

/**
 * 产品内容
 */
export interface ProductContent extends ContentBase {
  // 基本信息
  productCode: string // 产品编码
  productLine: string // 产品线 (sightseeing, golf, vintage, utility)
  brand?: string // 品牌

  // 价格信息
  price?: number // 价格
  priceUnit?: string // 价格单位
  originalPrice?: number // 原价
  currency?: string // 货币

  // 规格参数
  specs?: ProductSpec[] // 规格列表
  features?: string[] // 特性列表
  highlights?: string[] // 亮点

  // 标签
  tag?: string // 标签（城市首选、热销、高端等）
  isNew?: boolean // 是否新品
  isHot?: boolean // 是否热销

  // 关联
  relatedProducts?: string[] // 相关产品
  accessories?: string[] // 配件
  documents?: string[] // 文档
}

/**
 * 产品规格
 */
export interface ProductSpec {
  name: string
  nameEn?: string
  value: string
  valueEn?: string
  unit?: string
  icon?: string
}

/**
 * 解决方案内容
 */
export interface SolutionContent extends ContentBase {
  // 基本信息
  industry: string // 行业 (tourism, golf, realty, industrial, campus, park)
  version?: string // 版本 (starter, professional, enterprise)

  // 内容
  scenarios?: string[] // 应用场景
  architecture?: string // 技术架构描述
  benefits?: string[] // 收益
  features?: SolutionFeature[] // 功能特性

  // 版本对比
  comparison?: VersionComparison[]

  // 关联
  relatedProducts?: string[] // 相关产品
  relatedCases?: string[] // 相关案例
}

/**
 * 方案功能
 */
export interface SolutionFeature {
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  icon?: string
  included?: boolean[] // 各版本是否包含
}

/**
 * 版本对比
 */
export interface VersionComparison {
  name: string
  starter: string | boolean
  professional: string | boolean
  enterprise: string | boolean
}

/**
 * 成功案例内容
 */
export interface CaseContent extends ContentBase {
  // 基本信息
  industry: string // 行业 (finance, health, tech, retail, service, industrial, education)
  region?: string // 区域 (global, na, eu, apac)
  company: string // 公司名称
  companyEn?: string

  // 内容
  challenge?: string // 挑战
  solution?: string // 解决方案
  results?: string // 结果

  // 关键指标
  metrics?: CaseMetric[]

  // 客户信息
  clientLogo?: string
  clientName?: string
  clientPosition?: string
  clientQuote?: string // 客户评价

  // 关联
  relatedSolution?: string
  relatedProducts?: string[]
}

/**
 * 案例指标
 */
export interface CaseMetric {
  value: string
  label: string
  labelEn?: string
  trend?: 'up' | 'down' | 'neutral'
}

/**
 * 新闻内容
 */
export interface NewsContent extends ContentBase {
  // 基本信息
  newsType: string // 类型 (company, industry, event)

  // 内容
  source?: string // 来源
  author?: string // 作者

  // 多媒体
  gallery?: string[] // 图片画廊
  attachments?: string[] // 附件

  // 互动
  commentCount?: number
  shareCount?: number

  // 发布信息
  publishChannel?: string[] // 发布渠道
}

/**
 * 视频内容
 */
export interface VideoContent extends ContentBase {
  // 基本信息
  videoType: string // 类型 (product, solution, case, tutorial, corporate)

  // 视频信息
  videoUrl?: string // 视频URL
  videoPlatform?: string // 平台 (youtube, vimeo, local)
  videoId?: string // 平台ID
  duration?: number // 时长(秒)
  resolution?: string // 分辨率

  // 内容
  transcript?: string // 文字稿
  chapters?: VideoChapter[]

  // 关联
  relatedProducts?: string[]
  relatedContent?: string[]
}

/**
 * 视频章节
 */
export interface VideoChapter {
  title: string
  startTime: number
  endTime: number
}

/**
 * Banner/广告内容
 */
export interface BannerContent {
  id: string
  title: string
  titleEn?: string
  subtitle?: string
  subtitleEn?: string
  image?: string
  imageEn?: string
  link?: string
  linkEn?: string
  buttonText?: string
  buttonTextEn?: string
  position: string // 位置 (hero, home-top, product, news)
  sortOrder: number
  isActive: boolean
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * 页面配置
 */
export interface PageConfig {
  id: string
  pageType: string // 页面类型 (home, about, products, solutions, cases, news, services, contact)

  // Hero区
  heroTag?: string
  heroTagEn?: string
  heroTitle?: string
  heroTitleEn?: string
  heroTitleHighlight?: string
  heroTitleHighlightEn?: string
  heroDesc?: string
  heroDescEn?: string
  heroButtonText?: string
  heroButtonTextEn?: string
  heroButtonLink?: string
  heroSecondaryButtonText?: string
  heroSecondaryButtonTextEn?: string
  heroImage?: string
  heroVideo?: string

  // 内容区配置
  sections?: PageSection[]

  // SEO
  seoTitle?: string
  seoTitleEn?: string
  seoDescription?: string
  seoDescriptionEn?: string
  seoKeywords?: string[]
  seoKeywordsEn?: string[]

  // 其他
  customCss?: string
  customJs?: string
  layout?: string
  theme?: string

  updatedAt: Date
}

/**
 * 页面区块
 */
export interface PageSection {
  id: string
  type: string // 类型 (stats, products, digital, global, timeline, culture, etc)
  title?: string
  titleEn?: string
  desc?: string
  descEn?: string
  tag?: string
  tagEn?: string
  items?: SectionItem[]
  config?: Record<string, any>
  sortOrder: number
  isActive: boolean
}

/**
 * 区块项
 */
export interface SectionItem {
  id: string
  type?: string
  title?: string
  titleEn?: string
  desc?: string
  descEn?: string
  value?: string
  valueEn?: string
  icon?: string
  image?: string
  link?: string
  sortOrder: number
}

/**
 * 导航配置
 */
export interface NavConfig {
  id: string
  name: string
  nameEn?: string
  link: string
  icon?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  isExternal?: boolean
  children?: NavConfig[]
}

/**
 * Footer配置
 */
export interface FooterConfig {
  id: string

  // 品牌区
  brandDesc?: string
  brandDescEn?: string
  socialLinks?: SocialLink[]

  // 产品链接
  productLinks?: FooterLink[]

  // 方案链接
  solutionLinks?: FooterLink[]

  // 订阅区
  newsletterTitle?: string
  newsletterTitleEn?: string
  newsletterDesc?: string
  newsletterDescEn?: string

  // 底部
  copyright?: string
  copyrightEn?: string
  legalLinks?: FooterLink[]

  updatedAt: Date
}

/**
 * 社交链接
 */
export interface SocialLink {
  platform: string // wechat, weibo, twitter, linkedin, facebook
  url: string
  icon?: string
}

/**
 * Footer链接
 */
export interface FooterLink {
  title: string
  titleEn?: string
  link: string
  sortOrder: number
}

/**
 * SEO配置
 */
export interface SEOConfig {
  id: string
  pageType?: string // 全局或特定页面

  // 基础SEO
  siteName?: string
  siteNameEn?: string
  siteDescription?: string
  siteDescriptionEn?: string
  siteKeywords?: string[]
  siteKeywordsEn?: string[]

  // Open Graph
  ogTitle?: string
  ogTitleEn?: string
  ogDescription?: string
  ogDescriptionEn?: string
  ogImage?: string
  ogType?: string

  // Twitter Card
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterSite?: string

  // 结构化数据
  structuredData?: string

  // 其他
  canonicalUrl?: string
  robots?: string

  updatedAt: Date
}

/**
 * 分类
 */
export interface Category {
  id: string
  type: string // 类型 (product, solution, case, news, video)
  name: string
  nameEn?: string
  slug: string
  desc?: string
  descEn?: string
  icon?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * 标签
 */
export interface Tag {
  id: string
  name: string
  nameEn?: string
  slug: string
  type?: string // 类型
  color?: string
  icon?: string
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

/**
 * 媒体资源
 */
export interface MediaResource {
  id: string
  type: string // 类型 (image, video, document, audio)
  name: string
  originalName?: string
  path: string
  url: string
  size?: number // 文件大小(bytes)
  mimeType?: string
  width?: number // 图片宽度
  height?: number // 图片高度
  duration?: number // 视频时长(秒)
  alt?: string
  altEn?: string
  title?: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  tags?: string[]
  folderId?: string
  uploadedBy?: string
  uploadedAt: Date
  updatedAt: Date
  usageCount: number
}

/**
 * 媒体文件夹
 */
export interface MediaFolder {
  id: string
  name: string
  nameEn?: string
  parentId?: string
  path: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

/**
 * 网站统计
 */
export interface WebsiteStats {
  // 访问统计
  totalVisits: number
  uniqueVisitors: number
  pageViews: number
  avgSessionDuration: number
  bounceRate: number

  // 内容统计
  totalProducts: number
  publishedProducts: number
  totalCases: number
  publishedCases: number
  totalNews: number
  publishedNews: number
  totalVideos: number
  publishedVideos: number

  // 互动统计
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number

  // 时间维度
  period: string // daily, weekly, monthly
  date: Date
}

// ============================================
// CMS 模块实现
// ============================================

/**
 * CMS 内容管理模块
 * 全站内容自定义管理
 */
export class CmsModule extends BaseModule {
  // 模块清单
  readonly manifest = CMS_MODULE_MANIFEST

  // ============================================
  // 生命周期钩子
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('CMS模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        await prisma.cmsProduct.findFirst()
        await prisma.cmsSolution.findFirst()
        await prisma.cmsCase.findFirst()
        await prisma.cmsNews.findFirst()
        await prisma.cmsVideo.findFirst()
        await prisma.cmsBanner.findFirst()
        await prisma.cmsPageConfig.findFirst()
        await prisma.cmsCategory.findFirst()
        await prisma.cmsTag.findFirst()
        await prisma.cmsMedia.findFirst()
        this.logger?.info('CMS数据表验证成功')
      } catch (error) {
        this.logger?.warn('CMS数据表可能不存在，需要初始化')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      // 内容配置
      content: {
        defaultLanguage: 'zh',
        supportedLanguages: ['zh', 'en'],
        autoSlug: true,
        autoDraft: true,
        requireApproval: true,
        maxRevisions: 10,
      },
      // 产品配置
      product: {
        sequencePrefix: 'PRD',
        autoNumber: true,
        defaultStatus: 'draft',
        priceCurrency: 'CNY',
        categories: ['sightseeing', 'golf', 'vintage', 'utility'],
      },
      // 方案配置
      solution: {
        industries: ['tourism', 'golf', 'realty', 'industrial', 'campus', 'park'],
        versions: ['starter', 'professional', 'enterprise'],
      },
      // 案例配置
      case: {
        industries: ['finance', 'health', 'tech', 'retail', 'service', 'industrial', 'education'],
        regions: ['global', 'na', 'eu', 'apac'],
      },
      // 新闻配置
      news: {
        types: ['company', 'industry', 'event'],
        autoPublish: false,
        retentionDays: 365,
        maxPerPage: 20,
      },
      // 视频配置
      video: {
        types: ['product', 'solution', 'case', 'tutorial', 'corporate'],
        platforms: ['youtube', 'vimeo', 'local'],
        maxDuration: 3600,
      },
      // 媒体配置
      media: {
        maxSize: 10485760, // 10MB
        allowedTypes: ['image', 'video', 'document'],
        imageFormats: ['jpg', 'png', 'gif', 'webp'],
        videoFormats: ['mp4', 'webm', 'mov'],
        documentFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
        storage: 'local',
      },
      // SEO配置
      seo: {
        autoGenerate: true,
        titleMaxLength: 60,
        descMaxLength: 160,
        keywordsMaxCount: 10,
        ogEnabled: true,
        twitterEnabled: true,
        structuredDataEnabled: true,
      },
      // Banner配置
      banner: {
        positions: ['hero', 'home-top', 'product', 'news', 'contact'],
        maxActive: 5,
        autoRotate: true,
        rotateInterval: 5000,
      },
      // 导航配置
      nav: {
        maxLevel: 2,
        cacheEnabled: true,
        defaultItems: [
          { name: '首页', link: '/' },
          { name: '产品中心', link: '/products' },
          { name: '智慧方案', link: '/solutions' },
          { name: '成功案例', link: '/cases' },
          { name: '新闻动态', link: '/news' },
          { name: '全球服务', link: '/services' },
          { name: '关于道达', link: '/about' },
        ],
      },
      // 统计配置
      stats: {
        trackVisits: true,
        trackPageViews: true,
        retentionDays: 90,
        aggregateInterval: 'daily',
      },
    })

    this.logger?.info('CMS模块安装完成')
  }

  /**
   * 初始化钩子
   */
  async onInit(): Promise<void> {
    await super.onInit()

    this.logger?.info('CMS模块初始化...')

    // 注册内部服务
    this._context?.serviceRegistry.register(this.manifest.id, 'product', {
      service: 'product',
      methods: [
        'create',
        'update',
        'delete',
        'publish',
        'archive',
        'getList',
        'getDetail',
        'getByCategory',
        'search',
        'getStats',
      ],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'solution', {
      service: 'solution',
      methods: [
        'create',
        'update',
        'delete',
        'getList',
        'getDetail',
        'getByIndustry',
        'getComparison',
        'getStats',
      ],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'case', {
      service: 'case',
      methods: [
        'create',
        'update',
        'delete',
        'getList',
        'getDetail',
        'getByIndustry',
        'getFeatured',
        'getStats',
      ],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'news', {
      service: 'news',
      methods: [
        'create',
        'update',
        'delete',
        'publish',
        'archive',
        'getList',
        'getDetail',
        'getByType',
        'search',
        'getStats',
      ],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'video', {
      service: 'video',
      methods: ['create', 'update', 'delete', 'getList', 'getDetail', 'getByType', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'banner', {
      service: 'banner',
      methods: ['create', 'update', 'delete', 'getList', 'getActive', 'getByPosition', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'page', {
      service: 'page',
      methods: ['getConfig', 'updateConfig', 'getSection', 'updateSection', 'getList', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'seo', {
      service: 'seo',
      methods: [
        'getConfig',
        'updateConfig',
        'generateMeta',
        'generateOG',
        'generateStructuredData',
        'getStats',
      ],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'category', {
      service: 'category',
      methods: ['create', 'update', 'delete', 'getList', 'getTree', 'getByType', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'tag', {
      service: 'tag',
      methods: ['create', 'update', 'delete', 'getList', 'getPopular', 'search', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'media', {
      service: 'media',
      methods: [
        'upload',
        'delete',
        'getList',
        'getDetail',
        'search',
        'getFolder',
        'createFolder',
        'deleteFolder',
        'move',
        'getStats',
      ],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'nav', {
      service: 'nav',
      methods: ['getConfig', 'updateConfig', 'getTree', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'footer', {
      service: 'footer',
      methods: ['getConfig', 'updateConfig', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'stat', {
      service: 'stat',
      methods: [
        'track',
        'getDaily',
        'getWeekly',
        'getMonthly',
        'getContentStats',
        'getInteractionStats',
      ],
    })

    this.logger?.info('CMS模块服务注册完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('CMS模块启动...')

    // 发送启动事件
    this.eventBus?.emit('cms.started', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
      timestamp: new Date().toISOString(),
    })

    // 检查待发布内容
    await this.checkScheduledPublish()

    // 检查过期Banner
    await this.checkExpiredBanners()

    // 检查过期内容归档
    await this.checkContentArchive()

    this.logger?.info('CMS模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('CMS模块停止...')

    // 发送停止事件
    this.eventBus?.emit('cms.stopped', {
      moduleId: this.manifest.id,
      timestamp: new Date().toISOString(),
    })

    this.logger?.info('CMS模块已停止')
  }

  /**
   * 卸载钩子
   */
  async onUninstall(): Promise<void> {
    await super.onUninstall()

    this.logger?.info('CMS模块卸载...')

    // 清理服务注册
    this._context?.serviceRegistry.unregister(this.manifest.id, 'product')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'solution')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'case')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'news')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'video')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'banner')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'page')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'seo')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'category')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'tag')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'media')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'nav')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'footer')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'stat')

    this.logger?.info('CMS模块已卸载')
  }

  /**
   * 健康检查
   */
  async onHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    details: any
    timestamp: number
  }> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')

    const checks = {
      database: false,
      productService: false,
      solutionService: false,
      caseService: false,
      newsService: false,
      videoService: false,
      bannerService: false,
      pageService: false,
      seoService: false,
      categoryService: false,
      tagService: false,
      mediaService: false,
      navService: false,
      footerService: false,
      statService: false,
    }

    try {
      // 检查数据库连接
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
      }

      // 检查服务注册
      checks.productService = this._context?.serviceRegistry.get('product') !== undefined
      checks.solutionService = this._context?.serviceRegistry.get('solution') !== undefined
      checks.caseService = this._context?.serviceRegistry.get('case') !== undefined
      checks.newsService = this._context?.serviceRegistry.get('news') !== undefined
      checks.videoService = this._context?.serviceRegistry.get('video') !== undefined
      checks.bannerService = this._context?.serviceRegistry.get('banner') !== undefined
      checks.pageService = this._context?.serviceRegistry.get('page') !== undefined
      checks.seoService = this._context?.serviceRegistry.get('seo') !== undefined
      checks.categoryService = this._context?.serviceRegistry.get('category') !== undefined
      checks.tagService = this._context?.serviceRegistry.get('tag') !== undefined
      checks.mediaService = this._context?.serviceRegistry.get('media') !== undefined
      checks.navService = this._context?.serviceRegistry.get('nav') !== undefined
      checks.footerService = this._context?.serviceRegistry.get('footer') !== undefined
      checks.statService = this._context?.serviceRegistry.get('stat') !== undefined
    } catch (error) {
      this.logger?.error('CMS健康检查失败', error)
    }

    const healthyCount = Object.values(checks).filter(Boolean).length
    const status: 'healthy' | 'degraded' | 'unhealthy' =
      healthyCount === 15 ? 'healthy' : healthyCount >= 10 ? 'degraded' : 'unhealthy'

    return {
      status,
      details: {
        checks,
        healthyCount,
        totalCount: 15,
      },
      timestamp: Date.now(),
    }
  }

  // ============================================
  // 扩展点注册
  // ============================================

  /**
   * 获取路由定义
   */
  getRoutes(): ModuleRoute[] {
    return [
      // ===== 产品管理 API =====
      {
        path: '/product',
        method: HttpMethod.GET,
        handler: 'product.list',
        description: '产品列表查询',
        permission: 'cms:product:view',
      },
      {
        path: '/product/:id',
        method: HttpMethod.GET,
        handler: 'product.detail',
        description: '产品详情',
        permission: 'cms:product:view',
      },
      {
        path: '/product',
        method: HttpMethod.POST,
        handler: 'product.create',
        description: '创建产品',
        permission: 'cms:product:create',
      },
      {
        path: '/product/:id',
        method: HttpMethod.PUT,
        handler: 'product.update',
        description: '更新产品',
        permission: 'cms:product:update',
      },
      {
        path: '/product/:id',
        method: HttpMethod.DELETE,
        handler: 'product.delete',
        description: '删除产品',
        permission: 'cms:product:delete',
      },
      {
        path: '/product/:id/publish',
        method: HttpMethod.POST,
        handler: 'product.publish',
        description: '发布产品',
        permission: 'cms:product:publish',
      },
      {
        path: '/product/:id/archive',
        method: HttpMethod.POST,
        handler: 'product.archive',
        description: '归档产品',
        permission: 'cms:product:update',
      },
      {
        path: '/product/category/:category',
        method: HttpMethod.GET,
        handler: 'product.byCategory',
        description: '按分类查询产品',
        permission: 'cms:product:view',
      },
      {
        path: '/product/search',
        method: HttpMethod.GET,
        handler: 'product.search',
        description: '搜索产品',
        permission: 'cms:product:view',
      },
      {
        path: '/product/stats',
        method: HttpMethod.GET,
        handler: 'product.stats',
        description: '产品统计',
        permission: 'cms:stat:view',
      },

      // ===== 解决方案管理 API =====
      {
        path: '/solution',
        method: HttpMethod.GET,
        handler: 'solution.list',
        description: '方案列表查询',
        permission: 'cms:solution:view',
      },
      {
        path: '/solution/:id',
        method: HttpMethod.GET,
        handler: 'solution.detail',
        description: '方案详情',
        permission: 'cms:solution:view',
      },
      {
        path: '/solution',
        method: HttpMethod.POST,
        handler: 'solution.create',
        description: '创建方案',
        permission: 'cms:solution:create',
      },
      {
        path: '/solution/:id',
        method: HttpMethod.PUT,
        handler: 'solution.update',
        description: '更新方案',
        permission: 'cms:solution:update',
      },
      {
        path: '/solution/:id',
        method: HttpMethod.DELETE,
        handler: 'solution.delete',
        description: '删除方案',
        permission: 'cms:solution:delete',
      },
      {
        path: '/solution/industry/:industry',
        method: HttpMethod.GET,
        handler: 'solution.byIndustry',
        description: '按行业查询方案',
        permission: 'cms:solution:view',
      },
      {
        path: '/solution/comparison',
        method: HttpMethod.GET,
        handler: 'solution.comparison',
        description: '方案版本对比',
        permission: 'cms:solution:view',
      },
      {
        path: '/solution/stats',
        method: HttpMethod.GET,
        handler: 'solution.stats',
        description: '方案统计',
        permission: 'cms:stat:view',
      },

      // ===== 成功案例管理 API =====
      {
        path: '/case',
        method: HttpMethod.GET,
        handler: 'case.list',
        description: '案例列表查询',
        permission: 'cms:case:view',
      },
      {
        path: '/case/:id',
        method: HttpMethod.GET,
        handler: 'case.detail',
        description: '案例详情',
        permission: 'cms:case:view',
      },
      {
        path: '/case',
        method: HttpMethod.POST,
        handler: 'case.create',
        description: '创建案例',
        permission: 'cms:case:create',
      },
      {
        path: '/case/:id',
        method: HttpMethod.PUT,
        handler: 'case.update',
        description: '更新案例',
        permission: 'cms:case:update',
      },
      {
        path: '/case/:id',
        method: HttpMethod.DELETE,
        handler: 'case.delete',
        description: '删除案例',
        permission: 'cms:case:delete',
      },
      {
        path: '/case/industry/:industry',
        method: HttpMethod.GET,
        handler: 'case.byIndustry',
        description: '按行业查询案例',
        permission: 'cms:case:view',
      },
      {
        path: '/case/featured',
        method: HttpMethod.GET,
        handler: 'case.featured',
        description: '精选案例',
        permission: 'cms:case:view',
      },
      {
        path: '/case/stats',
        method: HttpMethod.GET,
        handler: 'case.stats',
        description: '案例统计',
        permission: 'cms:stat:view',
      },

      // ===== 新闻管理 API =====
      {
        path: '/news',
        method: HttpMethod.GET,
        handler: 'news.list',
        description: '新闻列表查询',
        permission: 'cms:news:view',
      },
      {
        path: '/news/:id',
        method: HttpMethod.GET,
        handler: 'news.detail',
        description: '新闻详情',
        permission: 'cms:news:view',
      },
      {
        path: '/news',
        method: HttpMethod.POST,
        handler: 'news.create',
        description: '创建新闻',
        permission: 'cms:news:create',
      },
      {
        path: '/news/:id',
        method: HttpMethod.PUT,
        handler: 'news.update',
        description: '更新新闻',
        permission: 'cms:news:update',
      },
      {
        path: '/news/:id',
        method: HttpMethod.DELETE,
        handler: 'news.delete',
        description: '删除新闻',
        permission: 'cms:news:delete',
      },
      {
        path: '/news/:id/publish',
        method: HttpMethod.POST,
        handler: 'news.publish',
        description: '发布新闻',
        permission: 'cms:news:publish',
      },
      {
        path: '/news/:id/archive',
        method: HttpMethod.POST,
        handler: 'news.archive',
        description: '归档新闻',
        permission: 'cms:news:update',
      },
      {
        path: '/news/type/:type',
        method: HttpMethod.GET,
        handler: 'news.byType',
        description: '按类型查询新闻',
        permission: 'cms:news:view',
      },
      {
        path: '/news/search',
        method: HttpMethod.GET,
        handler: 'news.search',
        description: '搜索新闻',
        permission: 'cms:news:view',
      },
      {
        path: '/news/stats',
        method: HttpMethod.GET,
        handler: 'news.stats',
        description: '新闻统计',
        permission: 'cms:stat:view',
      },

      // ===== 视频管理 API =====
      {
        path: '/video',
        method: HttpMethod.GET,
        handler: 'video.list',
        description: '视频列表查询',
        permission: 'cms:video:view',
      },
      {
        path: '/video/:id',
        method: HttpMethod.GET,
        handler: 'video.detail',
        description: '视频详情',
        permission: 'cms:video:view',
      },
      {
        path: '/video',
        method: HttpMethod.POST,
        handler: 'video.create',
        description: '创建视频',
        permission: 'cms:video:create',
      },
      {
        path: '/video/:id',
        method: HttpMethod.PUT,
        handler: 'video.update',
        description: '更新视频',
        permission: 'cms:video:update',
      },
      {
        path: '/video/:id',
        method: HttpMethod.DELETE,
        handler: 'video.delete',
        description: '删除视频',
        permission: 'cms:video:delete',
      },
      {
        path: '/video/type/:type',
        method: HttpMethod.GET,
        handler: 'video.byType',
        description: '按类型查询视频',
        permission: 'cms:video:view',
      },
      {
        path: '/video/stats',
        method: HttpMethod.GET,
        handler: 'video.stats',
        description: '视频统计',
        permission: 'cms:stat:view',
      },

      // ===== Banner管理 API =====
      {
        path: '/banner',
        method: HttpMethod.GET,
        handler: 'banner.list',
        description: 'Banner列表查询',
        permission: 'cms:banner:view',
      },
      {
        path: '/banner/:id',
        method: HttpMethod.GET,
        handler: 'banner.detail',
        description: 'Banner详情',
        permission: 'cms:banner:view',
      },
      {
        path: '/banner',
        method: HttpMethod.POST,
        handler: 'banner.create',
        description: '创建Banner',
        permission: 'cms:banner:create',
      },
      {
        path: '/banner/:id',
        method: HttpMethod.PUT,
        handler: 'banner.update',
        description: '更新Banner',
        permission: 'cms:banner:update',
      },
      {
        path: '/banner/:id',
        method: HttpMethod.DELETE,
        handler: 'banner.delete',
        description: '删除Banner',
        permission: 'cms:banner:delete',
      },
      {
        path: '/banner/active',
        method: HttpMethod.GET,
        handler: 'banner.active',
        description: '活动Banner列表',
        permission: 'cms:banner:view',
      },
      {
        path: '/banner/position/:position',
        method: HttpMethod.GET,
        handler: 'banner.byPosition',
        description: '按位置查询Banner',
        permission: 'cms:banner:view',
      },
      {
        path: '/banner/stats',
        method: HttpMethod.GET,
        handler: 'banner.stats',
        description: 'Banner统计',
        permission: 'cms:stat:view',
      },

      // ===== 页面配置 API =====
      {
        path: '/page',
        method: HttpMethod.GET,
        handler: 'page.list',
        description: '页面配置列表',
        permission: 'cms:page:view',
      },
      {
        path: '/page/:pageType',
        method: HttpMethod.GET,
        handler: 'page.getConfig',
        description: '获取页面配置',
        permission: 'cms:page:view',
      },
      {
        path: '/page/:pageType',
        method: HttpMethod.PUT,
        handler: 'page.updateConfig',
        description: '更新页面配置',
        permission: 'cms:page:update',
      },
      {
        path: '/page/:pageType/section/:sectionId',
        method: HttpMethod.GET,
        handler: 'page.getSection',
        description: '获取页面区块',
        permission: 'cms:page:view',
      },
      {
        path: '/page/:pageType/section/:sectionId',
        method: HttpMethod.PUT,
        handler: 'page.updateSection',
        description: '更新页面区块',
        permission: 'cms:page:update',
      },
      {
        path: '/page/:pageType/design',
        method: HttpMethod.POST,
        handler: 'page.design',
        description: '页面设计',
        permission: 'cms:page:design',
      },
      {
        path: '/page/stats',
        method: HttpMethod.GET,
        handler: 'page.stats',
        description: '页面统计',
        permission: 'cms:stat:view',
      },

      // ===== SEO配置 API =====
      {
        path: '/seo',
        method: HttpMethod.GET,
        handler: 'seo.getConfig',
        description: '获取SEO配置',
        permission: 'cms:seo:view',
      },
      {
        path: '/seo',
        method: HttpMethod.PUT,
        handler: 'seo.updateConfig',
        description: '更新SEO配置',
        permission: 'cms:seo:update',
      },
      {
        path: '/seo/:pageType',
        method: HttpMethod.GET,
        handler: 'seo.getByPage',
        description: '按页面获取SEO',
        permission: 'cms:seo:view',
      },
      {
        path: '/seo/generate/meta',
        method: HttpMethod.POST,
        handler: 'seo.generateMeta',
        description: '生成Meta标签',
        permission: 'cms:seo:view',
      },
      {
        path: '/seo/generate/og',
        method: HttpMethod.POST,
        handler: 'seo.generateOG',
        description: '生成Open Graph',
        permission: 'cms:seo:view',
      },
      {
        path: '/seo/generate/structured',
        method: HttpMethod.POST,
        handler: 'seo.generateStructuredData',
        description: '生成结构化数据',
        permission: 'cms:seo:view',
      },
      {
        path: '/seo/stats',
        method: HttpMethod.GET,
        handler: 'seo.stats',
        description: 'SEO统计',
        permission: 'cms:stat:view',
      },

      // ===== 分类管理 API =====
      {
        path: '/category',
        method: HttpMethod.GET,
        handler: 'category.list',
        description: '分类列表查询',
        permission: 'cms:category:view',
      },
      {
        path: '/category/:id',
        method: HttpMethod.GET,
        handler: 'category.detail',
        description: '分类详情',
        permission: 'cms:category:view',
      },
      {
        path: '/category',
        method: HttpMethod.POST,
        handler: 'category.create',
        description: '创建分类',
        permission: 'cms:category:create',
      },
      {
        path: '/category/:id',
        method: HttpMethod.PUT,
        handler: 'category.update',
        description: '更新分类',
        permission: 'cms:category:update',
      },
      {
        path: '/category/:id',
        method: HttpMethod.DELETE,
        handler: 'category.delete',
        description: '删除分类',
        permission: 'cms:category:delete',
      },
      {
        path: '/category/tree/:type',
        method: HttpMethod.GET,
        handler: 'category.tree',
        description: '分类树结构',
        permission: 'cms:category:view',
      },
      {
        path: '/category/type/:type',
        method: HttpMethod.GET,
        handler: 'category.byType',
        description: '按类型查询分类',
        permission: 'cms:category:view',
      },
      {
        path: '/category/stats',
        method: HttpMethod.GET,
        handler: 'category.stats',
        description: '分类统计',
        permission: 'cms:stat:view',
      },

      // ===== 标签管理 API =====
      {
        path: '/tag',
        method: HttpMethod.GET,
        handler: 'tag.list',
        description: '标签列表查询',
        permission: 'cms:tag:view',
      },
      {
        path: '/tag/:id',
        method: HttpMethod.GET,
        handler: 'tag.detail',
        description: '标签详情',
        permission: 'cms:tag:view',
      },
      {
        path: '/tag',
        method: HttpMethod.POST,
        handler: 'tag.create',
        description: '创建标签',
        permission: 'cms:tag:create',
      },
      {
        path: '/tag/:id',
        method: HttpMethod.PUT,
        handler: 'tag.update',
        description: '更新标签',
        permission: 'cms:tag:update',
      },
      {
        path: '/tag/:id',
        method: HttpMethod.DELETE,
        handler: 'tag.delete',
        description: '删除标签',
        permission: 'cms:tag:delete',
      },
      {
        path: '/tag/popular',
        method: HttpMethod.GET,
        handler: 'tag.popular',
        description: '热门标签',
        permission: 'cms:tag:view',
      },
      {
        path: '/tag/search',
        method: HttpMethod.GET,
        handler: 'tag.search',
        description: '搜索标签',
        permission: 'cms:tag:view',
      },
      {
        path: '/tag/stats',
        method: HttpMethod.GET,
        handler: 'tag.stats',
        description: '标签统计',
        permission: 'cms:stat:view',
      },

      // ===== 媒体管理 API =====
      {
        path: '/media',
        method: HttpMethod.GET,
        handler: 'media.list',
        description: '媒体资源列表',
        permission: 'cms:media:view',
      },
      {
        path: '/media/:id',
        method: HttpMethod.GET,
        handler: 'media.detail',
        description: '媒体资源详情',
        permission: 'cms:media:view',
      },
      {
        path: '/media/upload',
        method: HttpMethod.POST,
        handler: 'media.upload',
        description: '上传媒体',
        permission: 'cms:media:upload',
      },
      {
        path: '/media/:id',
        method: HttpMethod.DELETE,
        handler: 'media.delete',
        description: '删除媒体',
        permission: 'cms:media:delete',
      },
      {
        path: '/media/search',
        method: HttpMethod.GET,
        handler: 'media.search',
        description: '搜索媒体',
        permission: 'cms:media:view',
      },
      {
        path: '/media/folder',
        method: HttpMethod.GET,
        handler: 'media.getFolder',
        description: '获取文件夹',
        permission: 'cms:media:view',
      },
      {
        path: '/media/folder',
        method: HttpMethod.POST,
        handler: 'media.createFolder',
        description: '创建文件夹',
        permission: 'cms:media:upload',
      },
      {
        path: '/media/folder/:id',
        method: HttpMethod.DELETE,
        handler: 'media.deleteFolder',
        description: '删除文件夹',
        permission: 'cms:media:delete',
      },
      {
        path: '/media/:id/move',
        method: HttpMethod.POST,
        handler: 'media.move',
        description: '移动媒体',
        permission: 'cms:media:upload',
      },
      {
        path: '/media/stats',
        method: HttpMethod.GET,
        handler: 'media.stats',
        description: '媒体统计',
        permission: 'cms:stat:view',
      },

      // ===== 导航配置 API =====
      {
        path: '/nav',
        method: HttpMethod.GET,
        handler: 'nav.getConfig',
        description: '获取导航配置',
        permission: 'cms:nav:view',
      },
      {
        path: '/nav',
        method: HttpMethod.PUT,
        handler: 'nav.updateConfig',
        description: '更新导航配置',
        permission: 'cms:nav:update',
      },
      {
        path: '/nav/tree',
        method: HttpMethod.GET,
        handler: 'nav.tree',
        description: '导航树结构',
        permission: 'cms:nav:view',
      },
      {
        path: '/nav/stats',
        method: HttpMethod.GET,
        handler: 'nav.stats',
        description: '导航统计',
        permission: 'cms:stat:view',
      },

      // ===== Footer配置 API =====
      {
        path: '/footer',
        method: HttpMethod.GET,
        handler: 'footer.getConfig',
        description: '获取Footer配置',
        permission: 'cms:footer:view',
      },
      {
        path: '/footer',
        method: HttpMethod.PUT,
        handler: 'footer.updateConfig',
        description: '更新Footer配置',
        permission: 'cms:footer:update',
      },
      {
        path: '/footer/stats',
        method: HttpMethod.GET,
        handler: 'footer.stats',
        description: 'Footer统计',
        permission: 'cms:stat:view',
      },

      // ===== 统计 API =====
      {
        path: '/stat/track',
        method: HttpMethod.POST,
        handler: 'stat.track',
        description: '记录访问',
        permission: 'cms:user:view',
      },
      {
        path: '/stat/daily',
        method: HttpMethod.GET,
        handler: 'stat.getDaily',
        description: '日统计',
        permission: 'cms:stat:view',
      },
      {
        path: '/stat/weekly',
        method: HttpMethod.GET,
        handler: 'stat.getWeekly',
        description: '周统计',
        permission: 'cms:stat:view',
      },
      {
        path: '/stat/monthly',
        method: HttpMethod.GET,
        handler: 'stat.getMonthly',
        description: '月统计',
        permission: 'cms:stat:view',
      },
      {
        path: '/stat/content',
        method: HttpMethod.GET,
        handler: 'stat.getContentStats',
        description: '内容统计',
        permission: 'cms:stat:view',
      },
      {
        path: '/stat/interaction',
        method: HttpMethod.GET,
        handler: 'stat.getInteractionStats',
        description: '互动统计',
        permission: 'cms:stat:view',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    // 内容权限
    const contentPermissions: ModulePermission[] = [
      {
        id: 'cms:content:view',
        name: '查看内容',
        type: PermissionType.RESOURCE,
        description: '查看所有内容',
      },
      {
        id: 'cms:content:create',
        name: '创建内容',
        type: PermissionType.ACTION,
        description: '创建新内容',
      },
      {
        id: 'cms:content:update',
        name: '更新内容',
        type: PermissionType.ACTION,
        description: '更新内容',
      },
      {
        id: 'cms:content:delete',
        name: '删除内容',
        type: PermissionType.ADMIN,
        description: '删除内容',
      },
      {
        id: 'cms:content:publish',
        name: '发布内容',
        type: PermissionType.ACTION,
        description: '发布内容',
      },
    ]

    // 产品权限
    const productPermissions: ModulePermission[] = [
      {
        id: 'cms:product:view',
        name: '查看产品',
        type: PermissionType.RESOURCE,
        description: '查看产品内容',
      },
      {
        id: 'cms:product:create',
        name: '创建产品',
        type: PermissionType.ACTION,
        description: '创建新产品',
      },
      {
        id: 'cms:product:update',
        name: '更新产品',
        type: PermissionType.ACTION,
        description: '更新产品',
      },
      {
        id: 'cms:product:delete',
        name: '删除产品',
        type: PermissionType.ADMIN,
        description: '删除产品',
      },
      {
        id: 'cms:product:publish',
        name: '发布产品',
        type: PermissionType.ACTION,
        description: '发布产品',
      },
    ]

    // 方案权限
    const solutionPermissions: ModulePermission[] = [
      {
        id: 'cms:solution:view',
        name: '查看方案',
        type: PermissionType.RESOURCE,
        description: '查看方案内容',
      },
      {
        id: 'cms:solution:create',
        name: '创建方案',
        type: PermissionType.ACTION,
        description: '创建新方案',
      },
      {
        id: 'cms:solution:update',
        name: '更新方案',
        type: PermissionType.ACTION,
        description: '更新方案',
      },
      {
        id: 'cms:solution:delete',
        name: '删除方案',
        type: PermissionType.ADMIN,
        description: '删除方案',
      },
    ]

    // 案例权限
    const casePermissions: ModulePermission[] = [
      {
        id: 'cms:case:view',
        name: '查看案例',
        type: PermissionType.RESOURCE,
        description: '查看案例内容',
      },
      {
        id: 'cms:case:create',
        name: '创建案例',
        type: PermissionType.ACTION,
        description: '创建新案例',
      },
      {
        id: 'cms:case:update',
        name: '更新案例',
        type: PermissionType.ACTION,
        description: '更新案例',
      },
      {
        id: 'cms:case:delete',
        name: '删除案例',
        type: PermissionType.ADMIN,
        description: '删除案例',
      },
    ]

    // 新闻权限
    const newsPermissions: ModulePermission[] = [
      {
        id: 'cms:news:view',
        name: '查看新闻',
        type: PermissionType.RESOURCE,
        description: '查看新闻内容',
      },
      {
        id: 'cms:news:create',
        name: '创建新闻',
        type: PermissionType.ACTION,
        description: '创建新新闻',
      },
      {
        id: 'cms:news:update',
        name: '更新新闻',
        type: PermissionType.ACTION,
        description: '更新新闻',
      },
      {
        id: 'cms:news:delete',
        name: '删除新闻',
        type: PermissionType.ADMIN,
        description: '删除新闻',
      },
      {
        id: 'cms:news:publish',
        name: '发布新闻',
        type: PermissionType.ACTION,
        description: '发布新闻',
      },
    ]

    // 视频权限
    const videoPermissions: ModulePermission[] = [
      {
        id: 'cms:video:view',
        name: '查看视频',
        type: PermissionType.RESOURCE,
        description: '查看视频内容',
      },
      {
        id: 'cms:video:create',
        name: '创建视频',
        type: PermissionType.ACTION,
        description: '创建新视频',
      },
      {
        id: 'cms:video:update',
        name: '更新视频',
        type: PermissionType.ACTION,
        description: '更新视频',
      },
      {
        id: 'cms:video:delete',
        name: '删除视频',
        type: PermissionType.ADMIN,
        description: '删除视频',
      },
    ]

    // 媒体权限
    const mediaPermissions: ModulePermission[] = [
      {
        id: 'cms:media:view',
        name: '查看媒体',
        type: PermissionType.RESOURCE,
        description: '查看媒体资源',
      },
      {
        id: 'cms:media:upload',
        name: '上传媒体',
        type: PermissionType.ACTION,
        description: '上传媒体资源',
      },
      {
        id: 'cms:media:delete',
        name: '删除媒体',
        type: PermissionType.ADMIN,
        description: '删除媒体资源',
      },
    ]

    // 页面权限
    const pagePermissions: ModulePermission[] = [
      {
        id: 'cms:page:view',
        name: '查看页面配置',
        type: PermissionType.RESOURCE,
        description: '查看页面配置',
      },
      {
        id: 'cms:page:update',
        name: '更新页面配置',
        type: PermissionType.ACTION,
        description: '更新页面配置',
      },
      {
        id: 'cms:page:design',
        name: '页面设计',
        type: PermissionType.ADMIN,
        description: '页面可视化设计',
      },
    ]

    // SEO权限
    const seoPermissions: ModulePermission[] = [
      {
        id: 'cms:seo:view',
        name: '查看SEO配置',
        type: PermissionType.RESOURCE,
        description: '查看SEO配置',
      },
      {
        id: 'cms:seo:update',
        name: '更新SEO配置',
        type: PermissionType.ACTION,
        description: '更新SEO配置',
      },
    ]

    // 分类权限
    const categoryPermissions: ModulePermission[] = [
      {
        id: 'cms:category:view',
        name: '查看分类',
        type: PermissionType.RESOURCE,
        description: '查看分类',
      },
      {
        id: 'cms:category:create',
        name: '创建分类',
        type: PermissionType.ACTION,
        description: '创建分类',
      },
      {
        id: 'cms:category:update',
        name: '更新分类',
        type: PermissionType.ACTION,
        description: '更新分类',
      },
      {
        id: 'cms:category:delete',
        name: '删除分类',
        type: PermissionType.ADMIN,
        description: '删除分类',
      },
    ]

    // 标签权限
    const tagPermissions: ModulePermission[] = [
      {
        id: 'cms:tag:view',
        name: '查看标签',
        type: PermissionType.RESOURCE,
        description: '查看标签',
      },
      {
        id: 'cms:tag:create',
        name: '创建标签',
        type: PermissionType.ACTION,
        description: '创建标签',
      },
      {
        id: 'cms:tag:update',
        name: '更新标签',
        type: PermissionType.ACTION,
        description: '更新标签',
      },
      {
        id: 'cms:tag:delete',
        name: '删除标签',
        type: PermissionType.ADMIN,
        description: '删除标签',
      },
    ]

    // Banner权限
    const bannerPermissions: ModulePermission[] = [
      {
        id: 'cms:banner:view',
        name: '查看Banner',
        type: PermissionType.RESOURCE,
        description: '查看Banner',
      },
      {
        id: 'cms:banner:create',
        name: '创建Banner',
        type: PermissionType.ACTION,
        description: '创建Banner',
      },
      {
        id: 'cms:banner:update',
        name: '更新Banner',
        type: PermissionType.ACTION,
        description: '更新Banner',
      },
      {
        id: 'cms:banner:delete',
        name: '删除Banner',
        type: PermissionType.ADMIN,
        description: '删除Banner',
      },
    ]

    // 导航权限
    const navPermissions: ModulePermission[] = [
      {
        id: 'cms:nav:view',
        name: '查看导航',
        type: PermissionType.RESOURCE,
        description: '查看导航配置',
      },
      {
        id: 'cms:nav:update',
        name: '更新导航',
        type: PermissionType.ADMIN,
        description: '更新导航配置',
      },
    ]

    // Footer权限
    const footerPermissions: ModulePermission[] = [
      {
        id: 'cms:footer:view',
        name: '查看Footer',
        type: PermissionType.RESOURCE,
        description: '查看Footer配置',
      },
      {
        id: 'cms:footer:update',
        name: '更新Footer',
        type: PermissionType.ADMIN,
        description: '更新Footer配置',
      },
    ]

    // 统计权限
    const statPermissions: ModulePermission[] = [
      {
        id: 'cms:stat:view',
        name: '查看统计',
        type: PermissionType.RESOURCE,
        description: '查看网站统计',
      },
    ]

    // 超级管理员权限
    const adminPermissions: ModulePermission[] = [
      {
        id: 'cms:admin:all',
        name: 'CMS管理员',
        type: PermissionType.ADMIN,
        description: '拥有CMS所有权限',
      },
    ]

    return [
      ...contentPermissions,
      ...productPermissions,
      ...solutionPermissions,
      ...casePermissions,
      ...newsPermissions,
      ...videoPermissions,
      ...mediaPermissions,
      ...pagePermissions,
      ...seoPermissions,
      ...categoryPermissions,
      ...tagPermissions,
      ...bannerPermissions,
      ...navPermissions,
      ...footerPermissions,
      ...statPermissions,
      ...adminPermissions,
    ] as ModulePermission[]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'cms',
        title: '内容管理',
        path: '/cms',
        icon: 'content',
        order: 4,
        children: [
          // 产品管理
          {
            id: 'cms-product',
            title: '产品管理',
            path: '/cms/product',
            icon: 'product',
            permissions: ['cms:product:view'],
            order: 1,
            children: [
              {
                id: 'cms-product-list',
                title: '产品列表',
                path: '/cms/product/list',
                icon: 'list',
                permissions: ['cms:product:view'],
                order: 1,
              },
              {
                id: 'cms-product-category',
                title: '产品分类',
                path: '/cms/product/category',
                icon: 'folder',
                permissions: ['cms:category:view'],
                order: 2,
              },
              {
                id: 'cms-product-stats',
                title: '产品统计',
                path: '/cms/product/stats',
                icon: 'chart',
                permissions: ['cms:stat:view'],
                order: 3,
              },
            ],
          },
          // 解决方案
          {
            id: 'cms-solution',
            title: '方案管理',
            path: '/cms/solution',
            icon: 'solution',
            permissions: ['cms:solution:view'],
            order: 2,
            children: [
              {
                id: 'cms-solution-list',
                title: '方案列表',
                path: '/cms/solution/list',
                icon: 'list',
                permissions: ['cms:solution:view'],
                order: 1,
              },
              {
                id: 'cms-solution-comparison',
                title: '方案对比',
                path: '/cms/solution/comparison',
                icon: 'compare',
                permissions: ['cms:solution:view'],
                order: 2,
              },
            ],
          },
          // 成功案例
          {
            id: 'cms-case',
            title: '案例管理',
            path: '/cms/case',
            icon: 'case',
            permissions: ['cms:case:view'],
            order: 3,
            children: [
              {
                id: 'cms-case-list',
                title: '案例列表',
                path: '/cms/case/list',
                icon: 'list',
                permissions: ['cms:case:view'],
                order: 1,
              },
              {
                id: 'cms-case-featured',
                title: '精选案例',
                path: '/cms/case/featured',
                icon: 'star',
                permissions: ['cms:case:view'],
                order: 2,
              },
            ],
          },
          // 新闻管理
          {
            id: 'cms-news',
            title: '新闻管理',
            path: '/cms/news',
            icon: 'news',
            permissions: ['cms:news:view'],
            order: 4,
            children: [
              {
                id: 'cms-news-list',
                title: '新闻列表',
                path: '/cms/news/list',
                icon: 'list',
                permissions: ['cms:news:view'],
                order: 1,
              },
              {
                id: 'cms-news-type',
                title: '新闻分类',
                path: '/cms/news/type',
                icon: 'folder',
                permissions: ['cms:category:view'],
                order: 2,
              },
            ],
          },
          // 视频管理
          {
            id: 'cms-video',
            title: '视频管理',
            path: '/cms/video',
            icon: 'video',
            permissions: ['cms:video:view'],
            order: 5,
            children: [
              {
                id: 'cms-video-list',
                title: '视频列表',
                path: '/cms/video/list',
                icon: 'list',
                permissions: ['cms:video:view'],
                order: 1,
              },
            ],
          },
          // 媒体中心
          {
            id: 'cms-media',
            title: '媒体中心',
            path: '/cms/media',
            icon: 'image',
            permissions: ['cms:media:view'],
            order: 6,
            children: [
              {
                id: 'cms-media-list',
                title: '媒体资源',
                path: '/cms/media/list',
                icon: 'gallery',
                permissions: ['cms:media:view'],
                order: 1,
              },
              {
                id: 'cms-media-folder',
                title: '文件夹',
                path: '/cms/media/folder',
                icon: 'folder',
                permissions: ['cms:media:view'],
                order: 2,
              },
            ],
          },
          // 页面配置
          {
            id: 'cms-page',
            title: '页面配置',
            path: '/cms/page',
            icon: 'page',
            permissions: ['cms:page:view'],
            order: 7,
            children: [
              {
                id: 'cms-page-home',
                title: '首页配置',
                path: '/cms/page/home',
                icon: 'home',
                permissions: ['cms:page:view'],
                order: 1,
              },
              {
                id: 'cms-page-about',
                title: '关于页配置',
                path: '/cms/page/about',
                icon: 'info',
                permissions: ['cms:page:view'],
                order: 2,
              },
              {
                id: 'cms-page-products',
                title: '产品页配置',
                path: '/cms/page/products',
                icon: 'product',
                permissions: ['cms:page:view'],
                order: 3,
              },
              {
                id: 'cms-page-solutions',
                title: '方案页配置',
                path: '/cms/page/solutions',
                icon: 'solution',
                permissions: ['cms:page:view'],
                order: 4,
              },
              {
                id: 'cms-page-cases',
                title: '案例页配置',
                path: '/cms/page/cases',
                icon: 'case',
                permissions: ['cms:page:view'],
                order: 5,
              },
              {
                id: 'cms-page-news',
                title: '新闻页配置',
                path: '/cms/page/news',
                icon: 'news',
                permissions: ['cms:page:view'],
                order: 6,
              },
              {
                id: 'cms-page-services',
                title: '服务页配置',
                path: '/cms/page/services',
                icon: 'service',
                permissions: ['cms:page:view'],
                order: 7,
              },
              {
                id: 'cms-page-contact',
                title: '联系页配置',
                path: '/cms/page/contact',
                icon: 'contact',
                permissions: ['cms:page:view'],
                order: 8,
              },
            ],
          },
          // Banner管理
          {
            id: 'cms-banner',
            title: 'Banner管理',
            path: '/cms/banner',
            icon: 'banner',
            permissions: ['cms:banner:view'],
            order: 8,
            children: [
              {
                id: 'cms-banner-list',
                title: 'Banner列表',
                path: '/cms/banner/list',
                icon: 'list',
                permissions: ['cms:banner:view'],
                order: 1,
              },
              {
                id: 'cms-banner-position',
                title: '位置管理',
                path: '/cms/banner/position',
                icon: 'location',
                permissions: ['cms:banner:view'],
                order: 2,
              },
            ],
          },
          // SEO设置
          {
            id: 'cms-seo',
            title: 'SEO设置',
            path: '/cms/seo',
            icon: 'seo',
            permissions: ['cms:seo:view'],
            order: 9,
            children: [
              {
                id: 'cms-seo-global',
                title: '全局SEO',
                path: '/cms/seo/global',
                icon: 'global',
                permissions: ['cms:seo:view'],
                order: 1,
              },
              {
                id: 'cms-seo-page',
                title: '页面SEO',
                path: '/cms/seo/page',
                icon: 'page',
                permissions: ['cms:seo:view'],
                order: 2,
              },
            ],
          },
          // 导航管理
          {
            id: 'cms-nav',
            title: '导航管理',
            path: '/cms/nav',
            icon: 'nav',
            permissions: ['cms:nav:view'],
            order: 10,
            children: [
              {
                id: 'cms-nav-config',
                title: '导航配置',
                path: '/cms/nav/config',
                icon: 'settings',
                permissions: ['cms:nav:view'],
                order: 1,
              },
            ],
          },
          // Footer管理
          {
            id: 'cms-footer',
            title: 'Footer管理',
            path: '/cms/footer',
            icon: 'footer',
            permissions: ['cms:footer:view'],
            order: 11,
            children: [
              {
                id: 'cms-footer-config',
                title: 'Footer配置',
                path: '/cms/footer/config',
                icon: 'settings',
                permissions: ['cms:footer:view'],
                order: 1,
              },
            ],
          },
          // 分类标签
          {
            id: 'cms-category',
            title: '分类标签',
            path: '/cms/category',
            icon: 'tag',
            permissions: ['cms:category:view'],
            order: 12,
            children: [
              {
                id: 'cms-category-list',
                title: '分类管理',
                path: '/cms/category/list',
                icon: 'folder',
                permissions: ['cms:category:view'],
                order: 1,
              },
              {
                id: 'cms-tag-list',
                title: '标签管理',
                path: '/cms/tag/list',
                icon: 'tag',
                permissions: ['cms:tag:view'],
                order: 2,
              },
            ],
          },
          // 网站统计
          {
            id: 'cms-stat',
            title: '网站统计',
            path: '/cms/stat',
            icon: 'chart',
            permissions: ['cms:stat:view'],
            order: 13,
            children: [
              {
                id: 'cms-stat-dashboard',
                title: '统计概览',
                path: '/cms/stat/dashboard',
                icon: 'dashboard',
                permissions: ['cms:stat:view'],
                order: 1,
              },
              {
                id: 'cms-stat-visit',
                title: '访问统计',
                path: '/cms/stat/visit',
                icon: 'visit',
                permissions: ['cms:stat:view'],
                order: 2,
              },
              {
                id: 'cms-stat-content',
                title: '内容统计',
                path: '/cms/stat/content',
                icon: 'content',
                permissions: ['cms:stat:view'],
                order: 3,
              },
              {
                id: 'cms-stat-interaction',
                title: '互动统计',
                path: '/cms/stat/interaction',
                icon: 'interaction',
                permissions: ['cms:stat:view'],
                order: 4,
              },
            ],
          },
        ],
      },
    ]
  }

  /**
   * 获取事件定义
   */
  getEvents(): ModuleEvent[] {
    return [
      // 内容事件
      { name: 'cms.content.created', type: EventType.BUSINESS_DATA, description: '内容创建' },
      { name: 'cms.content.updated', type: EventType.USER_ACTION, description: '内容更新' },
      { name: 'cms.content.deleted', type: EventType.USER_ACTION, description: '内容删除' },
      { name: 'cms.content.published', type: EventType.USER_ACTION, description: '内容发布' },
      { name: 'cms.content.archived', type: EventType.USER_ACTION, description: '内容归档' },

      // 产品事件
      { name: 'cms.product.created', type: EventType.BUSINESS_DATA, description: '产品创建' },
      { name: 'cms.product.published', type: EventType.USER_ACTION, description: '产品发布' },

      // 新闻事件
      { name: 'cms.news.published', type: EventType.USER_ACTION, description: '新闻发布' },

      // 媒体事件
      { name: 'cms.media.uploaded', type: EventType.USER_ACTION, description: '媒体上传' },

      // Banner事件
      { name: 'cms.banner.created', type: EventType.BUSINESS_DATA, description: 'Banner创建' },
      { name: 'cms.banner.expired', type: EventType.SYSTEM, description: 'Banner过期' },

      // 页面事件
      { name: 'cms.page.updated', type: EventType.USER_ACTION, description: '页面配置更新' },

      // SEO事件
      { name: 'cms.seo.updated', type: EventType.USER_ACTION, description: 'SEO配置更新' },

      // 系统事件
      { name: 'cms.publish.scheduled', type: EventType.SYSTEM, description: '定时发布触发' },
      { name: 'cms.archive.completed', type: EventType.SYSTEM, description: '内容归档完成' },

      // 统计事件
      { name: 'cms.stat.tracked', type: EventType.SYSTEM, description: '访问统计记录' },
    ]
  }

  // ============================================
  // 私有检测方法
  // ============================================

  /**
   * 检查定时发布内容
   */
  private async checkScheduledPublish(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const now = new Date()

      // 检查待发布的产品
      const scheduledProducts = await prisma.cmsProduct.findMany({
        where: {
          status: 'review',
          publishAt: { lte: now },
        },
      })

      if (scheduledProducts.length > 0) {
        this.logger?.info(`发现 ${scheduledProducts.length} 个待发布产品`)

        for (const product of scheduledProducts) {
          await prisma.cmsProduct.update({
            where: { id: product.id },
            data: { status: 'published', publishedAt: now },
          })

          this.eventBus?.emit('cms.product.published', {
            productId: product.id,
            title: product.title,
            timestamp: new Date().toISOString(),
          })
        }
      }

      // 检查待发布的新闻
      const scheduledNews = await prisma.cmsNews.findMany({
        where: {
          status: 'review',
          publishAt: { lte: now },
        },
      })

      if (scheduledNews.length > 0) {
        this.logger?.info(`发现 ${scheduledNews.length} 条待发布新闻`)

        for (const news of scheduledNews) {
          await prisma.cmsNews.update({
            where: { id: news.id },
            data: { status: 'published', publishedAt: now },
          })

          this.eventBus?.emit('cms.news.published', {
            newsId: news.id,
            title: news.title,
            timestamp: new Date().toISOString(),
          })
        }
      }

      if (scheduledProducts.length > 0 || scheduledNews.length > 0) {
        this.eventBus?.emit('cms.publish.scheduled', {
          products: scheduledProducts.length,
          news: scheduledNews.length,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      this.logger?.error('定时发布检查失败', error)
    }
  }

  /**
   * 检查过期Banner
   */
  private async checkExpiredBanners(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const now = new Date()

      const expiredBanners = await prisma.cmsBanner.findMany({
        where: {
          isActive: true,
          endDate: { lte: now },
        },
      })

      if (expiredBanners.length > 0) {
        this.logger?.warn(`发现 ${expiredBanners.length} 个过期Banner`)

        for (const banner of expiredBanners) {
          await prisma.cmsBanner.update({
            where: { id: banner.id },
            data: { isActive: false },
          })

          this.eventBus?.emit('cms.banner.expired', {
            bannerId: banner.id,
            title: banner.title,
            endDate: banner.endDate,
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('Banner过期检查失败', error)
    }
  }

  /**
   * 检查内容归档
   */
  private async checkContentArchive(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const moduleConfigs = await this._context?.config.getModuleConfigs(this.manifest.id)
      const retentionDays = moduleConfigs?.news?.retentionDays || 365

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

      // 查找需要归档的新闻
      const oldNews = await prisma.cmsNews.findMany({
        where: {
          status: 'published',
          publishedAt: { lt: cutoffDate },
        },
      })

      if (oldNews.length > 0) {
        this.logger?.info(`有 ${oldNews.length} 条新闻超过保留期限 (${retentionDays}天)`)

        // 执行归档
        const archiveResult = await prisma.cmsNews.updateMany({
          where: {
            status: 'published',
            publishedAt: { lt: cutoffDate },
          },
          data: { status: 'archived' },
        })

        this.eventBus?.emit('cms.archive.completed', {
          type: 'news',
          count: archiveResult.count,
          retentionDays,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      this.logger?.error('内容归档检查失败', error)
    }
  }
}
