import { Controller, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SettingsService } from './services/settings.service'

@ApiTags('系统设置')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: '获取系统设置' })
  getSettings() {
    return this.settingsService.getSettings()
  }

  @Put('basic')
  @ApiOperation({ summary: '更新基础设置' })
  updateBasic(@Body() settings: any) {
    return this.settingsService.updateBasic(settings)
  }

  @Put('notification')
  @ApiOperation({ summary: '更新通知设置' })
  updateNotification(@Body() settings: any) {
    return this.settingsService.updateNotification(settings)
  }

  @Get('dictionary')
  @ApiOperation({ summary: '获取字典数据' })
  getDictionary(@Query('category') category: string) {
    return this.settingsService.getDictionary(category)
  }

  @Post('dictionary')
  @ApiOperation({ summary: '添加字典项' })
  addDictionaryItem(@Query('category') category: string, @Body('item') item: string) {
    return this.settingsService.addDictionaryItem(category, item)
  }

  @Delete('dictionary')
  @ApiOperation({ summary: '删除字典项' })
  deleteDictionaryItem(@Query('category') category: string, @Body('item') item: string) {
    return this.settingsService.deleteDictionaryItem(category, item)
  }
}
