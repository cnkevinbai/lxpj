/**
 * SEO管理服务
 * SEO设置、关键词管理、元数据配置
 */
import { Injectable } from '@nestjs/common'

// SEO状态枚举
export enum SEOStatus {
  ACTIVE = 'ACTIVE', // 已启用
  INACTIVE = 'INACTIVE', // 未启用
  DRAFT = 'DRAFT', // 草稿
}

// SEO类型枚举
export enum SEOType {
  PAGE = 'PAGE', // 页面SEO
  ARTICLE = 'ARTICLE', // 文章SEO
  PRODUCT = 'PRODUCT', // 产品SEO
  GLOBAL = 'GLOBAL', // 全局SEO设置
}

// 关键词类型枚举
export enum KeywordType {
  PRIMARY = 'PRIMARY', // 主关键词
  SECONDARY = 'SECONDARY', // 次关键词
  LONG_TAIL = 'LONG_TAIL', // 长尾关键词
}

// SEO配置接口
export interface SEOConfig {
  id: string
  type: SEOType
  targetId?: string // 关联的页面/文章/产品ID
  targetName?: string // 关联目标名称

  // 基础SEO信息
  title: string
  description: string
  keywords: string[]

  // OG标签 (社交媒体分享)
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string

  // 结构化数据
  structuredData?: any

  // 状态
  status: SEOStatus

  // 分析数据
  analytics?: {
    impressions?: number
    clicks?: number
    avgPosition?: number
    ctr?: number
  }

  createdAt: Date
  updatedAt: Date
}

// 关键词接口
export interface Keyword {
  id: string
  word: string
  type: KeywordType
  category?: string

  // 搜索数据
  searchVolume?: number // 搜索量
  difficulty?: number // 难度系数 0-100
  currentPosition?: number // 当前排名位置

  // 建议相关词
  relatedWords?: string[]

  createdAt: Date
  updatedAt: Date
}

// SEO统计接口
export interface SEOStats {
  totalConfigs: number
  activeConfigs: number
  totalKeywords: number
  primaryKeywords: number
  avgPosition: number
  avgCTR: number
  totalImpressions: number
  totalClicks: number
}

// 页面SEO分析结果
export interface SEOAnalysis {
  score: number // SEO分数 0-100
  issues: SEOIssue[] // 问题列表
  suggestions: string[] // 优化建议
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  field: string
  message: string
  suggestion?: string
}

@Injectable()
export class SEOService {
  private seoConfigs: Map<string, SEOConfig> = new Map()
  private keywords: Map<string, Keyword> = new Map()

  constructor() {
    this.initDefaultSEO()
  }

