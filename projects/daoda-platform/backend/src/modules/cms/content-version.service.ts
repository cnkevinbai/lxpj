/**
 * 内容版本管理服务
 * 内容版本控制、历史记录、版本对比、回退
 */
import { Injectable } from '@nestjs/common'

// 版本状态
export enum ContentVersionStatus {
  DRAFT = 'DRAFT', // 草稿
  REVIEWING = 'REVIEWING', // 审核中
  APPROVED = 'APPROVED', // 已审核
  PUBLISHED = 'PUBLISHED', // 已发布
  SCHEDULED = 'SCHEDULED', // 定时发布
  ARCHIVED = 'ARCHIVED', // 已归档
  UNPUBLISHED = 'UNPUBLISHED', // 已下线
}

// 内容类型
export enum ContentType {
  ARTICLE = 'ARTICLE', // 文章
  NEWS = 'NEWS', // 新闻
  PRODUCT = 'PRODUCT', // 产品
  CASE = 'CASE', // 案例
  VIDEO = 'VIDEO', // 视频
  IMAGE = 'IMAGE', // 图片
  PAGE = 'PAGE', // 页面
  BANNER = 'BANNER', // Banner
}

// 内容版本接口
export interface ContentVersion {
  id: string
  contentId: string
  contentTitle: string
  contentType: ContentType
  versionNumber: string // 版本号 (v1.0, v1.1, v2.0)
  majorVersion: number
  minorVersion: number
  status: ContentVersionStatus
  title: string // 版本标题
  content?: string // 内容正文
  summary?: string // 摘要
  thumbnail?: string // 缩略图
  author?: string
  authorName?: string
  reviewer?: string
  reviewerName?: string
  reviewedAt?: Date
  publisher?: string
  publisherName?: string
  publishedAt?: Date
  scheduledAt?: Date // 定时发布时间
  unpublishedAt?: Date // 下线时间
  changeLog?: string // 变更说明
  parentId?: string // 父版本ID
  isCurrent?: boolean // 是否当前版本
  isPublished?: boolean // 是否已发布版本
  viewCount?: number // 浏览次数
  likeCount?: number // 点赞数
  createdAt: Date
}

// 内容实体接口
export interface ContentEntity {
  id: string
  title: string
  contentType: ContentType
  siteId?: string // 所属站点
  categoryId?: string // 分类ID
  categoryName?: string
  tags?: string[]
  currentVersionId: string // 当前版本ID
  publishedVersionId?: string // 已发布版本ID
  totalVersions: number // 版本总数
  status: ContentVersionStatus
  author?: string
  authorName?: string
  createdAt: Date
  updatedAt: Date
}

// 版本变更记录
export interface VersionChange {
  id: string
  versionId: string
  changeType:
    | 'CONTENT_MODIFIED'
    | 'TITLE_CHANGED'
    | 'STATUS_CHANGED'
    | 'PUBLISHED'
    | 'UNPUBLISHED'
    | 'ARCHIVED'
  description: string
  oldValue?: string
  newValue?: string
  changedBy?: string
  changedByName?: string
  changedAt: Date
}

// 版本对比结果
export interface VersionCompare {
  contentId: string
  version1: ContentVersion
  version2: ContentVersion
  titleDiff: { old: string; new: string; changed: boolean }
  contentDiff: { additions: number; deletions: number; unchanged: number }
  summaryDiff: { old: string; new: string; changed: boolean }
  changes: VersionChange[]
  summary: string
}

