import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ReportsService } from './reports.service'

@ApiTags('报表中心')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: '获取销售报表' })
  getSalesReport(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string) {
    return this.reportsService.getSalesReport(dateFrom, dateTo)
  }

  @Get('customer')
  @ApiOperation({ summary: '获取客户报表' })
  getCustomerReport(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string) {
    return this.reportsService.getCustomerReport(dateFrom, dateTo)
  }

  @Get('product')
  @ApiOperation({ summary: '获取产品报表' })
  getProductReport(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string) {
    return this.reportsService.getProductReport(dateFrom, dateTo)
  }

  @Get('dealer')
  @ApiOperation({ summary: '获取经销商报表' })
  getDealerReport(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string) {
    return this.reportsService.getDealerReport(dateFrom, dateTo)
  }

  @Get('recruitment')
  @ApiOperation({ summary: '获取招聘报表' })
  getRecruitmentReport(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string) {
    return this.reportsService.getRecruitmentReport(dateFrom, dateTo)
  }
}