  // 初始化默认SEO配置
  private initDefaultSEO() {
    // 全局SEO设置
    const globalSEO: SEOConfig = {
      id: 'SEO-GLOBAL',
      type: SEOType.GLOBAL,
      title: '道达智能 - 智能车辆管理平台',
      description:
        '道达智能科技有限公司专注于智能车辆管理解决方案，提供车联网、车队管理、智能调度等一体化服务',
      keywords: ['智能车辆', '车队管理', '车联网', '车辆监控', '智能调度'],
      ogTitle: '道达智能 - 智能车辆管理平台',
      ogDescription: '专业的智能车辆管理解决方案提供商',
      ogImage: '/images/og-image.png',
      ogType: 'website',
      status: SEOStatus.ACTIVE,
      analytics: {
        impressions: 50000,
        clicks: 2500,
        avgPosition: 15.3,
        ctr: 5.0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.seoConfigs.set(globalSEO.id, globalSEO)

    // 页面SEO配置
    const pageSEOs: Partial<SEOConfig>[] = [
      {
        type: SEOType.PAGE,
        targetId: 'PAGE-HOME',
        targetName: '首页',
        title: '道达智能官网 - 智能车辆管理解决方案',
        description:
          '道达智能提供专业智能车辆管理平台，涵盖车辆监控、车队调度、油耗管理、安全预警等功能',
        keywords: ['道达智能', '车辆管理平台', '车队管理系统'],
        status: SEOStatus.ACTIVE,
      },
      {
        type: SEOType.PAGE,
        targetId: 'PAGE-PRODUCTS',
        targetName: '产品中心',
        title: '产品中心 - 道达智能车辆管理产品',
        description: '道达智能产品中心，提供车联网终端、车队管理平台、智能调度系统等产品',
        keywords: ['车联网终端', '车队管理平台', '智能调度系统'],
        status: SEOStatus.ACTIVE,
      },
      {
        type: SEOType.PAGE,
        targetId: 'PAGE-SOLUTIONS',
        targetName: '解决方案',
        title: '解决方案 - 道达智能行业解决方案',
        description: '道达智能为物流运输、公共交通、企业车队等行业提供定制化智能管理解决方案',
        keywords: ['车队解决方案', '物流车队管理', '公共交通管理'],
        status: SEOStatus.ACTIVE,
      },
      {
        type: SEOType.PAGE,
        targetId: 'PAGE-ABOUT',
        targetName: '关于我们',
        title: '关于道达智能 - 公司介绍',
        description: '道达智能科技有限公司是一家专注于智能车辆管理领域的创新型科技企业',
        keywords: ['道达智能', '公司介绍', '企业愿景'],
        status: SEOStatus.ACTIVE,
      },
    ]

    pageSEOs.forEach((seo, index) => {
      const id = `SEO-PAGE-${(index + 1).toString().padStart(3, '0')}`
      const config: SEOConfig = {
        id,
        type: seo.type!,
        targetId: seo.targetId,
        targetName: seo.targetName,
        title: seo.title || '',
        description: seo.description || '',
        keywords: seo.keywords || [],
        status: seo.status || SEOStatus.DRAFT,
        analytics: {
          impressions: Math.floor(Math.random() * 10000) + 1000,
          clicks: Math.floor(Math.random() * 500) + 50,
          avgPosition: Math.random() * 50 + 5,
          ctr: Math.random() * 10 + 2,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.seoConfigs.set(id, config)
    })

    // 关键词库
    const defaultKeywords: Partial<Keyword>[] = [
      {
        word: '车队管理系统',
        type: KeywordType.PRIMARY,
        searchVolume: 5000,
        difficulty: 45,
        currentPosition: 12,
      },
      {
        word: '车辆管理平台',
        type: KeywordType.PRIMARY,
        searchVolume: 3000,
        difficulty: 35,
        currentPosition: 8,
      },
      {
        word: '车联网',
        type: KeywordType.PRIMARY,
        searchVolume: 8000,
        difficulty: 60,
        currentPosition: 25,
      },
      {
        word: '智能车辆管理',
        type: KeywordType.SECONDARY,
        searchVolume: 2000,
        difficulty: 30,
        currentPosition: 15,
      },
      {
        word: '车辆监控系统',
        type: KeywordType.SECONDARY,
        searchVolume: 1500,
        difficulty: 25,
        currentPosition: 10,
      },
      {
        word: '物流车队管理',
        type: KeywordType.SECONDARY,
        searchVolume: 1800,
        difficulty: 28,
        currentPosition: 18,
      },
      {
        word: 'GPS车辆定位',
        type: KeywordType.LONG_TAIL,
        searchVolume: 800,
        difficulty: 15,
        currentPosition: 5,
      },
      {
        word: '油耗管理系统',
        type: KeywordType.LONG_TAIL,
        searchVolume: 500,
        difficulty: 12,
        currentPosition: 3,
      },
      {
        word: '司机管理软件',
        type: KeywordType.LONG_TAIL,
        searchVolume: 400,
        difficulty: 10,
        currentPosition: 7,
      },
    ]

    defaultKeywords.forEach((kw, index) => {
      const id = `KW-${(index + 1).toString().padStart(3, '0')}`
      const keyword: Keyword = {
        id,
        word: kw.word!,
        type: kw.type!,
        searchVolume: kw.searchVolume,
        difficulty: kw.difficulty,
        currentPosition: kw.currentPosition,
        relatedWords:
          kw.type === KeywordType.PRIMARY
            ? ['车队管理软件', '车辆调度系统', '物流管理平台']
            : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.keywords.set(id, keyword)
    })
  }

  // 获取全局SEO设置
  async getGlobalConfig(): Promise<SEOConfig | null> {
    return this.seoConfigs.get('SEO-GLOBAL') || null
  }

  // 更新全局SEO设置
  async updateGlobalConfig(data: Partial<SEOConfig>): Promise<SEOConfig | null> {
    const global = this.seoConfigs.get('SEO-GLOBAL')
    if (!global) return null

    const updated: SEOConfig = {
      ...global,
      ...data,
      updatedAt: new Date(),
    }

    this.seoConfigs.set('SEO-GLOBAL', updated)
    return updated
  }

  // 获取所有SEO配置
  async getAllConfigs(type?: SEOType): Promise<SEOConfig[]> {
    let configs = Array.from(this.seoConfigs.values())

    if (type) {
      configs = configs.filter((c) => c.type === type)
    }

    return configs.filter((c) => c.type !== SEOType.GLOBAL)
  }

  // 获取单个SEO配置
  async getConfigById(id: string): Promise<SEOConfig | null> {
    return this.seoConfigs.get(id) || null
  }

  // 获取目标(页面/文章/产品)的SEO配置
  async getConfigByTarget(targetId: string): Promise<SEOConfig | null> {
    return Array.from(this.seoConfigs.values()).find((c) => c.targetId === targetId) || null
  }

  // 创建SEO配置
  async createConfig(data: Partial<SEOConfig>): Promise<SEOConfig> {
    const id = `SEO-${Date.now().toString(36).toUpperCase()}`

    const config: SEOConfig = {
      id,
      type: data.type || SEOType.PAGE,
      targetId: data.targetId,
      targetName: data.targetName,
      title: data.title || '',
      description: data.description || '',
      keywords: data.keywords || [],
      ogTitle: data.ogTitle,
      ogDescription: data.ogDescription,
      ogImage: data.ogImage,
      ogType: data.ogType,
      structuredData: data.structuredData,
      status: data.status || SEOStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.seoConfigs.set(id, config)
    return config
  }

  // 更新SEO配置
  async updateConfig(id: string, data: Partial<SEOConfig>): Promise<SEOConfig | null> {
    const config = this.seoConfigs.get(id)
    if (!config) return null

    const updated: SEOConfig = {
      ...config,
      ...data,
      updatedAt: new Date(),
    }

    this.seoConfigs.set(id, updated)
    return updated
  }

  // 删除SEO配置
  async deleteConfig(id: string): Promise<{ success: boolean; message: string }> {
    if (!this.seoConfigs.has(id)) {
      return { success: false, message: 'SEO配置不存在' }
    }

    this.seoConfigs.delete(id)
    return { success: true, message: '删除成功' }
  }

  // SEO分析
  async analyzeSEO(configId: string): Promise<SEOAnalysis> {
    const config = this.seoConfigs.get(configId)
    if (!config) {
      return {
        score: 0,
        issues: [{ type: 'error', field: 'config', message: '配置不存在' }],
        suggestions: [],
      }
    }

    const issues: SEOIssue[] = []
    let score = 100

    // 标题检查
    if (!config.title) {
      issues.push({
        type: 'error',
        field: 'title',
        message: '标题缺失',
        suggestion: '请设置页面标题',
      })
      score -= 20
    } else if (config.title.length < 30) {
      issues.push({
        type: 'warning',
        field: 'title',
        message: '标题过短',
        suggestion: '建议标题长度30-60字符',
      })
      score -= 10
    } else if (config.title.length > 60) {
      issues.push({
        type: 'warning',
        field: 'title',
        message: '标题过长',
        suggestion: '标题超过60字符会被截断',
      })
      score -= 5
    }

    // 描述检查
    if (!config.description) {
      issues.push({
        type: 'error',
        field: 'description',
        message: '描述缺失',
        suggestion: '请设置页面描述',
      })
      score -= 15
    } else if (config.description.length < 120) {
      issues.push({
        type: 'warning',
        field: 'description',
        message: '描述过短',
        suggestion: '建议描述长度120-160字符',
      })
      score -= 8
    } else if (config.description.length > 160) {
      issues.push({
        type: 'warning',
        field: 'description',
        message: '描述过长',
        suggestion: '描述超过160字符会被截断',
      })
      score -= 5
    }

    // 关键词检查
    if (!config.keywords || config.keywords.length === 0) {
      issues.push({
        type: 'error',
        field: 'keywords',
        message: '关键词缺失',
        suggestion: '请添加至少3个关键词',
      })
      score -= 15
    } else if (config.keywords.length < 3) {
      issues.push({
        type: 'warning',
        field: 'keywords',
        message: '关键词数量不足',
        suggestion: '建议添加5-10个关键词',
      })
      score -= 8
    }

    // OG标签检查
    if (!config.ogTitle) {
      issues.push({
        type: 'info',
        field: 'ogTitle',
        message: 'OG标题缺失',
        suggestion: '建议设置社交媒体分享标题',
      })
      score -= 3
    }
    if (!config.ogDescription) {
      issues.push({
        type: 'info',
        field: 'ogDescription',
        message: 'OG描述缺失',
        suggestion: '建议设置社交媒体分享描述',
      })
      score -= 3
    }
    if (!config.ogImage) {
      issues.push({
        type: 'info',
        field: 'ogImage',
        message: 'OG图片缺失',
        suggestion: '建议设置社交媒体分享图片',
      })
      score -= 5
    }

    // 结构化数据检查
    if (!config.structuredData) {
      issues.push({
        type: 'info',
        field: 'structuredData',
        message: '结构化数据缺失',
        suggestion: '建议添加Schema.org结构化数据',
      })
      score -= 5
    }

    const suggestions = [
      '确保关键词出现在标题前半部分',
      '在描述中自然包含主要关键词',
      '为重要页面添加结构化数据',
      '定期更新内容保持新鲜度',
    ]

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
    }
  }

  // 关键词管理
  async getAllKeywords(type?: KeywordType): Promise<Keyword[]> {
    let keywords = Array.from(this.keywords.values())

    if (type) {
      keywords = keywords.filter((k) => k.type === type)
    }

    return keywords.sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0))
  }

  async getKeywordById(id: string): Promise<Keyword | null> {
    return this.keywords.get(id) || null
  }

  async createKeyword(data: Partial<Keyword>): Promise<Keyword> {
    const id = `KW-${Date.now().toString(36).toUpperCase()}`

    const keyword: Keyword = {
      id,
      word: data.word || '',
      type: data.type || KeywordType.SECONDARY,
      category: data.category,
      searchVolume: data.searchVolume,
      difficulty: data.difficulty,
      currentPosition: data.currentPosition,
      relatedWords: data.relatedWords,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.keywords.set(id, keyword)
    return keyword
  }

  async updateKeyword(id: string, data: Partial<Keyword>): Promise<Keyword | null> {
    const keyword = this.keywords.get(id)
    if (!keyword) return null

    const updated: Keyword = {
      ...keyword,
      ...data,
      updatedAt: new Date(),
    }

    this.keywords.set(id, updated)
    return updated
  }

  async deleteKeyword(id: string): Promise<{ success: boolean; message: string }> {
    if (!this.keywords.has(id)) {
      return { success: false, message: '关键词不存在' }
    }

    this.keywords.delete(id)
    return { success: true, message: '删除成功' }
  }

  // 搜索关键词
  async searchKeywords(query: string): Promise<Keyword[]> {
    const lowerQuery = query.toLowerCase()

    return Array.from(this.keywords.values()).filter((k) =>
      k.word.toLowerCase().includes(lowerQuery),
    )
  }

  // 获取SEO统计
  async getStats(): Promise<SEOStats> {
    const configs = Array.from(this.seoConfigs.values())
    const keywords = Array.from(this.keywords.values())

    const activeConfigs = configs.filter((c) => c.status === SEOStatus.ACTIVE)
    const primaryKeywords = keywords.filter((k) => k.type === KeywordType.PRIMARY)

    const totalImpressions = configs.reduce((sum, c) => sum + (c.analytics?.impressions || 0), 0)
    const totalClicks = configs.reduce((sum, c) => sum + (c.analytics?.clicks || 0), 0)

    const avgPosition =
      configs.length > 0
        ? configs.reduce((sum, c) => sum + (c.analytics?.avgPosition || 0), 0) / configs.length
        : 0

    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

    return {
      totalConfigs: configs.filter((c) => c.type !== SEOType.GLOBAL).length,
      activeConfigs: activeConfigs.filter((c) => c.type !== SEOType.GLOBAL).length,
      totalKeywords: keywords.length,
      primaryKeywords: primaryKeywords.length,
      avgPosition: Math.round(avgPosition * 10) / 10,
      avgCTR: Math.round(avgCTR * 100) / 100,
      totalImpressions,
      totalClicks,
    }
  }

  // 批量更新排名数据
  async updateRankings(rankings: Record<string, number>): Promise<void> {
    for (const [keywordId, position] of Object.entries(rankings)) {
      const keyword = this.keywords.get(keywordId)
      if (keyword) {
        keyword.currentPosition = position
        keyword.updatedAt = new Date()
      }
    }
  }
}
