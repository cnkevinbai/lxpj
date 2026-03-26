import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ForeignCurrencyService } from './services/foreign-currency.service'

@ApiTags('foreign-currency')
@Controller('foreign-currency')
@UseGuards(JwtAuthGuard)
export class ForeignCurrencyController {
  constructor(private readonly currencyService: ForeignCurrencyService) {}

  @Get()
  @ApiOperation({ summary: '获取所有可用货币' })
  async getAllCurrencies(@Query('enabled') enabled?: string) {
    const enabledOnly = enabled !== 'false'
    return this.currencyService.getAllCurrencies(enabledOnly)
  }

  @Get(':code')
  @ApiOperation({ summary: '获取货币详情' })
  async getCurrency(@Param('code') code: string) {
    return this.currencyService.getCurrency(code)
  }

  @Post('convert')
  @ApiOperation({ summary: '货币转换' })
  async convertCurrency(
    @Body() dto: {
      amount: number
      fromCurrency: string
      toCurrency: string
      date?: string
    },
  ) {
    return this.currencyService.convertCurrency({
      ...dto,
      date: dto.date ? new Date(dto.date) : new Date(),
    })
  }

  @Get('rate/:from/:to')
  @ApiOperation({ summary: '获取汇率' })
  async getExchangeRate(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('date') date?: string,
  ) {
    return this.currencyService.getExchangeRate(
      from,
      to,
      date ? new Date(date) : new Date(),
    )
  }

  @Get('trend/:from/:to')
  @ApiOperation({ summary: '获取汇率趋势' })
  async getRateTrend(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('days') days?: string,
  ) {
    return this.currencyService.getRateTrend(from, to, parseInt(days || '30'))
  }
}
