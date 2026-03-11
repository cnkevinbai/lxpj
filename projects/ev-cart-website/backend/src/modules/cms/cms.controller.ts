import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CmsService } from './cms.service'

@ApiTags('cms')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // Case 接口
  @Post('cases')
  @ApiOperation({ summary: '创建案例' })
  createCase(@Body() data: any) {
    return this.cmsService.createCase(data)
  }

  @Get('cases')
  @ApiOperation({ summary: '获取案例列表' })
  findAllCases(@Query('status') status?: string) {
    return this.cmsService.findAllCases(status)
  }

  @Get('cases/:id')
  @ApiOperation({ summary: '获取案例详情' })
  findOneCase(@Param('id') id: string) {
    return this.cmsService.findOneCase(id)
  }

  @Put('cases/:id')
  @ApiOperation({ summary: '更新案例' })
  updateCase(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateCase(id, data)
  }

  @Delete('cases/:id')
  @ApiOperation({ summary: '删除案例' })
  removeCase(@Param('id') id: string) {
    return this.cmsService.removeCase(id)
  }

  // News 接口
  @Post('news')
  @ApiOperation({ summary: '创建新闻' })
  createNews(@Body() data: any) {
    return this.cmsService.createNews(data)
  }

  @Get('news')
  @ApiOperation({ summary: '获取新闻列表' })
  findAllNews(@Query('status') status?: string) {
    return this.cmsService.findAllNews(status)
  }

  @Get('news/:id')
  @ApiOperation({ summary: '获取新闻详情' })
  findOneNews(@Param('id') id: string) {
    return this.cmsService.findOneNews(id)
  }

  @Put('news/:id')
  @ApiOperation({ summary: '更新新闻' })
  updateNews(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateNews(id, data)
  }

  @Delete('news/:id')
  @ApiOperation({ summary: '删除新闻' })
  removeNews(@Param('id') id: string) {
    return this.cmsService.removeNews(id)
  }
}
