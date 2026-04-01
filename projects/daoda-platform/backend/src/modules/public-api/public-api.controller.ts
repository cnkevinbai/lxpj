/**
 * 公开 API 控制器
 * 官网数据对接接口
 *
 * 功能:
 * - 新闻列表/详情
 * - 案例列表/详情
 * - 视频列表/详情
 * - 产品列表/详情
 * - 表单提交(线索、咨询)
 * - 网站配置
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger'
import { ApiKeyGuard } from '../../common/guards/api-key.guard'
import { PrismaService } from '../../common/prisma/prisma.service'

// ============================================
// DTO 定义
// ============================================

/**
 * 线索提交 DTO
 */
class LeadSubmitDto {
  name: string
  company?: string
  phone?: string
  email?: string
  source?: string
  contact?: string
  remark?: string
}

/**
 * 咨询提交 DTO
 */
class InquirySubmitDto {
  name: string
  company?: string
  phone?: string
  email?: string
  message: string
  type?: string // product, service, partnership, other
}

/**
 * 合作申请 DTO
 */
class PartnershipSubmitDto {
  company: string
  contactName: string
  phone: string
  email?: string
  partnershipType: string // dealer, agent, oem, supplier
  region?: string
  introduction?: string
}

// ============================================
// Controller
// ============================================

