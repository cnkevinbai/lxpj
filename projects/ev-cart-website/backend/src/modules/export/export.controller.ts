import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { ExportService } from './export.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('export')
@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('customers')
  @ApiOperation({ summary: '导出客户数据' })
  async exportCustomers(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportCustomers(startDate, endDate)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=customers_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('leads')
  @ApiOperation({ summary: '导出线索数据' })
  async exportLeads(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportLeads(startDate, endDate)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=leads_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('opportunities')
  @ApiOperation({ summary: '导出商机数据' })
  async exportOpportunities(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportOpportunities(startDate, endDate)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=opportunities_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('orders')
  @ApiOperation({ summary: '导出订单数据' })
  async exportOrders(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportOrders(startDate, endDate)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=orders_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('dealers')
  @ApiOperation({ summary: '导出经销商数据' })
  async exportDealers(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string, @Res() res?: Response) {
    const buffer = await this.exportService.exportDealers(startDate, endDate)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=dealers_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }
}
