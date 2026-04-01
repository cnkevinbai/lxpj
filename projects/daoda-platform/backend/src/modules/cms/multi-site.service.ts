/**
 * 多站点管理服务
 * 站点配置、站点切换、站点资源隔离
 */
import { Injectable } from '@nestjs/common'

// 站点状态
export enum SiteStatus {
  ACTIVE = 'ACTIVE', // 活跃
  INACTIVE = 'INACTIVE', // 未激活
  MAINTENANCE = 'MAINTENANCE', // 维护中
  ARCHIVED = 'ARCHIVED', // 已归档
}

// 站点类型
export enum SiteType {
  MAIN = 'MAIN', // 主站点
  REGIONAL = 'REGIONAL', // 区域站点
  PRODUCT = 'PRODUCT', // 产品站点
  BRAND = 'BRAND', // 品牌站点
  MOBILE = 'MOBILE', // 移动站点
  DEMO = 'DEMO', // 演示站点
}

// 站点语言
export enum SiteLanguage {
  ZH_CN = 'zh-CN', // 简体中文
  ZH_TW = 'zh-TW', // 繁体中文
  EN_US = 'en-US', // 美式英语
  EN_GB = 'en-GB', // 英式英语
  JA_JP = 'ja-JP', // 日语
  KO_KR = 'ko-KR', // 韩语
  DE_DE = 'de-DE', // 德语
  FR_FR = 'fr-FR', // 法语
  ES_ES = 'es-ES', // 西班牙语
}

// 站点配置接口
export interface SiteConfig {
  id: string
  name: string
  code: string // 站点编码（如 daoda-main）
  domain?: string // 主域名（如 www.daoda.com）
  subdomain?: string // 子域名（如 en.daoda.com）
  type: SiteType
  status: SiteStatus
  language: SiteLanguage
  region?: string // 区域（如 CN、US、EU）
  parentId?: string // 父站点ID（用于区域站点）
  theme?: string // 主题名称
  logo?: string // Logo URL
  favicon?: string // Favicon URL
  title?: string // 站点标题
  description?: string // 站点描述
  keywords?: string[] // SEO关键词
  contactEmail?: string // 联系邮箱
  contactPhone?: string // 联系电话
  address?: string // 地址
  socialLinks?: {
    // 社交链接
    wechat?: string
    weibo?: string
    twitter?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }
  seoSettings?: {
    // SEO设置
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    robotsTxt?: string
    sitemapEnabled?: boolean
  }
  analytics?: {
    // 分析配置
    googleAnalyticsId?: string
    baiduAnalyticsId?: string
    facebookPixelId?: string
  }
  features?: {
    // 功能开关
    multiLanguage?: boolean
    userRegistration?: boolean
    newsletter?: boolean
    search?: boolean
    comments?: boolean
    contactForm?: boolean
  }
  contentCount?: number // 内容数量
  pageCount?: number // 页面数量
  visitCount?: number // 访问量（月）
  createdAt: Date
  updatedAt: Date
}

// 站点资源接口
export interface SiteResource {
  id: string
  siteId: string
  type: 'CATEGORY' | 'TAG' | 'MEDIA' | 'TEMPLATE' | 'MENU'
  name: string
  code?: string
  count?: number
  createdAt: Date
}

// 站点访问统计
export interface SiteVisitStats {
  siteId: string
  date: Date
  visitCount: number
  uniqueVisitors: number
  pageViews: number
  avgSessionDuration: number // 分钟
  bounceRate?: number // 跳出率 %
  topPages?: { path: string; views: number }[]
  topSources?: { source: string; visits: number }[]
}

// 站点切换记录
export interface SiteSwitchLog {
  id: string
  fromSiteId: string
  toSiteId: string
  userId?: string
  userName?: string
  reason?: string
  switchedAt: Date
}