@ApiTags('Public API - 官网数据对接')
@UseGuards(ApiKeyGuard)
@ApiHeader({
  name: 'x-api-key',
  required: true,
  description: 'API Key 认证',
  schema: { type: 'string', example: 'dk_live_xxxxx' },
})
@Controller('api/v1/public')
export class PublicApiController {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // 系统接口
  // ============================================

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '服务正常' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Daoda Platform',
      version: '1.0.0',
    }
  }

  @Get('info')
  @ApiOperation({ summary: '获取平台信息' })
  @ApiResponse({ status: 200, description: '平台信息' })
  getInfo() {
    return {
      name: '道达智能数字化平台',
      version: '1.0.0',
      description: '道达智能 - 智能车辆管理解决方案提供商',
      features: ['CRM', 'ERP', 'MES', '售后服务', '官网门户'],
      support: {
        phone: '400-xxx-xxxx',
        email: 'support@daoda.com',
        website: 'https://www.daoda.com',
      },
    }
  }

  @Get('config')
  @ApiOperation({ summary: '获取网站配置' })
  @ApiResponse({ status: 200, description: '网站全局配置' })
  async getSiteConfig() {
    // 从 system_config 获取网站配置
    const configs = await this.prisma.systemConfig.findMany({
      where: {
        group: 'website',
      },
      select: {
        key: true,
        value: true,
      },
    })

    // 转换为对象格式
    const configMap: Record<string, any> = {}
    for (const config of configs) {
      configMap[config.key] = config.value
    }

    return {
      siteName: configMap.site_name || '道达智能',
      siteLogo: configMap.site_logo || '/logo.png',
      siteDescription: configMap.site_description || '',
      contactPhone: configMap.contact_phone || '400-xxx-xxxx',
      contactEmail: configMap.contact_email || 'contact@daoda.com',
      address: configMap.company_address || '',
      socialLinks: {
        wechat: configMap.wechat_qrcode || '',
        weibo: configMap.weibo_url || '',
        linkedin: configMap.linkedin_url || '',
      },
      seo: {
        title: configMap.seo_title || '道达智能 - 智能车辆管理',
        description: configMap.seo_description || '',
        keywords: configMap.seo_keywords || '',
      },
    }
  }

  // ============================================
  // 新闻接口
  // ============================================

  @Get('news')
  @ApiOperation({ summary: '获取新闻列表 (官网展示)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: '搜索关键词' })
  @ApiResponse({ status: 200, description: '新闻列表' })
  async getNewsList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    const where: any = {
      status: 'PUBLISHED', // Prisma 枚举值是大写
      publishedAt: { not: null },
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { summary: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    const [list, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        select: {
          id: true,
          title: true,
          summary: true,
          cover: true, // 字段名是 cover 不是 coverImage
          authorId: true,
          publishedAt: true,
          views: true, // 字段名是 views 不是 viewCount
          createdAt: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.news.count({ where }),
    ])

    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  @Get('news/:id')
  @ApiOperation({ summary: '获取新闻详情' })
  @ApiParam({ name: 'id', type: String, description: '新闻ID' })
  @ApiResponse({ status: 200, description: '新闻详情' })
  @ApiResponse({ status: 404, description: '新闻不存在' })
  async getNewsDetail(@Param('id') id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    })

    if (!news || news.status !== 'PUBLISHED') {
      return { code: 40401, message: '新闻不存在或未发布' }
    }

    // 更新浏览量
    await this.prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return news
  }

  @Get('news/featured')
  @ApiOperation({ summary: '获取推荐新闻 (首页展示)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '数量' })
  @ApiResponse({ status: 200, description: '推荐新闻列表' })
  async getFeaturedNews(@Query('limit') limit: number = 5) {
    // 按浏览量排序获取热门新闻
    return this.prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { not: null },
      },
      select: {
        id: true,
        title: true,
        summary: true,
        cover: true,
        publishedAt: true,
        views: true,
      },
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    })
  }

  // ============================================
  // 案例接口 (使用 Case 模型)
  // ============================================

  @Get('cases')
  @ApiOperation({ summary: '获取案例列表 (官网展示)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String, description: '案例类型' })
  @ApiResponse({ status: 200, description: '案例列表' })
  async getCaseList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('type') type?: string,
  ) {
    const where: any = {
      status: 'RESOLVED', // 使用 RESOLVED 状态表示已完成的案例
    }

    if (type) {
      where.type = type
    }

    const [list, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        select: {
          id: true,
          caseNo: true,
          title: true,
          summary: true,
          cover: true,
          type: true,
          priority: true,
          views: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.case.count({ where }),
    ])

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  @Get('cases/:id')
  @ApiOperation({ summary: '获取案例详情' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: '案例详情' })
  async getCaseDetail(@Param('id') id: string) {
    const caseDetail = await this.prisma.case.findUnique({
      where: { id },
    })

    if (!caseDetail || caseDetail.status !== 'RESOLVED') {
      return { code: 40402, message: '案例不存在或未完成' }
    }

    // 更新浏览量
    await this.prisma.case.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return caseDetail
  }

  @Get('cases/types')
  @ApiOperation({ summary: '获取案例类型分类' })
  async getCaseTypes() {
    const types = await this.prisma.case.groupBy({
      by: ['type'],
      where: { status: 'RESOLVED' },
      _count: { id: true },
    })

    return types.map((t) => ({
      name: t.type,
      count: t._count.id,
    }))
  }

  // ============================================
  // 视频接口
  // ============================================

  @Get('videos')
  @ApiOperation({ summary: '获取视频列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'source', required: false, type: String, description: '来源' })
  @ApiResponse({ status: 200, description: '视频列表' })
  async getVideoList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('source') source?: string,
  ) {
    const where: any = {
      status: 'PUBLISHED',
    }

    if (source) {
      where.source = source
    }

    const [list, total] = await Promise.all([
      this.prisma.video.findMany({
        where,
        select: {
          id: true,
          title: true,
          summary: true,
          cover: true,
          url: true,
          duration: true,
          source: true,
          views: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.video.count({ where }),
    ])

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  @Get('videos/:id')
  @ApiOperation({ summary: '获取视频详情' })
  async getVideoDetail(@Param('id') id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    })

    if (!video || video.status !== 'PUBLISHED') {
      return { code: 40403, message: '视频不存在或未发布' }
    }

    // 更新浏览量
    await this.prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return video
  }

  // ============================================
  // 产品接口
  // ============================================

  @Get('products')
  @ApiOperation({ summary: '获取产品列表 (官网展示)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({ status: 200, description: '产品列表' })
  async getProductList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
  ) {
    const where: any = {
      status: 'ACTIVE',
    }

    if (category) {
      where.category = category
    }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { code: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    const [list, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select: {
          id: true,
          code: true,
          name: true,
          category: true,
          series: true,
          model: true,
          description: true,
          price: true,
          unit: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ])

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  @Get('products/:id')
  @ApiOperation({ summary: '获取产品详情' })
  async getProductDetail(@Param('id') id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })

    if (!product || product.status !== 'ACTIVE') {
      return { code: 40404, message: '产品不存在或已停用' }
    }

    return product
  }

  @Get('products/categories')
  @ApiOperation({ summary: '获取产品分类' })
  async getProductCategories() {
    const categories = await this.prisma.product.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    })

    return categories.map((c) => ({
      name: c.category,
      count: c._count.id,
    }))
  }

  // ============================================
  // 表单提交接口 (线索、咨询)
  // ============================================

  @Post('leads')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '提交线索 (官网表单)' })
  @ApiBody({ type: LeadSubmitDto })
  @ApiResponse({ status: 201, description: '线索创建成功' })
  async submitLead(@Body() dto: LeadSubmitDto) {
    // 创建线索
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        company: dto.company,
        phone: dto.phone || '',
        email: dto.email,
        source: dto.source || '官网',
        contact: dto.contact,
        status: 'NEW',
      },
    })

    return {
      code: 0,
      data: {
        id: lead.id,
        message: '提交成功，我们会尽快联系您',
      },
    }
  }

  @Post('inquiries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '提交咨询 (官网表单)' })
  @ApiBody({ type: InquirySubmitDto })
  @ApiResponse({ status: 201, description: '咨询提交成功' })
  async submitInquiry(@Body() dto: InquirySubmitDto) {
    // 创建线索，使用 remark 字段存储咨询内容
    const inquiry = await this.prisma.lead.create({
      data: {
        name: dto.name,
        company: dto.company,
        phone: dto.phone || '',
        email: dto.email,
        source: '官网咨询',
        contact: dto.message, // 使用 contact 字段临时存储
        status: 'NEW',
      },
    })

    return {
      code: 0,
      data: {
        id: inquiry.id,
        message: '咨询已收到，客服将尽快回复',
      },
    }
  }

  @Post('partnerships')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '提交合作申请' })
  @ApiBody({ type: PartnershipSubmitDto })
  @ApiResponse({ status: 201, description: '申请提交成功' })
  async submitPartnership(@Body() dto: PartnershipSubmitDto) {
    // 创建线索，标记为合作申请
    const partnership = await this.prisma.lead.create({
      data: {
        name: dto.contactName,
        company: dto.company,
        phone: dto.phone,
        email: dto.email,
        source: `合作申请-${dto.partnershipType}`,
        contact: dto.region || '',
        status: 'NEW',
      },
    })

    return {
      code: 0,
      data: {
        id: partnership.id,
        message: '申请已提交，商务团队将尽快联系',
      },
    }
  }

  // ============================================
  // 搜索接口
  // ============================================

  @Get('search')
  @ApiOperation({ summary: '全局搜索 (官网)' })
  @ApiQuery({ name: 'keyword', required: true, type: String })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'news/case/product/all' })
  @ApiResponse({ status: 200, description: '搜索结果' })
  async search(@Query('keyword') keyword: string, @Query('type') type: string = 'all') {
    const results: any = {}

    if (type === 'all' || type === 'news') {
      results.news = await this.prisma.news.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { summary: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          summary: true,
          cover: true,
          publishedAt: true,
        },
        take: 10,
      })
    }

    if (type === 'all' || type === 'case') {
      results.cases = await this.prisma.case.findMany({
        where: {
          status: 'RESOLVED',
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { summary: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          summary: true,
          cover: true,
          type: true,
        },
        take: 10,
      })
    }

    if (type === 'all' || type === 'product') {
      results.products = await this.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          category: true,
          series: true,
        },
        take: 10,
      })
    }

    return {
      keyword,
      results,
      total: Object.values(results).reduce((sum: number, arr: any[]) => sum + arr.length, 0),
    }
  }
}
