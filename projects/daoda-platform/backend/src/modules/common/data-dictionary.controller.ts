/**
 * 数据字典控制器
 * API 接口：字典项管理、分类管理、版本管理、引用管理、数据验证
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { DataDictionaryService } from './data-dictionary.service'

@Controller('api/common/data-dictionary')
export class DataDictionaryController {
  constructor(private readonly service: DataDictionaryService) {}

  // ========== 字典项 ==========

  @Get('items')
  getItems(@Query() params?: any) {
    return this.service.getItems(params)
  }

  @Get('items/:id')
  getItem(@Param('id') id: string) {
    return this.service.getItem(id)
  }

  @Get('items/code/:code')
  getItemByCode(@Param('code') code: string) {
    return this.service.getItemByCode(code)
  }

  @Get('items/:code/options')
  getOptions(@Param('code') code: string) {
    return this.service.getOptions(code)
  }

  @Post('items')
  createItem(@Body() item: any) {
    return this.service.createItem(item)
  }

  @Post('items/:id')
  updateItem(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateItem(id, updates)
  }

  @Delete('items/:id')
  deleteItem(@Param('id') id: string) {
    return this.service.deleteItem(id)
  }

  @Post('items/:id/deprecate')
  deprecateItem(@Param('id') id: string, @Body('replacedBy') replacedBy?: string) {
    return this.service.deprecateItem(id, replacedBy)
  }

  // ========== 分类管理 ==========

  @Get('categories')
  getCategories(@Query('module') module?: string) {
    return this.service.getCategories(module as any)
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.service.getCategory(id)
  }

  @Post('categories')
  createCategory(@Body() category: any) {
    return this.service.createCategory(category)
  }

  @Post('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateCategory(id, updates)
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

  // ========== 引用管理 ==========

  @Get('references')
  getReferences(@Query('module') module?: string, @Query('itemCode') itemCode?: string) {
    return this.service.getReferences(module as any, itemCode)
  }

  @Post('references')
  createReference(@Body() ref: any) {
    return this.service.createReference(ref)
  }

  @Delete('references/:id')
  deleteReference(@Param('id') id: string) {
    return this.service.deleteReference(id)
  }

  // ========== 数据验证 ==========

  @Post('validate')
  validateValue(@Body('code') code: string, @Body('value') value: any) {
    return this.service.validateValue(code, value)
  }

  // ========== 批量操作 ==========

  @Post('items/batch')
  batchCreateItems(@Body() items: any[]) {
    return this.service.batchCreateItems(items)
  }

  @Post('items/batch-status')
  batchUpdateStatus(@Body('ids') ids: string[], @Body('status') status: string) {
    return this.service.batchUpdateStatus(ids, status as any)
  }

  // ========== 导入导出 ==========

  @Post('export')
  exportData(@Body() config: any) {
    return this.service.exportData(config)
  }

  @Post('import')
  importData(@Body('data') data: any, @Body('format') format: string) {
    return this.service.importData(data, format as any)
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
