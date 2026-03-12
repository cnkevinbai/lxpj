import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SalesForecastService } from './sales-forecast.service'

@ApiTags('sales-forecast')
@Controller('sales-forecast')
@UseGuards(JwtAuthGuard)
export class SalesForecastController {
  constructor(private readonly forecastService: SalesForecastService) {}

  @Get()
  @ApiOperation({ summary: '获取销售预测' })
  async getForecast(
    @Query('period') period: 'week' | 'month' | 'quarter' = 'month',
  ) {
    return this.forecastService.getForecast(period)
  }

  @Get('leaderboard')
  @ApiOperation({ summary: '获取销售业绩排行' })
  async getLeaderboard(
    @Query('period') period: 'month' | 'quarter' | 'year' = 'month',
  ) {
    return this.forecastService.getSalesLeaderboard(period)
  }
}
