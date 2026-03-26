import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { SettingService } from './services/setting.service'
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto'

@ApiTags('settings')
@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOperation({ summary: '获取所有设置' })
  findAll() {
    return this.settingService.findAll()
  }

  @Get(':key')
  @ApiOperation({ summary: '获取设置详情' })
  findOne(@Param('key') key: string) {
    return this.settingService.findOne(key)
  }

  @Post()
  @ApiOperation({ summary: '创建设置' })
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto)
  }

  @Put(':key')
  @ApiOperation({ summary: '更新设置' })
  update(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(key, updateSettingDto)
  }

  @Delete(':key')
  @ApiOperation({ summary: '删除设置' })
  remove(@Param('key') key: string) {
    return this.settingService.remove(key)
  }
}
