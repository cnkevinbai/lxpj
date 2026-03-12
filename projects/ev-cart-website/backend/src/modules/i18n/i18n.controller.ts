import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { I18nService } from './i18n.service'

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('languages')
  @ApiOperation({ summary: '获取支持的语言列表' })
  getSupportedLanguages() {
    return this.i18nService.getSupportedLanguages()
  }

  @Get('translate/:key')
  @ApiOperation({ summary: '获取单个翻译' })
  translate(
    @Param('key') key: string,
    @Query('lang') lang = 'en',
  ) {
    return {
      key,
      language: lang,
      translation: this.i18nService.translate(key, lang),
    }
  }

  @Post('translate/batch')
  @ApiOperation({ summary: '批量获取翻译' })
  batchTranslate(
    @Body() dto: { keys: string[]; language?: string },
  ) {
    return this.i18nService.batchTranslate(dto.keys, dto.language || 'en')
  }
}