@Injectable()
export class MultiSiteService {
  private siteConfigs: Map<string, SiteConfig> = new Map()
  private siteResources: Map<string, SiteResource[]> = new Map()
  private visitStats: Map<string, SiteVisitStats[]> = new Map()
  private switchLogs: Map<string, SiteSwitchLog[]> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化站点配置
    const mockSites: SiteConfig[] = [
      {
        id: 'SITE-001',
        name: '道达智能主站',
        code: 'daoda-main',
        domain: 'www.daoda.com',
        type: SiteType.MAIN,
        status: SiteStatus.ACTIVE,
        language: SiteLanguage.ZH_CN,
        region: 'CN',
        theme: 'daoda-dark',
        logo: '/images/logo.png',
        title: '道达智能 - 智能车辆管理平台',
        description: '道达智能专注于智能车辆管理平台解决方案',
        keywords: ['智能车辆', '车辆管理', 'IOV平台'],
        contactEmail: 'contact@daoda.com',
        contactPhone: '400-123-4567',
        address: '四川省眉山市',
        socialLinks: { wechat: 'daoda-wechat', weibo: '@daoda', twitter: '@daoda_ai' },
        seoSettings: { metaTitle: '道达智能', sitemapEnabled: true },
        analytics: { googleAnalyticsId: 'GA-123456', baiduAnalyticsId: 'BA-123456' },
        features: { multiLanguage: true, search: true, contactForm: true },
        contentCount: 45,
        pageCount: 12,
        visitCount: 15000,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'SITE-002',
        name: '道达智能英文站',
        code: 'daoda-en',
        domain: 'en.daoda.com',
        subdomain: 'en',
        type: SiteType.REGIONAL,
        status: SiteStatus.ACTIVE,
        language: SiteLanguage.EN_US,
        region: 'US',
        parentId: 'SITE-001',
        theme: 'daoda-dark',
        logo: '/images/logo-en.png',
        title: 'Daoda Intelligence - Smart Vehicle Management Platform',
        description: 'Daoda Intelligence specializes in smart vehicle management solutions',
        keywords: ['smart vehicle', 'vehicle management', 'IOV platform'],
        contactEmail: 'contact@daoda.com',
        seoSettings: { sitemapEnabled: true },
        features: { multiLanguage: false, search: true },
        contentCount: 30,
        pageCount: 8,
        visitCount: 5000,
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date(),
      },
      {
        id: 'SITE-003',
        name: 'IOV产品站',
        code: 'iov-product',
        domain: 'iov.daoda.com',
        type: SiteType.PRODUCT,
        status: SiteStatus.ACTIVE,
        language: SiteLanguage.ZH_CN,
        region: 'CN',
        parentId: 'SITE-001',
        theme: 'iov-theme',
        logo: '/images/iov-logo.png',
        title: 'IOV智能车辆管理平台',
        description: 'IOV平台 - 企业级智能车辆管理解决方案',
        keywords: ['IOV', '车辆管理', '智能交通'],
        contentCount: 20,
        pageCount: 6,
        visitCount: 8000,
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date(),
      },
      {
        id: 'SITE-004',
        name: '道达日本站',
        code: 'daoda-jp',
        domain: 'jp.daoda.com',
        type: SiteType.REGIONAL,
        status: SiteStatus.ACTIVE,
        language: SiteLanguage.JA_JP,
        region: 'JP',
        parentId: 'SITE-001',
        theme: 'daoda-dark',
        title: '道達智能 - スマート車両管理プラットフォーム',
        contentCount: 15,
        pageCount: 5,
        visitCount: 2000,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date(),
      },
      {
        id: 'SITE-005',
        name: '道达演示站',
        code: 'daoda-demo',
        domain: 'demo.daoda.com',
        type: SiteType.DEMO,
        status: SiteStatus.ACTIVE,
        language: SiteLanguage.ZH_CN,
        theme: 'demo-theme',
        title: '道达智能演示平台',
        contentCount: 10,
        pageCount: 3,
        visitCount: 3000,
        createdAt: new Date('2026-03-10'),
        updatedAt: new Date(),
      },
      {
        id: 'SITE-006',
        name: '道达移动站',
        code: 'daoda-mobile',
        type: SiteType.MOBILE,
        status: SiteStatus.MAINTENANCE,
        language: SiteLanguage.ZH_CN,
        parentId: 'SITE-001',
        theme: 'mobile-theme',
        title: '道达智能移动端',
        contentCount: 25,
        pageCount: 5,
        createdAt: new Date('2026-03-15'),
        updatedAt: new Date(),
      },
    ]

    mockSites.forEach((site) => {
      this.siteConfigs.set(site.id, site)
    })

