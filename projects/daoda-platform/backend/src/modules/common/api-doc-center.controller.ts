/**
 * API文档中心控制器
 * API 接口：接口文档、版本管理、接口测试、调用统计、OpenAPI导出
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { ApiDocCenterService, HttpMethod } from './api-doc-center.service'

@Controller('api/common/api-doc-center')
export class ApiDocCenterController {
  constructor(private readonly service: ApiDocCenterService) {}

  // ========== 接口管理 ==========

  @Get('endpoints')
  getEndpoints(@Query() params?: any) {
    return this.service.getEndpoints(params)
  }

  @Get('endpoints/:id')
  getEndpoint(@Param('id') id: string) {
    return this.service.getEndpoint(id)
  }

  @Get('endpoints/by-path')
  getEndpointByPath(@Query('path') path: string, @Query('method') method: string) {
    return this.service.getEndpointByPath(path, method as HttpMethod)
  }

  @Post('endpoints')
  createEndpoint(@Body() endpoint: any) {
    return this.service.createEndpoint(endpoint)
  }

  @Post('endpoints/:id')
  updateEndpoint(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateEndpoint(id, updates)
  }

  @Delete('endpoints/:id')
  deleteEndpoint(@Param('id') id: string) {
    return this.service.deleteEndpoint(id)
  }

  @Post('endpoints/:id/deprecate')
  deprecateEndpoint(@Param('id') id: string, @Body('replacedBy') replacedBy?: string) {
    return this.service.deprecateEndpoint(id, replacedBy)
  }

  // ========== 版本管理 ==========

  @Get('versions')
  getVersions() {
    return this.service.getVersions()
  }

  @Get('versions/:id')
  getVersion(@Param('id') id: string) {
    return this.service.getVersion(id)
  }

  @Post('versions')
  createVersion(@Body() version: any) {
    return this.service.createVersion(version)
  }

  @Post('versions/:id/publish')
  publishVersion(@Param('id') id: string) {
    return this.service.publishVersion(id)
  }

  @Post('versions/:id/deprecate')
  deprecateVersion(@Param('id') id: string, @Body('deprecateDate') deprecateDate: string) {
    return this.service.deprecateVersion(id, new Date(deprecateDate))
  }

  // ========== 分类管理 ==========

  @Get('categories')
  getCategories() {
    return this.service.getCategories()
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.service.getCategory(id)
  }

  @Post('categories')
  createCategory(@Body() category: any) {
    return this.service.createCategory(category)
  }

  // ========== 接口测试 ==========

  @Post('test')
  testEndpoint(@Body() request: any) {
    return this.service.testEndpoint(request)
  }

  // ========== 调用统计 ==========

  @Get('endpoints/:id/stats')
  getCallStats(
    @Param('id') endpointId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getCallStats(endpointId, startDate, endDate)
  }

  @Get('stats/overall')
  getOverallStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.service.getOverallStats(startDate, endDate)
  }

  // ========== OpenAPI导出 ==========

  @Post('export')
  exportOpenApi(@Body() config: any) {
    return this.service.exportOpenApi(config)
  }

  // ========== 统计与搜索 ==========

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.service.search(keyword)
  }
}
