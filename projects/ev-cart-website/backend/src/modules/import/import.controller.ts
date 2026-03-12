import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import * as XLSX from 'xlsx'

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  @Get('template')
  downloadTemplate(
    @Query('type') type: 'lead' | 'customer' | 'order',
    @Res() res: Response,
  ) {
    const templates: Record<string, any[]> = {
      lead: [
        {
          '客户名称': '示例公司',
          '联系人': '张三',
          '联系电话': '13800138000',
          '邮箱': 'example@company.com',
          '省份': '四川省',
          '城市': '成都市',
          '线索来源': '官网',
          '备注': '示例数据',
        },
      ],
      customer: [
        {
          '客户名称': '示例公司',
          '联系人': '张三',
          '联系电话': '13800138000',
          '邮箱': 'example@company.com',
          '省份': '四川省',
          '城市': '成都市',
          '地址': '高新区某某大厦',
          '客户等级': 'A',
          '行业': '制造业',
          '备注': '示例数据',
        },
      ],
      order: [
        {
          '订单号': 'ORD20260312001',
          '客户名称': '示例公司',
          '产品名称': '产品 A',
          '数量': 100,
          '单价': 1000,
          '金额': 100000,
          '交货日期': '2026-04-01',
          '备注': '示例数据',
        },
      ],
    }

    const data = templates[type] || []
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${type}_template.xlsx"`,
    )
    res.send(buffer)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'lead' | 'customer' | 'order',
  ) {
    // 解析 Excel 文件
    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: any[] = XLSX.utils.sheet_to_json(worksheet)

    // 验证数据
    const errors: any[] = []
    const validData: any[] = []

    data.forEach((row, index) => {
      // 简单验证
      if (!row['客户名称']) {
        errors.push({ row: index + 2, message: '缺少客户名称' })
      } else {
        validData.push(row)
      }
    })

    return {
      success: errors.length === 0,
      total: data.length,
      valid: validData.length,
      invalid: errors.length,
      errors,
      data: validData,
    }
  }
}