    // 初始化站点资源
    const mockResources: SiteResource[] = [
      {
        id: 'SR-001',
        siteId: 'SITE-001',
        type: 'CATEGORY',
        name: '产品动态',
        code: 'CAT-001',
        count: 10,
        createdAt: new Date(),
      },
      {
        id: 'SR-002',
        siteId: 'SITE-001',
        type: 'CATEGORY',
        name: '成功案例',
        code: 'CAT-002',
        count: 8,
        createdAt: new Date(),
      },
      {
        id: 'SR-003',
        siteId: 'SITE-001',
        type: 'CATEGORY',
        name: '技术资料',
        code: 'CAT-003',
        count: 5,
        createdAt: new Date(),
      },
      {
        id: 'SR-004',
        siteId: 'SITE-001',
        type: 'TAG',
        name: '产品',
        count: 15,
        createdAt: new Date(),
      },
      {
        id: 'SR-005',
        siteId: 'SITE-001',
        type: 'TAG',
        name: '智能',
        count: 12,
        createdAt: new Date(),
      },
      {
        id: 'SR-006',
        siteId: 'SITE-001',
        type: 'MEDIA',
        name: '图片库',
        count: 50,
        createdAt: new Date(),
      },
      {
        id: 'SR-007',
        siteId: 'SITE-001',
        type: 'TEMPLATE',
        name: '文章模板',
        count: 3,
        createdAt: new Date(),
      },
      {
        id: 'SR-008',
        siteId: 'SITE-001',
        type: 'MENU',
        name: '主导航',
        count: 8,
        createdAt: new Date(),
      },
      {
        id: 'SR-009',
        siteId: 'SITE-002',
        type: 'CATEGORY',
        name: 'Products',
        code: 'CAT-EN-001',
        count: 8,
        createdAt: new Date(),
      },
      {
        id: 'SR-010',
        siteId: 'SITE-002',
        type: 'CATEGORY',
        name: 'Cases',
        code: 'CAT-EN-002',
        count: 5,
        createdAt: new Date(),
      },
    ]

    mockResources.forEach((resource) => {
      const siteResources = this.siteResources.get(resource.siteId) || []
      siteResources.push(resource)
      this.siteResources.set(resource.siteId, siteResources)
    })

    // 初始化访问统计
    const mockStats: SiteVisitStats[] = [
      {
        siteId: 'SITE-001',
        date: new Date('2026-03-28'),
        visitCount: 1500,
        uniqueVisitors: 800,
        pageViews: 4500,
        avgSessionDuration: 5.2,
        bounceRate: 35,
        topPages: [
          { path: '/products', views: 1200 },
          { path: '/cases', views: 800 },
        ],
      },
      {
        siteId: 'SITE-001',
        date: new Date('2026-03-29'),
        visitCount: 1600,
        uniqueVisitors: 850,
        pageViews: 4800,
        avgSessionDuration: 5.5,
        bounceRate: 32,
      },
      {
        siteId: 'SITE-001',
        date: new Date('2026-03-30'),
        visitCount: 1700,
        uniqueVisitors: 900,
        pageViews: 5200,
        avgSessionDuration: 5.8,
        bounceRate: 30,
      },
      {
        siteId: 'SITE-002',
        date: new Date('2026-03-30'),
        visitCount: 500,
        uniqueVisitors: 300,
        pageViews: 1500,
        avgSessionDuration: 4.2,
        bounceRate: 45,
      },
      {
        siteId: 'SITE-003',
        date: new Date('2026-03-30'),
        visitCount: 800,
        uniqueVisitors: 500,
        pageViews: 2500,
        avgSessionDuration: 6.0,
        bounceRate: 25,
      },
    ]

