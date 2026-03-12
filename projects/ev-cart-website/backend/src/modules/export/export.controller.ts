import { Controller, Get, Query, Res, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'
import { ExportService, ExportOptions } from './export.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { getClientIp } from '../../common/utils/get-client-ip.util'

@ApiTags('export')
@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  private getExportOptions(req: any, query: any): ExportOptions {
    return {
      userId: req.user.id,
      userName: req.user.name,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
      startDate: query.startDate,
      endDate: query.endDate,
      desensitize: query.desensitize === 'true',
    }
  }

  @Get('customers')
  @ApiOperation({ summary: '导出客户数据' })
  async exportCustomers(
    @Query() query: any,
    @Request() req: any,
    @Res() res?: Response,
  ) {
    const options = this.getExportOptions(req, query)
    const buffer = await this.exportService.exportCustomers(options)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=customers_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('leads')
  @ApiOperation({ summary: '导出线索数据' })
  async exportLeads(
    @Query() query: any,
    @Request() req: any,
    @Res() res?: Response,
  ) {
    const options = this.getExportOptions(req, query)
    const buffer = await this.exportService.exportLeads(options)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=leads_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('opportunities')
  @ApiOperation({ summary: '导出商机数据' })
  async exportOpportunities(
    @Query() query: any,
    @Request() req: any,
    @Res() res?: Response,
  ) {
    const options = this.getExportOptions(req, query)
    const buffer = await this.exportService.exportOpportunities(options)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=opportunities_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('orders')
  @ApiOperation({ summary: '导出订单数据' })
  async exportOrders(
    @Query() query: any,
    @Request() req: any,
    @Res() res?: Response,
  ) {
    const options = this.getExportOptions(req, query)
    const buffer = await this.exportService.exportOrders(options)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=orders_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }

  @Get('dealers')
  @ApiOperation({ summary: '导出经销商数据' })
  async exportDealers(
    @Query() query: any,
    @Request() req: any,
    @Res() res?: Response,
  ) {
    const options = this.getExportOptions(req, query)
    const buffer = await this.exportService.exportDealers(options)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=dealers_${new Date().toISOString().split('T')[0]}.xlsx`)
    res.send(buffer)
  }
}
