import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { FinanceService } from '../services/finance.service'

@ApiTags('财务管理')
@ApiBearerAuth()
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('receivables')
  @ApiOperation({ summary: '获取应收账款列表' })
  getReceivables(@Query() params: any) {
    return this.financeService.getReceivables(params)
  }

  @Post('receivables')
  @ApiOperation({ summary: '创建应收账款' })
  createReceivable(@Body() data: any, @Request() req: any) {
    const userId = req.user?.id || 'system'
    return this.financeService.createReceivable(data, userId)
  }

  @Post('payments')
  @ApiOperation({ summary: '记录收款' })
  recordPayment(@Body() data: any, @Request() req: any) {
    const userId = req.user?.id || 'system'
    return this.financeService.recordPayment(data, userId)
  }

  @Get('payments')
  @ApiOperation({ summary: '获取收款记录' })
  getPayments(@Query() params: any) {
    return this.financeService.getPayments(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取财务统计' })
  getStatistics() {
    return this.financeService.getStatistics()
  }
}