    mockStats.forEach((stat) => {
      const siteStats = this.visitStats.get(stat.siteId) || []
      siteStats.push(stat)
      this.visitStats.set(stat.siteId, siteStats)
    })
  }

  // 获取站点列表
  async getSiteConfigs(query?: {
    type?: SiteType
    status?: SiteStatus
    language?: SiteLanguage
    region?: string
  }): Promise<SiteConfig[]> {
    let sites = Array.from(this.siteConfigs.values())
    if (query) {
      if (query.type) sites = sites.filter((s) => s.type === query.type)
      if (query.status) sites = sites.filter((s) => s.status === query.status)
      if (query.language) sites = sites.filter((s) => s.language === query.language)
      if (query.region) sites = sites.filter((s) => s.region === query.region)
    }
    return sites.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
  }

  // 获取站点详情
  async getSiteConfig(id: string): Promise<SiteConfig | null> {
    return this.siteConfigs.get(id) || null
  }

  // 获取站点资源
  async getSiteResources(siteId: string): Promise<SiteResource[]> {
    return this.siteResources.get(siteId) || []
  }

  // 获取站点访问统计
  async getSiteVisitStats(siteId: string, days?: number): Promise<SiteVisitStats[]> {
    let stats = this.visitStats.get(siteId) || []
    if (days) {
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      stats = stats.filter((s) => s.date >= cutoff)
    }
    return stats.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  // 获取主站点
  async getMainSite(): Promise<SiteConfig | null> {
    const sites = Array.from(this.siteConfigs.values())
    return sites.find((s) => s.type === SiteType.MAIN) || null
  }

  // 获取子站点
  async getSubSites(parentId: string): Promise<SiteConfig[]> {
    return Array.from(this.siteConfigs.values()).filter((s) => s.parentId === parentId)
  }

  // 切换站点
  async switchSite(
    fromSiteId: string,
    toSiteId: string,
    userId?: string,
    userName?: string,
    reason?: string,
  ): Promise<SiteSwitchLog> {
    const log: SiteSwitchLog = {
      id: `SW-${Date.now()}`,
      fromSiteId,
      toSiteId,
      userId,
      userName,
      reason,
      switchedAt: new Date(),
    }

    const logs = this.switchLogs.get(userId || 'anonymous') || []
    logs.push(log)
    this.switchLogs.set(userId || 'anonymous', logs)

    return log
  }

  // 获取切换历史
  async getSwitchLogs(userId?: string): Promise<SiteSwitchLog[]> {
    if (userId) return this.switchLogs.get(userId) || []
    // 返回所有切换历史
    const allLogs: SiteSwitchLog[] = []
    for (const logs of this.switchLogs.values()) {
      allLogs.push(...logs)
    }
    return allLogs.sort((a, b) => b.switchedAt.getTime() - a.switchedAt.getTime())
  }

  // 更新站点状态
  async updateSiteStatus(id: string, status: SiteStatus): Promise<SiteConfig | null> {
    const site = this.siteConfigs.get(id)
    if (!site) return null
    site.status = status
    site.updatedAt = new Date()
    return site
  }

  // 获取站点统计汇总
  async getSiteStatsSummary(): Promise<{
    totalSites: number
    activeSites: number
    totalContent: number
    totalPages: number
    totalVisits: number
    byType: Record<SiteType, number>
    byLanguage: Record<SiteLanguage, number>
  }> {
    const sites = Array.from(this.siteConfigs.values())
    const byType: Record<SiteType, number> = {} as any
    const byLanguage: Record<SiteLanguage, number> = {} as any

    sites.forEach((s) => {
      byType[s.type] = (byType[s.type] || 0) + 1
      byLanguage[s.language] = (byLanguage[s.language] || 0) + 1
    })

    return {
      totalSites: sites.length,
      activeSites: sites.filter((s) => s.status === SiteStatus.ACTIVE).length,
      totalContent: sites.reduce((sum, s) => sum + (s.contentCount || 0), 0),
      totalPages: sites.reduce((sum, s) => sum + (s.pageCount || 0), 0),
      totalVisits: sites.reduce((sum, s) => sum + (s.visitCount || 0), 0),
      byType,
      byLanguage,
    }
  }

  // 获取支持的语言列表
  async getSupportedLanguages(): Promise<{ code: SiteLanguage; name: string }[]> {
    return [
      { code: SiteLanguage.ZH_CN, name: '简体中文' },
      { code: SiteLanguage.ZH_TW, name: '繁体中文' },
      { code: SiteLanguage.EN_US, name: '美式英语' },
      { code: SiteLanguage.EN_GB, name: '英式英语' },
      { code: SiteLanguage.JA_JP, name: '日语' },
      { code: SiteLanguage.KO_KR, name: '韩语' },
      { code: SiteLanguage.DE_DE, name: '德语' },
      { code: SiteLanguage.FR_FR, name: '法语' },
      { code: SiteLanguage.ES_ES, name: '西班牙语' },
    ]
  }
}
