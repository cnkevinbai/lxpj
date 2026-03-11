import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { PdfService } from './pdf.service'

@ApiTags('pdf')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('sales-report')
  @ApiOperation({ summary: '生成销售报表 PDF' })
  async generateSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    // TODO: 从报表服务获取数据
    const data = {
      totalOrders: 100,
      totalAmount: 1000000,
      byMonth: {},
      startDate,
      endDate,
    }

    const pdf = await this.pdfService.generateSalesReport(data)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.pdf')
    res.send(pdf)
  }

  @Get('customer-report')
  @ApiOperation({ summary: '生成客户报表 PDF' })
  async generateCustomerReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const data = {
      totalCustomers: 500,
      byLevel: {},
      startDate,
      endDate,
    }

    const pdf = await this.pdfService.generateCustomerReport(data)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=customer-report.pdf')
    res.send(pdf)
  }

  @Get('lead-report')
  @ApiOperation({ summary: '生成线索报表 PDF' })
  async generateLeadReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const data = {
      totalLeads: 1000,
      conversionRate: 25,
      bySource: {},
      startDate,
      endDate,
    }

    const pdf = await this.pdfService.generateLeadReport(data)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=lead-report.pdf')
    res.send(pdf)
  }
}