@Injectable()
export class ContentVersionService {
  private contentEntities: Map<string, ContentEntity> = new Map()
  private contentVersions: Map<string, ContentVersion> = new Map()
  private versionChanges: Map<string, VersionChange[]> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化内容实体
    const mockEntities: ContentEntity[] = [
      {
        id: 'CE-001',
        title: '公司简介',
        contentType: ContentType.PAGE,
        siteId: 'SITE-001',
        currentVersionId: 'CV-003',
        publishedVersionId: 'CV-003',
        totalVersions: 3,
        status: ContentVersionStatus.PUBLISHED,
        authorName: '张三',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'CE-002',
        title: '产品发布新闻',
        contentType: ContentType.NEWS,
        siteId: 'SITE-001',
        categoryId: 'CAT-001',
        categoryName: '产品动态',
        tags: ['产品', '发布'],
        currentVersionId: 'CV-006',
        publishedVersionId: 'CV-006',
        totalVersions: 2,
        status: ContentVersionStatus.PUBLISHED,
        authorName: '李四',
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date(),
      },
      {
        id: 'CE-003',
        title: 'IOV平台介绍',
        contentType: ContentType.PRODUCT,
        siteId: 'SITE-001',
        categoryId: 'CAT-002',
        categoryName: '智能车辆',
        tags: ['车辆', '智能'],
        currentVersionId: 'CV-009',
        publishedVersionId: 'CV-008',
        totalVersions: 3,
        status: ContentVersionStatus.REVIEWING,
        authorName: '王五',
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date(),
      },
      {
        id: 'CE-004',
        title: '客户案例：眉山市智慧交通',
        contentType: ContentType.CASE,
        siteId: 'SITE-001',
        categoryId: 'CAT-003',
        categoryName: '成功案例',
        tags: ['案例', '智慧交通'],
        currentVersionId: 'CV-012',
        publishedVersionId: 'CV-011',
        totalVersions: 2,
        status: ContentVersionStatus.PUBLISHED,
        authorName: '赵六',
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date(),
      },
      {
        id: 'CE-005',
        title: '技术白皮书下载',
        contentType: ContentType.ARTICLE,
        siteId: 'SITE-001',
        categoryId: 'CAT-004',
        categoryName: '技术资料',
        tags: ['白皮书', '技术'],
        currentVersionId: 'CV-015',
        totalVersions: 1,
        status: ContentVersionStatus.DRAFT,
        authorName: '钱七',
        createdAt: new Date('2026-03-15'),
        updatedAt: new Date(),
      },
      {
        id: 'CE-006',
        title: '首页Banner2026春季',
        contentType: ContentType.BANNER,
        siteId: 'SITE-001',
        currentVersionId: 'CV-018',
        publishedVersionId: 'CV-017',
        totalVersions: 2,
        status: ContentVersionStatus.SCHEDULED,
        authorName: '周八',
        createdAt: new Date('2026-03-20'),
        updatedAt: new Date(),
      },
      {
        id: 'CE-007',
        title: '产品演示视频',
        contentType: ContentType.VIDEO,
        siteId: 'SITE-001',
        categoryId: 'CAT-005',
        categoryName: '视频中心',
        tags: ['视频', '演示'],
        currentVersionId: 'CV-021',
        publishedVersionId: 'CV-020',
        totalVersions: 2,
        status: ContentVersionStatus.ARCHIVED,
        authorName: '吴九',
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date(),
      },
    ]

    mockEntities.forEach((entity) => {
      this.contentEntities.set(entity.id, entity)
    })

