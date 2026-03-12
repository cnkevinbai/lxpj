import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ExportService } from './export.service'

@ApiTags('外贸管理')
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('orders')
  @ApiOperation({ summary: '获取外贸订单列表' })
  getExportOrders(@Query() params: any) {
    return this.exportService.getExportOrders(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取外贸统计' })
  getStatistics() {
    return this.exportService.getStatistics()
  }
}
