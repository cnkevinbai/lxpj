import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DealerLevelService } from '../services/dealer-level.service'

@ApiTags('经销商等级')
@ApiBearerAuth()
@Controller('dealer-levels')
export class DealerLevelController {
  constructor(private readonly levelService: DealerLevelService) {}

  @Post(':dealerId/change')
  @ApiOperation({ summary: '调整经销商等级' })
  changeLevel(
    @Param('dealerId', ParseUUIDPipe) dealerId: string,
    @Body('newLevel') newLevel: string,
    @Body('reason') reason: string,
    @Body('reasonType') reasonType: string,
    @Body('effectiveDate') effectiveDate?: Date,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.levelService.changeLevel(dealerId, newLevel, reason, reasonType, userId, userName, effectiveDate)
  }

  @Post(':dealerId/evaluate')
  @ApiOperation({ summary: '自动评估等级' })
  evaluateAndAdjust(@Param('dealerId', ParseUUIDPipe) dealerId: string, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.levelService.evaluateAndAdjust(dealerId, userId, userName)
  }

  @Get('history/:dealerId')
  @ApiOperation({ summary: '获取经销商等级变更历史' })
  getHistory(
    @Param('dealerId', ParseUUIDPipe) dealerId: string,
    @Query('limit') limit: number = 20,
  ) {
    return this.levelService.getHistory(dealerId, limit)
  }

  @Get('history')
  @ApiOperation({ summary: '获取所有等级变更历史' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('oldLevel') oldLevel?: string,
    @Query('newLevel') newLevel?: string,
    @Query('reasonType') reasonType?: string,
  ) {
    return this.levelService.findAll({ page, limit, oldLevel, newLevel, reasonType })
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取等级变更统计' })
  getStatistics() {
    return this.levelService.getStatistics()
  }
}