    // 初始化内容版本
    const mockVersions: ContentVersion[] = [
      // 公司简介版本
      {
        id: 'CV-001',
        contentId: 'CE-001',
        contentTitle: '公司简介',
        contentType: ContentType.PAGE,
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.ARCHIVED,
        title: '公司简介',
        content: '道达智能是一家专注于...',
        authorName: '张三',
        publishedAt: new Date('2026-01-01'),
        unpublishedAt: new Date('2026-02-01'),
        viewCount: 1000,
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'CV-002',
        contentId: 'CE-001',
        contentTitle: '公司简介',
        contentType: ContentType.PAGE,
        versionNumber: 'v1.1',
        majorVersion: 1,
        minorVersion: 1,
        status: ContentVersionStatus.ARCHIVED,
        title: '公司简介（更新版）',
        content: '道达智能是一家专注于智能车辆管理...',
        authorName: '张三',
        parentId: 'CV-001',
        publishedAt: new Date('2026-02-01'),
        unpublishedAt: new Date('2026-03-01'),
        viewCount: 1500,
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'CV-003',
        contentId: 'CE-001',
        contentTitle: '公司简介',
        contentType: ContentType.PAGE,
        versionNumber: 'v2.0',
        majorVersion: 2,
        minorVersion: 0,
        status: ContentVersionStatus.PUBLISHED,
        title: '道达智能 - 公司简介',
        content: '道达智能是一家专注于智能车辆管理平台...',
        authorName: '张三',
        parentId: 'CV-002',
        isCurrent: true,
        isPublished: true,
        publishedAt: new Date('2026-03-01'),
        viewCount: 2000,
        createdAt: new Date('2026-03-01'),
      },
      // 产品发布新闻版本
      {
        id: 'CV-004',
        contentId: 'CE-002',
        contentTitle: '产品发布新闻',
        contentType: ContentType.NEWS,
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.ARCHIVED,
        title: '新产品发布',
        content: '我们很高兴地宣布...',
        summary: '新产品发布通知',
        authorName: '李四',
        publishedAt: new Date('2026-02-01'),
        viewCount: 500,
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'CV-005',
        contentId: 'CE-002',
        contentTitle: '产品发布新闻',
        contentType: ContentType.NEWS,
        versionNumber: 'v1.1',
        majorVersion: 1,
        minorVersion: 1,
        status: ContentVersionStatus.DRAFT,
        title: '新产品发布（修订版）',
        content: '我们很高兴地宣布新产品...',
        authorName: '李四',
        parentId: 'CV-004',
        createdAt: new Date('2026-02-15'),
      },
      {
        id: 'CV-006',
        contentId: 'CE-002',
        contentTitle: '产品发布新闻',
        contentType: ContentType.NEWS,
        versionNumber: 'v2.0',
        majorVersion: 2,
        minorVersion: 0,
        status: ContentVersionStatus.PUBLISHED,
        title: '道达智能发布新一代IOV平台',
        content: '道达智能正式发布新一代智能车辆管理平台...',
        summary: '新一代IOV平台正式发布',
        thumbnail: '/images/news-iov.jpg',
        authorName: '李四',
        parentId: 'CV-005',
        isCurrent: true,
        isPublished: true,
        publishedAt: new Date('2026-03-01'),
        viewCount: 800,
        createdAt: new Date('2026-03-01'),
      },
      // IOV平台介绍版本
      {
        id: 'CV-007',
        contentId: 'CE-003',
        contentTitle: 'IOV平台介绍',
        contentType: ContentType.PRODUCT,
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.ARCHIVED,
        title: 'IOV平台',
        content: 'IOV平台是...',
        authorName: '王五',
        publishedAt: new Date('2026-02-15'),
        viewCount: 300,
        createdAt: new Date('2026-02-15'),
      },
      {
        id: 'CV-008',
        contentId: 'CE-003',
        contentTitle: 'IOV平台介绍',
        contentType: ContentType.PRODUCT,
        versionNumber: 'v1.1',
        majorVersion: 1,
        minorVersion: 1,
        status: ContentVersionStatus.PUBLISHED,
        title: 'IOV智能车辆管理平台',
        content: 'IOV智能车辆管理平台是道达智能的核心产品...',
        isPublished: true,
        publishedAt: new Date('2026-03-01'),
        viewCount: 450,
        createdAt: new Date('2026-03-01'),
      },
      {
        id: 'CV-009',
        contentId: 'CE-003',
        contentTitle: 'IOV平台介绍',
        contentType: ContentType.PRODUCT,
        versionNumber: 'v2.0-beta',
        majorVersion: 2,
        minorVersion: 0,
        status: ContentVersionStatus.REVIEWING,
        title: 'IOV智能车辆管理平台 V2.0',
        content: '新一代IOV平台全面升级...',
        authorName: '王五',
        parentId: 'CV-008',
        isCurrent: true,
        changeLog: '新增模块化架构介绍、云边端协同说明',
        createdAt: new Date('2026-03-15'),
      },
      // 客户案例版本
      {
        id: 'CV-010',
        contentId: 'CE-004',
        contentTitle: '客户案例',
        contentType: ContentType.CASE,
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.ARCHIVED,
        title: '眉山案例',
        content: '眉山市智慧交通项目...',
        authorName: '赵六',
        publishedAt: new Date('2026-03-01'),
        viewCount: 200,
        createdAt: new Date('2026-03-01'),
      },
      {
        id: 'CV-011',
        contentId: 'CE-004',
        contentTitle: '客户案例',
        contentType: ContentType.CASE,
        versionNumber: 'v1.1',
        majorVersion: 1,
        minorVersion: 1,
        status: ContentVersionStatus.PUBLISHED,
        title: '眉山市智慧交通项目案例',
        content: '眉山市智慧交通项目详细案例分析...',
        thumbnail: '/images/case-meishan.jpg',
        authorName: '赵六',
        parentId: 'CV-010',
        isPublished: true,
        publishedAt: new Date('2026-03-15'),
        viewCount: 350,
        createdAt: new Date('2026-03-15'),
      },
      {
        id: 'CV-012',
        contentId: 'CE-004',
        contentTitle: '客户案例',
        contentType: ContentType.CASE,
        versionNumber: 'v2.0',
        majorVersion: 2,
        minorVersion: 0,
        status: ContentVersionStatus.DRAFT,
        title: '眉山市智慧交通完整案例',
        content: '完整的项目实施过程...',
        authorName: '赵六',
        parentId: 'CV-011',
        isCurrent: true,
        createdAt: new Date('2026-03-20'),
      },
      // 技术白皮书版本
      {
        id: 'CV-015',
        contentId: 'CE-005',
        contentTitle: '技术白皮书下载',
        contentType: ContentType.ARTICLE,
        versionNumber: 'v1.0-draft',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.DRAFT,
        title: 'IOV平台技术白皮书',
        content: '技术架构详解...',
        authorName: '钱七',
        isCurrent: true,
        createdAt: new Date('2026-03-15'),
      },
      // Banner版本
      {
        id: 'CV-017',
        contentId: 'CE-006',
        contentTitle: '首页Banner',
        contentType: ContentType.BANNER,
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.UNPUBLISHED,
        title: '2026春季Banner',
        thumbnail: '/images/banner-spring.jpg',
        authorName: '周八',
        publishedAt: new Date('2026-03-01'),
        unpublishedAt: new Date('2026-03-25'),
        createdAt: new Date('2026-03-01'),
      },
      {
        id: 'CV-018',
        contentId: 'CE-006',
        contentTitle: '首页Banner',
        contentType: ContentType.BANNER,
        versionNumber: 'v2.0',
        majorVersion: 2,
        minorVersion: 0,
        status: ContentVersionStatus.SCHEDULED,
        title: '2026春季新版Banner',
        thumbnail: '/images/banner-spring-new.jpg',
        authorName: '周八',
        parentId: 'CV-017',
        isCurrent: true,
        scheduledAt: new Date('2026-04-01'),
        createdAt: new Date('2026-03-20'),
      },
      // 视频版本
      {
        id: 'CV-020',
        contentId: 'CE-007',
        contentTitle: '产品演示视频',
        contentType: ContentType.VIDEO,
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: ContentVersionStatus.ARCHIVED,
        title: '产品演示',
        content: '/videos/demo.mp4',
        thumbnail: '/images/video-cover.jpg',
        authorName: '吴九',
        publishedAt: new Date('2026-01-15'),
        viewCount: 100,
        createdAt: new Date('2026-01-15'),
      },
      {
        id: 'CV-021',
        contentId: 'CE-007',
        contentTitle: '产品演示视频',
        contentType: ContentType.VIDEO,
        versionNumber: 'v2.0',
        majorVersion: 2,
        minorVersion: 0,
        status: ContentVersionStatus.ARCHIVED,
        title: '产品演示 V2',
        content: '/videos/demo-v2.mp4',
        thumbnail: '/images/video-cover-v2.jpg',
        authorName: '吴九',
        parentId: 'CV-020',
        createdAt: new Date('2026-02-15'),
      },
    ]

