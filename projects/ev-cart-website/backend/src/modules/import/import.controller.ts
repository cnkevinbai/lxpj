import { Controller, Post, Get, Body, File, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ImportService } from './import.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('import')
@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('leads')
  @ApiOperation({ summary: '导入线索' })
  async importLeads(
    @File() file: Express.Multer.File,
    @Query('businessType') businessType: string,
  ) {
    const data = await this.importService.parseExcel(file.buffer)
    const validation = this.importService.validateData(data, 'leads')

    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }

    const leads = await this.importService.importLeads(data, businessType, 'user-id')
    return { success: true, count: leads.length }
  }

  @Post('customers')
  @ApiOperation({ summary: '导入客户' })
  async importCustomers(
    @File() file: Express.Multer.File,
    @Query('businessType') businessType: string,
  ) {
    const data = await this.importService.parseExcel(file.buffer)
    const validation = this.importService.validateData(data, 'customers')

    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }

    const customers = await this.importService.importCustomers(data, businessType, 'user-id')
    return { success: true, count: customers.length }
  }

  @Get('template')
  @ApiOperation({ summary: '下载导入模板' })
  async downloadTemplate(
    @Query('type') type: string,
    @Body() res: any,
  ) {
    const template = this.importService.generateTemplate(type)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=${type}_template.xlsx`)
    res.send(template)
  }
}
