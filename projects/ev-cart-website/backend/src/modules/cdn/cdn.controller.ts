import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CdnService } from './cdn.service'

@ApiTags('cdn')
@Controller('cdn')
export class CdnController {
  constructor(private readonly cdnService: CdnService) {}

  @Post('refresh')
  @ApiOperation({ summary: '刷新 CDN 缓存' })
  refreshCache(@Body('urls') urls: string[]) {
    return this.cdnService.refreshCache(urls)
  }

  @Post('prefetch')
  @ApiOperation({ summary: '预热 CDN 缓存' })
  prefetchCache(@Body('urls') urls: string[]) {
    return this.cdnService.prefetchCache(urls)
  }

  @Get('usage')
  @ApiOperation({ summary: '获取 CDN 用量统计' })
  getUsage(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.cdnService.getUsage(startDate, endDate)
  }
}
