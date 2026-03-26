import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { ReportService } from './services/report.service'

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  @ApiOperation({ summary: '销售报表' })
  getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('businessType') businessType: string,
  ) {
    return this.reportService.getSalesReport(startDate, endDate, businessType)
  }

  @Get('customers')
  @ApiOperation({ summary: '客户报表' })
  getCustomerReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('businessType') businessType: string,
  ) {
    return this.reportService.getCustomerReport(startDate, endDate, businessType)
  }

  @Get('leads')
  @ApiOperation({ summary: '线索报表' })
  getLeadReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('businessType') businessType: string,
  ) {
    return this.reportService.getLeadReport(startDate, endDate, businessType)
  }

  @Get('export')
  @ApiOperation({ summary: '导出数据' })
  async exportData(
    @Query('type') type: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    // TODO: 实现数据导出逻辑
    res.send('Export functionality')
  }
}