    mockVersions.forEach((version) => {
      this.contentVersions.set(version.id, version)
    })

    // 初始化变更记录
    const mockChanges: VersionChange[] = [
      {
        id: 'VC-001',
        versionId: 'CV-002',
        changeType: 'CONTENT_MODIFIED',
        description: '更新公司简介内容',
        changedByName: '张三',
        changedAt: new Date('2026-02-01'),
      },
      {
        id: 'VC-002',
        versionId: 'CV-003',
        changeType: 'TITLE_CHANGED',
        description: '标题优化',
        oldValue: '公司简介（更新版）',
        newValue: '道达智能 - 公司简介',
        changedByName: '张三',
        changedAt: new Date('2026-03-01'),
      },
      {
        id: 'VC-003',
        versionId: 'CV-003',
        changeType: 'PUBLISHED',
        description: '版本发布',
        changedByName: '张三',
        changedAt: new Date('2026-03-01'),
      },
      {
        id: 'VC-004',
        versionId: 'CV-006',
        changeType: 'CONTENT_MODIFIED',
        description: '新增产品特性介绍',
        changedByName: '李四',
        changedAt: new Date('2026-03-01'),
      },
      {
        id: 'VC-005',
        versionId: 'CV-009',
        changeType: 'STATUS_CHANGED',
        description: '提交审核',
        oldValue: 'DRAFT',
        newValue: 'REVIEWING',
        changedByName: '王五',
        changedAt: new Date('2026-03-15'),
      },
    ]

