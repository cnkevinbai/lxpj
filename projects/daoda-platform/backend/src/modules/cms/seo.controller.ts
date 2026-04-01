/**
 * SEO 管理控制器
 * SEO 优化与搜索引擎配置 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { SEOService, SEOType, KeywordType } from './seo.service'

@Controller('api/cms/seo')
export class SeoController {
  constructor(private readonly service: SEOService) {}

  // ========== 全局配置 ==========

  @Get('global-config')
  async getGlobalConfig() {
    return this.service.getGlobalConfig()
  }

  @Post('global-config')
  async updateGlobalConfig(
    @Body()
    data: Partial<{
      title: string
      description: string
      keywords: string[]
      robotsTxt: string
      sitemapUrl: string
      canonicalUrl: string
    }>,
  ) {
    return this.service.updateGlobalConfig(data)
  }

  // ========== SEO 配置 ==========

  @Get('configs')
  async getAllConfigs(@Query('type') type?: SEOType) {
    return this.service.getAllConfigs(type)
  }

  @Get('configs/:id')
  async getConfigById(@Param('id') id: string) {
    return this.service.getConfigById(id)
  }

  @Get('configs/target/:targetId')
  async getConfigByTarget(@Param('targetId') targetId: string) {
    return this.service.getConfigByTarget(targetId)
  }

  @Post('configs')
  async createConfig(
    @Body()
    data: Partial<{
      targetId: string
      targetName: string
      type: SEOType
      title: string
      description: string
      keywords: string[]
      canonicalUrl?: string
      ogImage?: string
    }>,
  ) {
    return this.service.createConfig(data)
  }

  @Post('configs/:id')
  async updateConfig(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      title: string
      description: string
      keywords: string[]
      canonicalUrl?: string
      ogImage?: string
    }>,
  ) {
    return this.service.updateConfig(id, data)
  }

  @Delete('configs/:id')
  async deleteConfig(@Param('id') id: string) {
    return this.service.deleteConfig(id)
  }

  // ========== SEO 分析 ==========

  @Post('configs/:id/analyze')
  async analyzeSEO(@Param('id') id: string) {
    return this.service.analyzeSEO(id)
  }

  // ========== 关键词管理 ==========

  @Get('keywords')
  async getAllKeywords(@Query('type') type?: KeywordType) {
    return this.service.getAllKeywords(type)
  }

  @Get('keywords/:id')
  async getKeywordById(@Param('id') id: string) {
    return this.service.getKeywordById(id)
  }

  @Post('keywords')
  async createKeyword(
    @Body()
    data: Partial<{
      word: string
      type: KeywordType
      targetUrl?: string
      searchVolume?: number
      difficulty?: number
    }>,
  ) {
    return this.service.createKeyword(data)
  }

  @Post('keywords/:id')
  async updateKeyword(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      word: string
      type: KeywordType
      targetUrl?: string
      searchVolume?: number
      difficulty?: number
    }>,
  ) {
    return this.service.updateKeyword(id, data)
  }

  @Delete('keywords/:id')
  async deleteKeyword(@Param('id') id: string) {
    return this.service.deleteKeyword(id)
  }

  @Get('keywords/search')
  async searchKeywords(@Query('query') query: string) {
    return this.service.searchKeywords(query)
  }

  // ========== 排名更新 ==========

  @Post('rankings/update')
  async updateRankings(@Body() body: { rankings: Record<string, number> }) {
    return this.service.updateRankings(body.rankings)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}