    mockChanges.forEach((change) => {
      const versionChanges = this.versionChanges.get(change.versionId) || []
      versionChanges.push(change)
      this.versionChanges.set(change.versionId, versionChanges)
    })
  }

  // 获取内容实体列表
  async getContentEntities(query?: {
    contentType?: ContentType
    siteId?: string
    categoryId?: string
    status?: ContentVersionStatus
  }): Promise<ContentEntity[]> {
    let entities = Array.from(this.contentEntities.values())
    if (query) {
      if (query.contentType) entities = entities.filter((e) => e.contentType === query.contentType)
      if (query.siteId) entities = entities.filter((e) => e.siteId === query.siteId)
      if (query.categoryId) entities = entities.filter((e) => e.categoryId === query.categoryId)
      if (query.status) entities = entities.filter((e) => e.status === query.status)
    }
    return entities.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // 获取内容实体详情
  async getContentEntity(id: string): Promise<ContentEntity | null> {
    return this.contentEntities.get(id) || null
  }

  // 获取内容版本列表
  async getContentVersions(contentId?: string): Promise<ContentVersion[]> {
    let versions = Array.from(this.contentVersions.values())
    if (contentId) versions = versions.filter((v) => v.contentId === contentId)
    return versions.sort((a, b) => {
      if (a.majorVersion !== b.majorVersion) return b.majorVersion - a.majorVersion
      return b.minorVersion - a.minorVersion
    })
  }

  // 获取内容版本详情
  async getContentVersion(id: string): Promise<ContentVersion | null> {
    return this.contentVersions.get(id) || null
  }

  // 获取当前版本
  async getCurrentVersion(contentId: string): Promise<ContentVersion | null> {
    const versions = await this.getContentVersions(contentId)
    return versions.find((v) => v.isCurrent) || versions[0] || null
  }

  // 获取已发布版本
  async getPublishedVersion(contentId: string): Promise<ContentVersion | null> {
    const versions = await this.getContentVersions(contentId)
    return versions.find((v) => v.isPublished) || null
  }

  // 版本对比
  async compareVersions(versionId1: string, versionId2: string): Promise<VersionCompare | null> {
    const v1 = this.contentVersions.get(versionId1)
    const v2 = this.contentVersions.get(versionId2)
    if (!v1 || !v2) return null

    // 简化对比逻辑
    const content1 = v1.content || ''
    const content2 = v2.content || ''
    const additions = content2.length > content1.length ? content2.length - content1.length : 0
    const deletions = content1.length > content2.length ? content1.length - content2.length : 0

    return {
      contentId: v1.contentId,
      version1: v1,
      version2: v2,
      titleDiff: { old: v1.title, new: v2.title, changed: v1.title !== v2.title },
      contentDiff: { additions, deletions, unchanged: Math.min(content1.length, content2.length) },
      summaryDiff: {
        old: v1.summary || '',
        new: v2.summary || '',
        changed: v1.summary !== v2.summary,
      },
      changes: this.versionChanges.get(v2.id) || [],
      summary: `${v1.versionNumber} → ${v2.versionNumber}: ${v1.title !== v2.title ? '标题变更' : ''} ${additions > 0 ? `+${additions}字` : ''} ${deletions > 0 ? `-${deletions}字` : ''}`,
    }
  }

  // 发布版本
  async publishVersion(
    versionId: string,
    publisher?: string,
    publisherName?: string,
    scheduledAt?: Date,
  ): Promise<ContentVersion | null> {
    const version = this.contentVersions.get(versionId)
    const entity = this.contentEntities.get(version?.contentId || '')
    if (!version || !entity) return null

    // 将当前发布版本下线
    const currentPublished = await this.getPublishedVersion(version.contentId)
    if (currentPublished) {
      currentPublished.status = ContentVersionStatus.ARCHIVED
      currentPublished.isPublished = false
      currentPublished.unpublishedAt = new Date()
    }

    // 发布新版本
    version.status = scheduledAt ? ContentVersionStatus.SCHEDULED : ContentVersionStatus.PUBLISHED
    version.isPublished = true
    version.isCurrent = true
    version.publisher = publisher
    version.publisherName = publisherName
    version.publishedAt = scheduledAt || new Date()
    version.scheduledAt = scheduledAt

    // 更新实体
    entity.publishedVersionId = versionId
    entity.status = version.status
    entity.updatedAt = new Date()

    return version
  }

  // 回退版本
  async rollbackVersion(
    contentId: string,
    targetVersionId: string,
  ): Promise<ContentVersion | null> {
    const targetVersion = this.contentVersions.get(targetVersionId)
    const entity = this.contentEntities.get(contentId)
    if (!targetVersion || !entity) return null

    // 将当前版本标记为非当前
    const currentVersion = await this.getCurrentVersion(contentId)
    if (currentVersion) {
      currentVersion.isCurrent = false
    }

    // 设置目标版本为当前
    targetVersion.isCurrent = true
    entity.currentVersionId = targetVersionId
    entity.updatedAt = new Date()

    return targetVersion
  }

  // 提交审核
  async submitForReview(versionId: string): Promise<ContentVersion | null> {
    const version = this.contentVersions.get(versionId)
    if (!version) return null

    version.status = ContentVersionStatus.REVIEWING
    return version
  }

  // 审核通过
  async approveVersion(
    versionId: string,
    reviewer?: string,
    reviewerName?: string,
  ): Promise<ContentVersion | null> {
    const version = this.contentVersions.get(versionId)
    if (!version) return null

    version.status = ContentVersionStatus.APPROVED
    version.reviewer = reviewer
    version.reviewerName = reviewerName
    version.reviewedAt = new Date()

    return version
  }

  // 版本归档
  async archiveVersion(versionId: string): Promise<ContentVersion | null> {
    const version = this.contentVersions.get(versionId)
    if (!version) return null

    version.status = ContentVersionStatus.ARCHIVED
    version.isCurrent = false
    version.isPublished = false

    return version
  }

  // 获取版本变更记录
  async getVersionChanges(versionId: string): Promise<VersionChange[]> {
    return this.versionChanges.get(versionId) || []
  }

  // 获取内容统计
  async getContentStats(): Promise<{
    totalEntities: number
    totalVersions: number
    publishedVersions: number
    draftVersions: number
    reviewingVersions: number
    scheduledVersions: number
    byContentType: Record<ContentType, number>
  }> {
    const entities = Array.from(this.contentEntities.values())
    const versions = Array.from(this.contentVersions.values())

    const byContentType: Record<ContentType, number> = {} as any
    entities.forEach((e) => {
      byContentType[e.contentType] = (byContentType[e.contentType] || 0) + 1
    })

    return {
      totalEntities: entities.length,
      totalVersions: versions.length,
      publishedVersions: versions.filter((v) => v.status === ContentVersionStatus.PUBLISHED).length,
      draftVersions: versions.filter((v) => v.status === ContentVersionStatus.DRAFT).length,
      reviewingVersions: versions.filter((v) => v.status === ContentVersionStatus.REVIEWING).length,
      scheduledVersions: versions.filter((v) => v.status === ContentVersionStatus.SCHEDULED).length,
      byContentType,
    }
  }
}
